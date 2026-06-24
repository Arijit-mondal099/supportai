# SupportAI

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot/pulls)

An intelligent, AI-powered customer support platform. Businesses create custom chatbots trained on their own knowledge base, embed them on any website, and let AI handle customer queries — all with a personalised tone and brand voice.

Built with **Next.js 16**, **Google Gemini / OpenAI**, **MongoDB**, and **Pinecone** for RAG.

---

## Features

| Feature | Description |
|---|---|
| **AI Chat** | Natural, context-aware responses via Gemini or OpenAI |
| **RAG Knowledge Base** | Upload PDFs, DOCX, TXT, MD, CSV — or paste text / scrape a URL — and get semantic search over your content |
| **Custom Persona** | Configure bot name, communication tone, and personality for each agent |
| **Chat Playground** | Test your bot live during configuration without persisting messages |
| **Embed Widget** | Drop-in `<script>` tag — zero-dependency chat widget on any site |
| **Multi-provider** | Per-agent provider selection: Google Gemini or OpenAI |
| **Scalekit Auth** | Enterprise B2B OAuth with automatic tenant isolation |
| **Conversation History** | Multi-turn chats persisted per visitor session |
| **Dashboard** | Analytics, knowledge management, appearance theming, conversation viewer |
| **Plugins Page** | Extensible plugin marketplace (Slack, WhatsApp, Zapier coming soon) |

---

## Tech Stack

### Framework & Language
| Tech | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Fullstack React framework |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

