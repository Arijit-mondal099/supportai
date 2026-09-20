# SupportAI Documentation

Open-source docs for **SupportAI** — AI-powered customer support agents trained on your knowledge.

> New here? Start with [Getting Started](getting-started.md), then [Architecture](architecture.md).

## Product guides

| Guide                                 | What it covers                                              |
| ------------------------------------- | ----------------------------------------------------------- |
| [Getting Started](getting-started.md) | Prerequisites, install, env, first run, first agent         |
| [Architecture](architecture.md)       | Stack, folder map, request flows, database schema           |
| [Authentication](authentication.md)   | Scalekit OAuth, sessions, route protection, owner isolation |
| [Agents](agents.md)                   | Agent lifecycle, 4-step wizard, providers and models        |
| [Knowledge Base](knowledge-base.md)   | Text / URL / file / Notion sources, chunking, RAG           |
| [Dashboard](dashboard.md)             | Overview, agents list, per-agent tabs, plugins, account     |
| [Embed Widget](embed-widget.md)       | One-tag install, theming, behavior, privacy                 |

## API reference

| Guide                   | What it covers                                      |
| ----------------------- | --------------------------------------------------- |
| [Chat API](chat-api.md) | `POST /api/chat`, `GET /api/chat/config`, limits    |
| [REST API](rest-api.md) | Auth, chatbots, documents, conversations, analytics |

## Operations

| Guide                                 | What it covers                                   |
| ------------------------------------- | ------------------------------------------------ |
| [Deployment](deployment.md)           | Vercel + self-host, env matrix, build behavior   |
| [Development](development.md)         | Commands, verification order, tests, hooks       |
| [Security](security.md)               | Keys, CORS, rate limiting, caching, data control |
| [Troubleshooting](troubleshooting.md) | Common errors, RAG/Redis/auth failure modes      |
| [Contributing](contributing.md)       | Issues, branches, commits, PRs                   |

## Key facts

- **Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Mongoose 9, LangChain (Gemini + OpenAI), Pinecone (optional RAG), Upstash Redis (optional cache + rate limit), Scalekit OAuth.
- **Response envelope:** every API returns `{ success, message?, data?, error? }`.
- **Per-agent keys:** each agent stores its own `provider`, `model`, and API key (`apiKeyOverride`). No account-level fallback.
- **Optional services degrade gracefully:** without Pinecone you get system-prompt-only answers; without Redis you lose caching and rate limiting but the app still works.
- **Embed:** one `<script>` tag, vanilla JS (`public/chat_bot.js`), no build step.

## Repo entry points

- User docs: `README.md` (also `README.hi.md`, `README.bn.md`).
- Agent instructions: `CLAUDE.md` + `AGENTS.md` (authoritative for commands, env, patterns).
- Env template: `.env.example`.
- Widget source: `public/chat_bot.js`.
- API: `src/app/api/`.
- Domain logic: `src/lib/`, `src/models/`.
