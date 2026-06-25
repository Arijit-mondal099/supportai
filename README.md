<div align="center">

# SupportAI

**AI-powered customer support, trained on your knowledge.**

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot/pulls)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Core-blue?logo=chainlink)](https://js.langchain.com/)

[Features](#features) · [Demo](#demo) · [Getting Started](#getting-started) · [Architecture](#architecture) · [API](#api-reference) · [Contributing](#contributing)

</div>

---

Build custom AI support agents that know your business. Configure personality, tone, and provider per agent. Add your knowledge — files, URLs, text, or Notion — and embed a zero-dependency chat widget on any site with one `<script>` tag. No third-party processors, no hidden costs, no data leaving your stack.

<!-- Add demo GIF here -->

<div align="center">

[🚀 Get Started](#getting-started) · [🌐 Live Demo](https://supportai-seven.vercel.app)

</div>

## What is SupportAI?

SupportAI is a full-stack platform for creating AI-powered customer support chatbots. Each agent carries its own persona, AI provider (Google Gemini or OpenAI), API key, and knowledge base — giving you complete control over data and cost.

Built for businesses, developers, and SaaS products that want intelligent, on-brand support without sending customer data to third-party chat platforms. Your API keys, your knowledge, your infrastructure.

---

## Features

| Icon | Feature                  | Description                                                                   |
| ---- | ------------------------ | ----------------------------------------------------------------------------- |
| 🤖   | **AI Chat**              | Natural, context-aware responses powered by Gemini or GPT                     |
| 📚   | **RAG Knowledge Base**   | Upload PDFs, DOCX, TXT, MD, CSV — or paste text, scrape a URL, connect Notion |
| 🔌   | **Notion Plugin**        | Index Notion pages and databases as knowledge sources                         |
| 🎭   | **Custom Persona**       | Configure bot name, communication tone, and personality per agent             |
| 🌐   | **Embed Widget**         | Drop-in `<script>` tag — 5KB vanilla JS, zero dependencies, any site          |
| ⚡   | **Multi-provider**       | Per-agent choice of Google Gemini or OpenAI, with own model and API key       |
| 💬   | **Conversation History** | Multi-turn chats persisted per visitor session                                |
| 📊   | **Analytics Dashboard**  | Account-level stats, 14-day message chart, top agents, per-bot analytics      |
| 🔐   | **Scalekit B2B Auth**    | Enterprise OAuth with automatic tenant isolation                              |

---

## Tech Stack

### Framework

| Logo                                                                            | Name                                          | Purpose                                |
| ------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)          | [Next.js 16](https://nextjs.org/)             | Fullstack React framework (App Router) |
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)               | [React 19](https://react.dev/)                | UI library                             |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) | [TypeScript](https://www.typescriptlang.org/) | Type safety                            |

### AI / LLM

| Logo                                                                          | Name                                                           | Purpose                             |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| ![Gemini](https://img.shields.io/badge/Gemini-API-4285F4?logo=google)         | [Google Generative AI](https://github.com/googleapis/js-genai) | Gemini chat + embeddings            |
| ![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai)         | [OpenAI SDK](https://platform.openai.com/)                     | GPT chat + embeddings               |
| ![LangChain](https://img.shields.io/badge/LangChain-Core-blue?logo=chainlink) | [LangChain Core](https://js.langchain.com/)                    | Unified chat / embeddings interface |

### Database & Storage

| Logo                                                                           | Name                                            | Purpose                 |
| ------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------- |
| ![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?logo=mongodb)         | [MongoDB / Mongoose 9](https://mongoosejs.com/) | Primary data store      |
| ![Pinecone](https://img.shields.io/badge/Pinecone-Vector-764ABC?logo=pinecone) | [Pinecone](https://www.pinecone.io/)            | Vector database for RAG |

### Authentication

| Logo                                                                  | Name                                  | Purpose                         |
| --------------------------------------------------------------------- | ------------------------------------- | ------------------------------- |
| ![Scalekit](https://img.shields.io/badge/Scalekit-B2B%20OAuth-6366F1) | [Scalekit SDK](https://scalekit.com/) | B2B OAuth with tenant isolation |

### UI & Styling

| Logo                                                                                | Name                                        | Purpose                 |
| ----------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------- |
| ![Tailwind](https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?logo=tailwindcss) | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS       |
| ![Motion](https://img.shields.io/badge/Motion-React-FF6B6B)                         | [Motion](https://motion.dev/)               | Animations              |
| ![shadcn](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui)              | [shadcn/ui](https://ui.shadcn.com/)         | Primitive UI components |
| ![Recharts](https://img.shields.io/badge/Recharts-Charts-8884D8)                    | [Recharts](https://recharts.org/)           | Analytics charts        |

### Dev Tooling

| Logo                                                                      | Name                                       | Purpose              |
| ------------------------------------------------------------------------- | ------------------------------------------ | -------------------- |
| ![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint)       | [ESLint](https://eslint.org/)              | Code quality         |
| ![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier) | [Prettier](https://prettier.io/)           | Code formatting      |
| ![Husky](https://img.shields.io/badge/Husky-9-FF4088)                     | [Husky](https://typicode.github.io/husky/) | Pre-commit hooks     |
| ![Commitlint](https://img.shields.io/badge/Commitlint-21-000000)          | [Commitlint](https://commitlint.js.org/)   | Conventional commits |

---

## Getting Started

### Prerequisites

- **Node.js 20+** (recommended)
- **npm** (other package managers not supported — see `.npmrc`)
- **MongoDB** instance (Atlas or local)
- **Scalekit** account for B2B OAuth
- **Google AI Studio** API key (Gemini) **or** **OpenAI** API key
- **Pinecone** index (optional, for RAG — requires 768-dimension cosine index)

### Installation

```bash
git clone https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot.git
cd AI-Customer-Support-Chatbot
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable                   | Required | Description                                    |
| -------------------------- | -------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URI`      | Yes      | Application URL (e.g. `http://localhost:3000`) |
| `SCALEKIT_ENVIRONMENT_URL` | Yes      | Scalekit tenant environment URL                |
| `SCALEKIT_CLIENT_ID`       | Yes      | Scalekit OAuth client ID                       |
| `SCALEKIT_CLIENT_SECRET`   | Yes      | Scalekit OAuth client secret                   |
| `MONGODB_URI`              | Yes      | MongoDB connection string                      |
| `PINECONE_API_KEY`         | No       | Pinecone API key (required for RAG)            |
| `PINECONE_INDEX`           | No       | Pinecone index name (required for RAG)         |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot)

---

## How It Works

1. 🤖 **Create your agent** — configure name, business info, persona, AI provider (Gemini or OpenAI), and API key
2. 📚 **Add your knowledge** — upload files (PDF, DOCX, TXT, MD, CSV), paste text, scrape URLs, or connect Notion pages
3. 🌐 **Embed on your site** — copy one `<script>` tag. Zero dependencies. Works on any website.

### RAG Pipeline

```
Knowledge Source → Extract Text → Chunk (1000 chars, 150 overlap)
                                         ↓
                                   Embed (768d)
                                         ↓
                                   Pinecone Vector Store
                                         ↓
User Query → Embed (768d) → Similarity Search → Top 5 Chunks
                                         ↓
                              LLM (Gemini / GPT) + System Prompt
                                         ↓
                                    Response
```

---

## Knowledge Sources

| Source      | Format                  | Description                                                              |
| ----------- | ----------------------- | ------------------------------------------------------------------------ |
| File Upload | PDF, DOCX, TXT, MD, CSV | Text extracted server-side, embedded, and indexed                        |
| URL Scrape  | URL                     | HTML fetched, stripped to plain text                                     |
| Raw Text    | Plain text              | Directly indexed content                                                 |
| Notion      | Pages & Databases       | Connected via Notion Integration Token (configured in dashboard Plugins) |

Each source is chunked (1000 characters, 150 overlap), embedded into 768-dimensional vectors, and stored in Pinecone. At query time, the top-5 most relevant chunks are retrieved and prepended to the LLM's system prompt.

---

## Embed Widget

Add this script tag just before your closing `</body>` tag:

```html
<script src="https://your-domain.com/chat_bot.js" data-bot-id="MONGODB_OBJECT_ID"></script>
```

The widget is a **self-contained 5KB vanilla JavaScript file** — no build step, no dependencies, no framework required. It:

1. Creates a floating chat button (bottom-right, dark theme)
2. Generates an anonymous session ID stored in `localStorage`
3. Fetches `/api/chat/config` for per-bot theming (accent color, display name, avatar, welcome message)
4. Opens a responsive chat box with message history, typing indicator, and input
5. Sends messages to `POST /api/chat` with `botId` and `sessionId`

**Responsive:** Full-width on mobile (≤480px), 380px on tablet, 400×560 desktop.

<!-- Add widget screenshot here -->

---

## Project Structure

```
src/
├── app/
│   ├── (user)/dashboard/        # Dashboard pages (protected by authentication)
│   │   ├── account/             # Profile, API key info, logout
│   │   ├── agents/              # Agent list + 4-step create wizard
│   │   └── bots/[botId]/        # Per-bot: stats, playground, config, knowledge,
│   │                            #   appearance, embed snippet, conversations
│   ├── api/
│   │   ├── auth/                # OAuth login, callback verify, logout
│   │   ├── chat/                # Chat endpoint + widget config (CORS open)
│   │   ├── chatbots/            # Full CRUD + documents + analytics + conversations
│   │   └── account/             # Account-level data
│   ├── globals.css              # Tailwind v4 theme (warm palette)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page (redirects if authenticated)
│   ├── not-found.tsx            # Custom 404
│   └── error.tsx                # Error boundary with retry
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
│   ├── ui/                      # shadcn/ui primitives (button, card, dialog, etc.)
│   └── ...                      # Landing page sections (Navbar, Hero, Features, etc.)
│
├── hooks/                       # TanStack React Query hooks
│   ├── use-bots.ts              # Chatbot CRUD mutations
│   ├── use-chat.ts              # Chat mutation
│   ├── use-conversations.ts     # Conversation queries
│   ├── use-documents.ts         # Document CRUD
│   └── use-mobile.ts            # Responsive sidebar detection
│
├── lib/                         # Server-side utilities
│   ├── ai.ts                    # LangChain model factory (Gemini / OpenAI)
│   ├── analytics.ts             # Account-level analytics aggregator
│   ├── auth.ts                  # requireOwner() — tenant-isolated session guard
│   ├── chatbot.model.ts         # Mongoose schema for bots
│   ├── db.ts                    # MongoDB singleton connection (globalThis cache)
│   ├── env.ts                   # Environment variable validation (Zod)
│   ├── extractFile.ts           # PDF/DOCX/TXT/MD/CSV/Notion text extraction
│   ├── knowledge.ts             # System prompt builder from bot config
│   ├── options.ts               # Provider/model definitions (client-safe)
│   ├── providerKey.ts           # Resolves per-bot API key and model
│   ├── rag.ts                   # Pinecone vector store operations
│   ├── scalekit.ts              # Scalekit client initialization
│   └── utils.ts                 # cn() class name merger
│
├── models/                      # Mongoose schemas
│   ├── chatbot.model.ts         # Bot config (provider, appearance, knowledge, etc.)
│   ├── chunk.model.ts           # Vector chunk metadata
│   ├── conversation.model.ts    # Visitor conversation sessions
│   ├── document.model.ts        # Knowledge documents
│   ├── message.model.ts         # Chat messages
│   └── owner.model.ts           # Account-level data (Notion token, API keys)
│
├── providers/
│   └── query-provider.tsx       # TanStack Query provider wrapper
│
└── proxy.ts                     # (Unused — intended middleware, not at middleware.ts)

public/
└── chat_bot.js                  # Embed widget (self-contained vanilla JS, 5KB)
```

---

## API Reference

All endpoints return `{ success: boolean, message?: string, data?: any, error?: any }`.

### Authentication

| Method | Endpoint                 | Auth | Description                                              |
| ------ | ------------------------ | ---- | -------------------------------------------------------- |
| `GET`  | `/api/auth/login`        | —    | Redirect to Scalekit OAuth                               |
| `GET`  | `/api/auth/verify?code=` | —    | OAuth callback → sets cookie → redirects to `/dashboard` |
| `GET`  | `/api/auth/logout`       | —    | Deletes cookie → redirects to `/`                        |

### Chat

| Method | Endpoint                  | Auth     | Description                                                                         |
| ------ | ------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `POST` | `/api/chat`               | CORS `*` | Send a prompt. Multi-turn via `sessionId`. Use `preview: true` to skip persistence. |
| `GET`  | `/api/chat/config?botId=` | CORS `*` | Bot appearance (accent color, avatar, display name, welcome message)                |

### Chatbots

| Method   | Endpoint                | Auth    | Description                                                                |
| -------- | ----------------------- | ------- | -------------------------------------------------------------------------- |
| `GET`    | `/api/chatbots`         | Session | List all bots for the authenticated owner                                  |
| `POST`   | `/api/chatbots`         | Session | Create a new bot (defaults provided for empty body)                        |
| `GET`    | `/api/chatbots/[botId]` | Session | Get a single bot                                                           |
| `PUT`    | `/api/chatbots/[botId]` | Session | Update bot config                                                          |
| `DELETE` | `/api/chatbots/[botId]` | Session | Delete bot + cascade (vectors, conversations, messages, documents, chunks) |

### Documents

| Method   | Endpoint                                  | Auth    | Description                                                       |
| -------- | ----------------------------------------- | ------- | ----------------------------------------------------------------- |
| `GET`    | `/api/chatbots/[botId]/documents`         | Session | List knowledge documents                                          |
| `POST`   | `/api/chatbots/[botId]/documents`         | Session | Ingest document (multipart file, URL scrape, raw text, or Notion) |
| `DELETE` | `/api/chatbots/[botId]/documents/[docId]` | Session | Delete document + vectors                                         |

### Analytics & Conversations

| Method | Endpoint                              | Auth    | Description                                                  |
| ------ | ------------------------------------- | ------- | ------------------------------------------------------------ |
| `GET`  | `/api/chatbots/[botId]/analytics`     | Session | Per-bot stats (conversations, messages, last active)         |
| `GET`  | `/api/chatbots/[botId]/conversations` | Session | List conversations or get transcript with `?conversationId=` |

---

## Contributing

### Workflow

```bash
# Fork the repository
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

### Branch Naming

| Prefix   | Use Case                      |
| -------- | ----------------------------- |
| `feat/`  | New features                  |
| `fix/`   | Bug fixes                     |
| `docs/`  | Documentation changes         |
| `chore/` | Tooling or dependency changes |

### Conventional Commits

| Type       | When to Use              |
| ---------- | ------------------------ |
| `feat`     | A new feature            |
| `fix`      | A bug fix                |
| `docs`     | Documentation only       |
| `refactor` | Code restructuring       |
| `chore`    | Tooling, config, or deps |

### Commit Hooks

| Hook         | Runs                                                  |
| ------------ | ----------------------------------------------------- |
| `pre-commit` | `npm run lint` + `npm run format` (runs on all files) |
| `commit-msg` | `commitlint` — validates conventional commit format   |

**Note:** Pre-commit runs `npm run format` (check), not `npm run format:fix`. Run `npm run format:fix` before committing to avoid hook failures.

---

## Roadmap

- [x] File upload (PDF, DOCX, TXT, MD, CSV)
- [x] URL scraping
- [x] Notion plugin (pages & databases)
- [ ] Slack integration
- [ ] WhatsApp integration
- [ ] Zapier integration
- [ ] Webhooks
- [ ] REST API access
- [ ] Usage analytics per document

---

## License

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Released under the MIT License. See [LICENSE](LICENSE) for details.