### UI & Styling
| Tech | Purpose |
|---|---|
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS |
| [Motion](https://motion.dev/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [shadcn/ui](https://ui.shadcn.com/) | Primitive UI components |
| [Recharts](https://recharts.org/) | Analytics charts |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |

### Database & Storage
| Tech | Purpose |
|---|---|
| [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) | Primary data store |
| [Pinecone](https://www.pinecone.io/) | Vector database for RAG |

### AI / LLM
| Tech | Purpose |
|---|---|
| [Google Generative AI SDK](https://github.com/googleapis/js-genai) | Gemini chat + embeddings |
| [OpenAI SDK](https://platform.openai.com/docs/libraries) | GPT chat + embeddings |
| [LangChain Core](https://js.langchain.com/) | Unified chat / embeddings interface |
| [LangChain TextSplitters](https://js.langchain.com/) | Document chunking |

### Authentication
| Tech | Purpose |
|---|---|
| [Scalekit SDK](https://scalekit.com/) | B2B OAuth with tenant isolation |

### Data Fetching
| Tech | Purpose |
|---|---|
| [TanStack React Query](https://tanstack.com/query) | Server state management |
| [Axios](https://axios-http.com/) | HTTP client |

### File Processing
| Tech | Purpose |
|---|---|
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | PDF text extraction |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | DOCX text extraction |

### Dev Tooling
| Tech | Purpose |
|---|---|
| Husky + lint-staged | Pre-commit hooks |
| Commitlint | Conventional commit enforcement |
| ESLint + Prettier | Code quality |

---

## Architecture

```
Client (Browser)                  Server (Next.js 16)
┌──────────────┐                  ┌──────────────────────────────┐
│ Landing Page │                  │  API Routes                  │
│  /           │ ◄──────────────► │  /api/auth/*                 │
│              │                  │  /api/chat                   │
│ Dashboard    │                  │  /api/chat/config            │
│  /dashboard  │                  │  /api/chatbots/*             │
│              │                  │                              │
│ Embed Widget │                  │  Server Components           │
│  chat_bot.js │                  │  page.tsx / layout.tsx       │
└──────────────┘                  │  (fetch + render on server)  │
                                  │                              │
                                  │  Client Components            │
                                  │  ("use client")              │
                                  │  (interactivity + mutations) │
                                  │                              │
                                  │  Database                    │
                                  │  MongoDB ──── Mongoose       │
                                  │  Pinecone ──── Vectors       │
                                  │                              │
                                  │  Auth                        │
                                  │  Scalekit ──── httpOnly      │
                                  │  cookie (access_token)       │
                                  └──────────────────────────────┘
```

### Key patterns

- **Server / client boundary**: Server components fetch data (session, DB) and pass as props to client components. Client components handle all interactivity.
- **Auth flow**: Scalekit OAuth → `/api/auth/verify` → sets `httpOnly` cookie → dashboard reads cookie on each request.
- **Chat flow**: Embed widget → `POST /api/chat` → LangChain model → response streamed back → conversation persisted to MongoDB.
- **Document flow**: Upload → extract text → chunk → embed → store vectors in Pinecone + metadata in MongoDB.

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm / yarn / pnpm / bun
- A [MongoDB](https://www.mongodb.com/) instance (Atlas or local)
- A [Scalekit](https://scalekit.com/) account (B2B OAuth)
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini) OR an [OpenAI](https://platform.openai.com/) API key
- (Optional) A [Pinecone](https://www.pinecone.io/) index for RAG

### Installation

```bash
git clone https://github.com/your-username/ai-customer-support-chatbot.git
cd ai-customer-support-chatbot
npm install
```

### Environment Variables

Copy `.env.local` and fill in the values:

```env
# Application
NEXT_PUBLIC_API_URI=http://localhost:3000

# Authentication (Scalekit)
SCALEKIT_ENVIRONMENT_URL=your_scalekit_env_url
SCALEKIT_CLIENT_ID=your_scalekit_client_id
SCALEKIT_CLIENT_SECRET=your_scalekit_client_secret

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/supportai

# RAG / Vector Search (optional — feature gates Pinecone)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

All required vars are read in `src/lib/env.ts` — missing values will crash at module import.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (user)/dashboard/        # Dashboard pages (protected)
│   │   ├── account/             # Profile & logout
│   │   ├── agents/              # Agent list + create wizard
│   │   └── bots/[botId]/        # Bot detail (config, playgrd, etc.)
│   ├── api/
│   │   ├── auth/                # Login, verify (OAuth callback), logout
│   │   ├── chat/                # Chat endpoint + widget config
│   │   └── chatbots/            # Full CRUD + documents + analytics
│   ├── globals.css              # Tailwind v4 theme & utilities
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page (redirects if logged in)
│   ├── not-found.tsx            # Custom 404 page
│   └── error.tsx                # Custom error boundary (with retry)
│
├── components/
│   ├── dashboard/               # Dashboard client components
│   │   ├── AgentsGrid.tsx, AgentPlayground.tsx, AppSidebar.tsx
│   │   ├── AppearanceForm.tsx, BotConfigForm.tsx
│   │   ├── ConversationsView.tsx, CreateAgentWizard.tsx
│   │   ├── DeleteBotSection.tsx, KnowledgeManager.tsx
│   │   ├── OverviewChart.tsx, OverviewContent.tsx
│   │   ├── PageTransition.tsx, TabBar.tsx
│   │   └── ...
│   ├── ui/                      # shadcn primitives
│   │   ├── button.tsx, card.tsx, dialog.tsx, sidebar.tsx
│   │   └── ...
│   ├── Embed.tsx                # Embed snippet display
│   ├── Navbar.tsx, Hero.tsx     # Landing page sections
│   ├── Feature.tsx, Platform.tsx, UseCases.tsx
│   ├── Resources.tsx, Pricing.tsx, Faq.tsx
│   ├── Footer.tsx, Input.tsx
│   └── ...
│
├── hooks/                       # React Query hooks
│   ├── use-bots.ts              # CRUD mutations
│   ├── use-chat.ts              # Chat mutation
│   ├── use-conversations.ts     # Conversation queries
│   ├── use-documents.ts         # Document CRUD
│   └── use-mobile.ts            # Responsive sidebar
│
├── lib/                         # Server-side utilities
│   ├── ai.ts                    # LangChain model factory
│   ├── analytics.ts             # Account analytics aggregator
│   ├── auth.ts                  # requireOwner() helper
│   ├── axios.ts                 # Pre-configured Axios client
│   ├── chatbots.ts              # Bot data access layer
│   ├── db.ts                    # MongoDB singleton connection
│   ├── env.ts                   # Env var validation
│   ├── extractFile.ts           # PDF/DOCX/TXT text extraction
│   ├── getUserSession.ts        # Cookie-based session reader
│   ├── knowledge.ts             # System prompt builder
│   ├── options.ts               # Provider/model definitions
│   ├── providerKey.ts           # API key + model resolver
│   ├── query-keys.ts            # React Query key factory
│   ├── rag.ts                   # Pinecone vector store
│   ├── scalekit.ts              # Scalekit client init
│   └── utils.ts                 # cn() class merger
│
├── models/                      # Mongoose schemas
│   ├── chatbot.model.ts         # Bot config (provider, appearance, ...)
│   ├── chunk.model.ts           # Vector chunk metadata
│   ├── conversation.model.ts    # Visitor sessions
│   ├── document.model.ts        # Knowledge documents
│   └── message.model.ts         # Chat messages
│
├── providers/
│   └── query-provider.tsx       # TanStack Query provider
│
└── proxy.ts                     # (misnamed — intended middleware, unused)
```

---

## Dashboard Features

| Page | Path | Description |
|---|---|---|
| **Overview** | `/dashboard` | Account-level stats: agent count, live agents, total conversations, 14-day message chart, top agents, recent conversations |
| **Agents** | `/dashboard/agents` | Grid of all agents with search, status badges, manage / delete actions |
| **Create Agent** | `/dashboard/agents/new` | 4-step wizard: Basics → Persona → Model → Review |
| **Bot — Overview** | `/dashboard/bots/[id]` | Per-bot stats: conversations, messages, last active, details table |
| **Bot — Playground** | `/dashboard/bots/[id]/playground` | Live chat UI to test your bot (messages not persisted) |
| **Bot — Config** | `/dashboard/bots/[id]/config` | Full config: name, status toggle, business info, persona, provider & API key |
| **Bot — Knowledge** | `/dashboard/bots/[id]/knowledge` | Add documents (text / URL / file upload), view status, delete |
| **Bot — Appearance** | `/dashboard/bots/[id]/appearance` | Accent color, avatar, display name, welcome message with live preview |
| **Bot — Embed** | `/dashboard/bots/[id]/embed` | Copy-paste `<script>` snippet + 4-step install guide |
| **Bot — Conversations** | `/dashboard/bots/[id]/conversations` | Two-panel: conversation list + message transcript viewer |
| **Account** | `/dashboard/account` | Profile info, API key display, logout |
| **Plugins** | `/dashboard/plugins` | Plugin marketplace (Website Widget active; Slack, WhatsApp, Zapier, Webhooks, REST API — coming soon) |

---

## API Reference

All endpoints return `{ success: boolean, message?: string, data?: any, error?: any }`.

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/auth/login` | — | Redirect to Scalekit OAuth page |
| `GET` | `/api/auth/verify?code=` | — | OAuth callback → sets `access_token` cookie → redirects to `/dashboard` |
| `GET` | `/api/auth/logout` | — | Deletes `access_token` cookie → redirects to `/` |

### Chat

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | CORS `*` | Send a prompt to the AI. Supports multi-turn with `sessionId`. Use `preview: true` for playground (no persistence). |
| `GET` | `/api/chat/config?botId=` | CORS `*` | Returns bot appearance (accent color, avatar, display name, welcome message). Public — no keys exposed. |

**`POST /api/chat` body:**
```ts
{
  prompt: string;                    // Required. The user message.
  botId?: string;                    // MongoDB ObjectId.
  ownerId?: string;                  // Legacy fallback (requires status: "live").
  sessionId?: string;                // For multi-turn persistence.
  preview?: boolean;                 // Playground mode — no DB writes.
  history?: { role, text }[];        // Prior turns for preview mode.
}
```

### Chatbots (all require session)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/chatbots` | List all bots for the authenticated owner |
| `POST` | `/api/chatbots` | Create a new bot (defaults provided for empty body) |
| `GET` | `/api/chatbots/[botId]` | Get a single bot |
| `PUT` | `/api/chatbots/[botId]` | Update bot config (regenerates knowledge string) |
| `DELETE` | `/api/chatbots/[botId]` | Delete bot + cascade (vectors, conversations, messages, documents, chunks) |

### Bot Documents (all require session)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/chatbots/[botId]/documents` | List knowledge documents |
| `POST` | `/api/chatbots/[botId]/documents` | Ingest a document (multipart file, URL scrape, or raw text) |
| `DELETE` | `/api/chatbots/[botId]/documents/[docId]` | Delete a document + vectors |

### Bot Analytics & Conversations (all require session)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/chatbots/[botId]/analytics` | Per-bot stats: conversation count, message count, last active |
| `GET` | `/api/chatbots/[botId]/conversations` | List conversations (up to 50) or get transcript with `?conversationId=` |

---

## Embed Widget

Add this script tag just before your closing `</body>`:

```html
<script
  src="https://your-domain.com/chat_bot.js"
  data-bot-id="MONGODB_OBJECT_ID"
></script>
```

The widget (`public/chat_bot.js`) is a **self-contained 5KB vanilla JS file** (no build step, no dependencies). It:

1. Creates a floating chat button (bottom-right)
2. Generates an anonymous `session_id` (stored in localStorage)
3. Fetches `/api/chat/config` for theming (accent color, avatar, name, welcome message)
4. Opens a chat box with message history, typing indicator, and input
5. Sends messages to `POST /api/chat` with `botId` and `sessionId`

**Responsive:** Full-width on mobile (≤480px), 380px on tablet, 400×560 desktop default.

---

## Knowledge Base & RAG

Each bot can have a knowledge base built from uploaded documents.

### Supported Sources

| Source | Format | Description |
|---|---|---|
| File upload | PDF, DOCX, TXT, MD, CSV | Text extracted server-side |
| URL scrape | URL | HTML fetched and stripped to plain text |
| Raw text | Text | Directly indexed content |

### Pipeline

```
Upload → extractTextFromFile() → splitText() (1000-char chunks, 150 overlap)
→ embed via bot's provider (768-dim vectors) → upsert to Pinecone
→ store metadata in MongoDB (Document + Chunk records)
```

At query time, `retrieve()` performs a similarity search against the bot's vectors and prepends the top-5 results to the system prompt.

**Requires:** `PINECONE_API_KEY` and `PINECONE_INDEX` env vars. Without them, the RAG pipeline is skipped (the bot still answers from its system instruction alone).

---

## Configuration

### AI Providers

| Provider | Models | Embeddings |
|---|---|---|
| **Google Gemini** | `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro` | `text-embedding-004` (768d) |
| **OpenAI** | `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo` | `text-embedding-3-small` (768d) |

Each bot carries its own provider selection, model override, and API key. No account-level fallback.

### Appearance

| Setting | Default | Description |
|---|---|---|
| Accent color | `#e8440a` | Widget header & highlights |
| Avatar URL | `""` | Custom avatar image |
| Display name | `"Support Agent"` | Widget header name |
| Welcome message | `"Hello! How can I assist you today?"` | Initial chat bubble |

### Bot Status

- **Draft** — Visible in dashboard for editing; embed widget will still connect if `botId` is provided directly.
- **Live** — Required for the legacy `ownerId` embed path.

---

## Contributing

### Conventional Commits

This project enforces [conventional commits](https://www.conventionalcommits.org/) via commitlint.

```
feat: add new feature
fix: correct a bug
docs: update documentation
refactor: restructure code
chore: tooling or dependency changes
```

### Development workflow

```bash
# Create a feature branch
git checkout -b feat/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Before pushing, ensure lint + format pass
npm run lint
npm run format:fix

# Push and open a PR
git push origin feat/my-feature
```

### Commit hooks

| Hook | Runs |
|---|---|
| `pre-commit` | `npm run lint` + `npm run format` |
| `commit-msg` | commitlint — validates conventional commit format |

---

## License

[MIT](LICENSE)
