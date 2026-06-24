# AGENTS.md

## Commands

| Command              | What it runs                         |
| -------------------- | ------------------------------------ |
| `npm run dev`        | `next dev` (dev server on :3000)     |
| `npm run build`      | `next build`                         |
| `npm run start`      | `next start`                         |
| `npm run lint`       | `eslint`                             |
| `npm run format`     | `prettier --check .`                 |
| `npm run format:fix` | `prettier --write .`                 |
| `npm run prepare`    | `husky` (auto-runs on `npm install`) |

No test or typecheck scripts exist.

## Git hooks (husky)

| Hook         | What it runs                                |
| ------------ | ------------------------------------------- |
| `pre-commit` | `npm run lint` + `npm run format`           |
| `commit-msg` | `commitlint` – enforces conventional commits |

## Environment

Copy `.env.local` template (all required unless noted):

| Var | Notes |
| --- | --- |
| `NEXT_PUBLIC_API_URI` | e.g. `http://localhost:3000` |
| `SCALEKIT_ENVIRONMENT_URL` | Scalekit tenant URL |
| `SCALEKIT_CLIENT_ID` | Scalekit OAuth client ID |
| `SCALEKIT_CLIENT_SECRET` | Scalekit OAuth client secret |
| `MONGODB_URI` | MongoDB connection string |
| `PINECONE_API_KEY` | *(optional)* Gates RAG feature |
| `PINECONE_INDEX` | *(optional)* Pinecone index name |

Env vars read in `src/lib/env.ts` – required ones crash at module import if missing.

## Architecture

- **Next.js 16 App Router** with TypeScript, `@/` alias → `./src/*`
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **MongoDB / Mongoose 9** – singleton cached on `globalThis.mongoose` (`src/lib/db.ts`)
- **Google Gemini** (`@langchain/google-genai`) + **OpenAI** (`@langchain/openai`) – per-bot provider/key/model stored in MongoDB
- **Scalekit** B2B OAuth – token stored in `httpOnly` cookie `access_token` (24h)
- **Pinecone** (`@pinecone-database/pinecone`) – optional vector store for RAG document retrieval
- **LangChain Core** wraps both providers for unified chat + embeddings interface
- Embedding dimension pinned to 768 so a single Pinecone index works across providers

## Key patterns

- **Server / client boundary**: server components fetch data (session, DB) and pass as props to client components. Client components (`"use client"`) handle all interactivity.
- **Route protection**: `src/proxy.ts` is a Next.js middleware **misnamed** – it exports `config.matcher` and the middleware signature but sits at `src/proxy.ts` instead of `src/middleware.ts`, so it is **not auto-invoked**. Dashboard pages call `requireOwner()` inline instead.
- **Auth flow**: `/api/auth/login` → Scalekit → `/api/auth/verify?code=...` → set cookie → redirect to `/dashboard`.
- **API response shape**: consistently `{ success: boolean, message?: string, data?: any, error?: any }`.
- **Per-bot API keys**: each agent carries its own provider, model, and API key. No account-level fallback.
- **Knowledge base**: two layers — (1) system instruction built from business/persona config via `buildKnowledge()`, (2) optional RAG document retrieval via Pinecone (gated by `PINECONE_API_KEY`).
- **Chat persistence**: preview/playground chats skip DB writes (`preview: true`); embedded chats with `sessionId` persist to Conversation + Message models.
- **RAG is optional**: `isRagConfigured()` checks for `PINECONE_API_KEY` + `PINECONE_INDEX`. Without them, only the system instruction is used.
- **CORS**: `/api/chat` and `/api/chat/config` return `Access-Control-Allow-Origin: *` for the embed widget.
- **No global state library** – form state is local `useState`. TanStack React Query for server state.
- **Embed widget**: self-contained vanilla JS at `public/chat_bot.js` (no build step). Reads `data-bot-id` attribute, fetches `/api/chat/config` for theming, posts to `/api/chat`.

## Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/auth/login` | — | Redirect to Scalekit OAuth |
| `GET` | `/api/auth/verify?code=` | — | OAuth callback → set cookie → redirect `/dashboard` |
| `GET` | `/api/auth/logout` | — | Delete cookie → redirect `/` |
| `POST` | `/api/chat` | CORS `*` | Send prompt to AI. Supports multi-turn via `sessionId`, preview mode via `preview: true` |
| `GET` | `/api/chat/config?botId=` | CORS `*` | Bot appearance (accent, avatar, displayName, welcomeMessage) |
| `GET` | `/api/chatbots` | session | List all chatbots for owner |
| `POST` | `/api/chatbots` | session | Create chatbot |
| `GET` | `/api/chatbots/[botId]` | session | Get single chatbot |
| `PUT` | `/api/chatbots/[botId]` | session | Update chatbot (regenerates knowledge string) |
| `DELETE` | `/api/chatbots/[botId]` | session | Delete chatbot + cascade (vectors, conversations, messages, docs, chunks) |
| `GET` | `/api/chatbots/[botId]/documents` | session | List knowledge documents |
| `POST` | `/api/chatbots/[botId]/documents` | session | Ingest document (file/URL/text) |
| `DELETE` | `/api/chatbots/[botId]/documents/[docId]` | session | Delete document + vectors |
| `GET` | `/api/chatbots/[botId]/analytics` | session | Per-bot stats (conversations, messages, lastActive) |
| `GET` | `/api/chatbots/[botId]/conversations` | session | List conversations or get transcript (`?conversationId=`) |

## Dashboard pages

All under `src/app/(user)/dashboard/`. Each page calls `requireOwner()` – redirects to login if null.

| Path | Description |
|---|---|
| `/dashboard` | Account analytics overview (stats, 14-day chart, top agents, recent convos) |
| `/dashboard/agents` | Agent grid with search, status badges, manage/delete |
| `/dashboard/agents/new` | 4-step creation wizard (Basics → Persona → Model → Review) |
| `/dashboard/bots/[botId]` | Per-bot stats |
| `/dashboard/bots/[botId]/playground` | Live chat test (no persistence) |
| `/dashboard/bots/[botId]/config` | Full config form + delete danger zone |
| `/dashboard/bots/[botId]/knowledge` | Document management (add/remove text, URL, file) |
| `/dashboard/bots/[botId]/appearance` | Color, avatar, name, welcome message + live preview |
| `/dashboard/bots/[botId]/embed` | Copy-paste `<script>` snippet |
| `/dashboard/bots/[botId]/conversations` | Two-panel conversation viewer |
| `/dashboard/account` | Profile, API key info, logout |
| `/dashboard/plugins` | Plugin marketplace cards |

## Models (Mongoose)

| Model | Collection | Key fields |
|---|---|---|
| `Chatbot` | `chatbots` | `ownerId`, `name`, `status` ("draft"\|"live"), `provider`, `model`, `apiKeyOverride`, `businessInfo`, `botInfo`, `appearance`, `knowledge` |
| `Conversation` | `conversations` | `botId`, `ownerId`, `sessionId` (unique per bot), `messageCount`, `lastMessageAt` |
| `Message` | `messages` | `conversationId`, `botId`, `role` ("user"\|"model"), `text` |
| `Document` | `documents` | `botId`, `ownerId`, `title`, `sourceType` ("file"\|"url"\|"text"), `status` ("processing"\|"ready"\|"error"), `chunkCount` |
| `Chunk` | `chunks` | `botId`, `documentId`, `pineconeId`, `text` |

## Providers & models

| Provider | Models | Embeddings |
|---|---|---|
| `gemini` | `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro` | `text-embedding-004` (768d) |
| `openai` | `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo` | `text-embedding-3-small` (768d) |

Default model for each provider is the first in its list (`gemini-2.0-flash`, `gpt-4o-mini`).

## Style

- Tailwind's zinc palette overridden with warm tones in `globals.css` (`@theme` block)
- `.bg-pinstripe` for landing page diagonal hatch background
- `motion/react` for animations, `lucide-react` icons
- `font-title` for badges/labels, `font-heading` for h1/h2, `font-sans` for body
- Custom heading fonts served from `/public/fonts/` (NormalFont, HeadingFont, TitleFont)
