# Architecture

## Stack

| Layer      | Choice                                                                              |
| ---------- | ----------------------------------------------------------------------------------- |
| Framework  | Next.js 16 App Router, TypeScript, `@/` → `src/*`                                   |
| UI         | Tailwind CSS v4 (`@tailwindcss/postcss`), shadcn/ui (`base-nova`), `motion/react`   |
| Data       | MongoDB via Mongoose 9 (singleton on `globalThis.mongoose`, `src/lib/db.ts`)        |
| AI         | LangChain Core + `@langchain/google-genai` + `@langchain/openai`, temperature `0.3` |
| Vectors    | Pinecone `@pinecone-database/pinecone` + `@langchain/pinecone` (optional)           |
| Auth       | Scalekit B2B OAuth (`@scalekit-sdk/node`), `httpOnly` cookie `access_token` (24h)   |
| Cache/rate | Upstash Redis `@upstash/redis` (optional, graceful no-op)                           |
| State      | Local `useState` + TanStack React Query; no global store                            |

## Folder map

```text
src/
  app/
    page.tsx                    # landing page
    layout.tsx                  # fonts, metadata, QueryProvider
    api/
      auth/login|verify|logout/route.ts
      chat/route.ts             # POST public chat
      chat/config/route.ts      # GET public widget theming
      chatbots/route.ts         # GET list, POST create
      chatbots/[botId]/route.ts # GET, PUT, DELETE
      chatbots/[botId]/documents/route.ts
      chatbots/[botId]/documents/[docId]/route.ts
      chatbots/[botId]/conversations/route.ts
      chatbots/[botId]/analytics/route.ts
      analytics/route.ts        # account activity series
      account/route.ts          # Notion token
    (user)/dashboard/           # route group: URLs stay /dashboard/...
      page.tsx                  # overview
      agents/ agents/new/
      bots/[botId]/             # overview, config, knowledge,
                                # appearance, conversations, playground, embed
      plugins/ account/
  components/
    *.tsx                       # landing sections (Navbar, Hero, Pricing, ...)
    dashboard/                  # AppSidebar, CreateAgentWizard, BotConfigForm,
                                # KnowledgeManager, AppearanceForm, AgentPlayground,
                                # ConversationsView, OverviewContent, Embed, ...
    ui/                         # shadcn primitives
  lib/
    env.ts db.ts scalekit.ts getUserSession.ts auth.ts
    ai.ts providerKey.ts options.ts validations.ts knowledge.ts
    rag.ts extractFile.ts cache.ts rate-limit.ts
    chatbots.ts analytics.ts activity-ranges.ts axios.ts query-keys.ts utils.ts
  models/
    chatbot.model.ts conversation.model.ts message.model.ts
    document.model.ts chunk.model.ts owner.model.ts
  proxy.ts                      # Next 16 proxy: guards /dashboard/:path*
  hooks/ providers/
public/
  chat_bot.js                   # embed widget (vanilla JS, no build)
  index.html                    # widget demo
scripts/
  migrate-business-to-chatbot.mjs
```

## Request flows

### Dashboard page (authenticated)

```mermaid
flowchart LR
  Browser --> Proxy[src/proxy.ts]
  Proxy -->|getUserSession| Scalekit
  Proxy --> Page[Server Component]
  Page -->|requireOwner| MongoDB
  Page --> Client[Client Component]
  Client -->|React Query + apiClient| API[/api/*]
  API -->|requireOwner + ownerId filter| MongoDB
```

Dual guard: `proxy()` redirects unauthenticated `/dashboard/*` to `ENV.API_URI`, and each layout/page also calls `requireOwner()` and redirects to `/api/auth/login`.

### Public chat (embed)

```mermaid
flowchart LR
  Widget[chat_bot.js] -->|GET config| ConfigAPI[/api/chat/config]
  ConfigAPI --> Redis[(Upstash)]
  ConfigAPI --> MongoDB[(Mongo Chatbot)]
  Widget -->|POST prompt| ChatAPI[/api/chat]
  ChatAPI -->|rate limit| Redis
  ChatAPI --> MongoDB
  ChatAPI -->|top-5 chunks| Pinecone[(Pinecone)]
  ChatAPI --> LLM[Gemini / OpenAI]
  ChatAPI -->|persist user+model| MongoDB
```

