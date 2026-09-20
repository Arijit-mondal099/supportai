# Getting Started

Get SupportAI running locally in ~10 minutes, then create your first live agent.

## Prerequisites

- Node.js `>= 22` (see `.nvmrc`), `npm` (repo uses `npm install`; `.npmrc` sets `legacy-peer-deps=true`).
- MongoDB connection string (`MONGODB_URI`).
- Scalekit tenant: `SCALEKIT_ENVIRONMENT_URL`, `SCALEKIT_CLIENT_ID`, `SCALEKIT_CLIENT_SECRET`.
- One provider key for testing: Google Gemini or OpenAI (stored per-agent, not in `.env`).
- Optional: Pinecone API key + 768-dim cosine index (RAG), Upstash Redis URL + token (cache + rate limit).

## Install

```bash
cp .env.example .env   # then fill in values (see below)
npm install
npm run dev            # http://localhost:3000
```

## Environment

| Var                        | Required | Example                                              |
| -------------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URI`      | Yes      | `http://localhost:3000`                              |
| `SCALEKIT_ENVIRONMENT_URL` | Yes      | `https://your-org.scalekit.dev`                      |
| `SCALEKIT_CLIENT_ID`       | Yes      | `skc_xxxxxxxxxxxxxxxx`                               |
| `SCALEKIT_CLIENT_SECRET`   | Yes      | `your_scalekit_client_secret`                        |
| `MONGODB_URI`              | Yes      | `mongodb+srv://user:password@cluster.mongodb.net/db` |
| `PINECONE_API_KEY`         | No       | Enables RAG document retrieval                       |
| `PINECONE_INDEX`           | No       | Pinecone index name (768 dims, cosine)               |
| `UPSTASH_REDIS_REST_URL`   | No       | Enables cache + rate limiting                        |
| `UPSTASH_REDIS_TOKEN`      | No       | Redis auth token                                     |

Gotchas:

- `src/lib/env.ts` validates with Zod but **never throws**. Bad/missing vars log an error and fall back to `""`; failures surface later (DB connect, Scalekit redirect, RAG skip).
- Redis is fully optional. `isCacheEnabled()` / `isRateLimitEnabled()` check for _both_ `UPSTASH_REDIS_*` vars. When absent, `Cache.*` and `rateLimit()` are no-ops.
- RAG is optional. `isRagConfigured()` requires _both_ `PINECONE_API_KEY` and `PINECONE_INDEX`. Without them, chat uses only the system instruction.

## First run checklist

1. `npm run dev` → open `NEXT_PUBLIC_API_URI`.
2. Click sign in → Scalekit OAuth → redirect to `/dashboard`.
3. Dashboard is empty → **New agent** → 4-step wizard (see [Agents](agents.md)).
4. In **Step 3**, paste your Gemini or OpenAI key for that agent.
5. Toggle **Make live now** (or flip draft → live later in **Config**).
6. Open the agent → **Playground** → send a test message.
7. Open **Knowledge** → add one Text source → re-test in Playground.
8. Open **Appearance** → set display name, greeting, prompts.
9. Open **Embed** → copy the `<script>` tag → paste before `</body>` on your site.

## Verify your setup

```bash
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
npm run test       # vitest run (mock-based, no DB needed)
npm run format     # prettier --check .
npm run build      # next build (needs env present; CI injects stubs)
```

Order when iterating: `lint → typecheck → test → format`. Pre-commit runs `lint + format` (check, not fix) — run `npm run format:fix` before committing.

## Next steps

- [Architecture](architecture.md) — how the pieces fit.
- [Authentication](authentication.md) — login flow and session cookies.
- [Knowledge Base](knowledge-base.md) — file/URL/text/Notion ingestion.
- [Embed Widget](embed-widget.md) — installing the chat bubble.
- [Troubleshooting](troubleshooting.md) — when something fails.