Key rules (`src/app/api/chat/route.ts`):

- Public route with `Access-Control-Allow-Origin: *`. No session required.
- Only `live` bots answer embedded chat (draft → `404 "This chatbot is not published yet."`). `preview: true` bypasses the live check and is never persisted.
- History: preview replays `history` from the request; embedded chat loads the last 20 messages from Mongo by `sessionId`.
- RAG is best-effort: retrieval failures are logged, the answer still returns.
- Response shape: `{ success: true, data: { role: "model", text } }`.

### Knowledge ingestion

```mermaid
flowchart LR
  Dashboard -->|POST multipart or JSON| DocsAPI[/api/chatbots/:botId/documents]
  DocsAPI --> Extract[src/lib/extractFile.ts]
  Extract --> Split[splitText 1000/150]
  Split --> Embed[provider embeddings 768d]
  Embed --> Pinecone
  Embed --> MongoDB[(Document + Chunk)]
```

Document goes `processing → ready` (or `error` with `500 "Failed to index"`).

## Database schema

| Collection      | Model file              | Key fields                                                                                                                                                                                                                                                             |
| --------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chatbots`      | `chatbot.model.ts`      | `ownerId` (indexed), `name`, `status: draft\|live`, `supportEmail`, `provider: gemini\|openai`, `model` (empty = default), `apiKeyOverride` (per-bot secret), `businessInfo{}`, `botInfo{}`, `appearance{}` + `APPEARANCE_DEFAULTS`, `knowledge` (built system prompt) |
| `conversations` | `conversation.model.ts` | `botId` + `ownerId` (indexed), `sessionId`, unique `{botId, sessionId}`, `startedAt`, `lastMessageAt`, `messageCount`                                                                                                                                                  |
| `messages`      | `message.model.ts`      | `conversationId` + `botId` (indexed), `role: user\|model`, `text`, `createdAt` only                                                                                                                                                                                    |
| `documents`     | `document.model.ts`     | `botId` + `ownerId` (indexed), `title`, `sourceType: file\|url\|text\|notion`, `notionResourceId/Type`, `status: processing\|ready\|error`, `chunkCount`                                                                                                               |
| `chunks`        | `chunk.model.ts`        | `botId` + `documentId` (indexed), `pineconeId` (`${docId}_${i}`), `text` — Mongo mirror of Pinecone vectors                                                                                                                                                            |
| `owners`        | `owner.model.ts`        | `ownerId` unique, `notionIntegrationToken` (`select: false`, read with `+` prefix)                                                                                                                                                                                     |

Cascade on bot delete: `conversations`, `messages`, `documents`, `chunks` `deleteMany({botId})` + Pinecone `deleteVectors()`.

## Key patterns

- **Server/client boundary:** server components fetch session + DB and pass props; `"use client"` components handle interactivity.
- **Owner isolation:** `requireOwner()` (`src/lib/auth.ts`) derives `ownerId` from the session. Never trust a client-supplied owner id; every query filters by it.
- **Per-bot keys:** `resolveProviderKey()` (`src/lib/providerKey.ts`) trims `apiKeyOverride` and falls back to the provider default model. No account-level key.
- **Validation:** Zod in `src/lib/validations.ts` (chat request, chatbot create/update, document url/text/notion union). `POST /api/chatbots` is lenient (falls back to `{}`); `PUT` is strict.
- **Cache invalidation is manual:** chat writes clear `cache:analytics:*` + `cache:conversations:*`; bot updates clear `cache:bot*` + analytics + conversations.
- **File parsing quirks:** `next.config.ts` lists `mammoth` in `serverExternalPackages`; PDFs use dynamic `import("unpdf")`.
- **Embeddings pinned to 768d:** Gemini `gemini-embedding-001` truncated via MRL, OpenAI `text-embedding-3-small` reduced. Switching models invalidates all Pinecone vectors (see `src/lib/ai.ts` NOTE).
