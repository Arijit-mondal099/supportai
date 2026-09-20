# AGENTS.md

> **Read these instructions after `@CLAUDE.md`.** `@CLAUDE.md` is the primary instruction file (behavioral guidelines); this file is the repository-specific companion. Read `@CLAUDE.md` first, then this file — together they are your complete instruction set.

## Commands

| Command              | What it runs                         |
| -------------------- | ------------------------------------ |
| `npm run dev`        | `next dev` (dev server on :3000)     |
| `npm run build`      | `next build`                         |
| `npm run start`      | `next start`                         |
| `npm run lint`       | `eslint .`                           |
| `npm run typecheck`  | `tsc --noEmit`                       |
| `npm run format`     | `prettier --check .`                 |
| `npm run format:fix` | `prettier --write .`                 |
| `npm run test`       | `vitest run`                         |
| `npm run test:watch` | `vitest watch`                       |
| `npm run prepare`    | `husky` (auto-runs on `npm install`) |

## Verification order

`lint → typecheck → test → format` — pre-commit runs lint+format, so run them first when iterating.

CI (`.github/workflows/ci.yml`) runs lint+format, typecheck, test, and build as independent jobs on `main`/`master` using `npm ci` with Node from `.nvmrc`. The build job injects stub env vars — `npm run build` needs env vars present to behave; `src/lib/env.ts` never throws, so missing vars surface as downstream failures, not startup errors.

Tests are mock-based — no DB or services needed (`requireOwner`, RAG, etc. are mocked per test; `console.error` is silenced in `src/tests/setup.ts`). Vitest only picks up `src/**/*.{test,spec}.*` and excludes `src/components/ui`, `src/components/dashboard`, and `src/hooks`; coverage is limited to `src/lib` + `src/app/api`. Run one file with `npx vitest run <path>`.

## Git hooks (husky)

| Hook         | What it runs                                                               |
| ------------ | -------------------------------------------------------------------------- |
| `pre-commit` | `npm run lint` + `npm run format` (runs on **all** files, not just staged) |
| `commit-msg` | `npx commitlint --edit` — enforces conventional commits                    |

**Gotcha:** pre-commit runs `format` (check), not `format:fix`. If code isn't already formatted, the hook fails. Run `npm run format:fix` before committing.

## Commands & Skills

This repo ships OpenCode tooling under `.opencode/` and `.claude/skills/`. No `opencode.json` is present, so these paths are auto-discovered.

**Commands** (`.opencode/commands/`, run as `/<name> <args>`):

- `/fix-bug <bug description>` — investigate → present a plan (stops, waits for your approval) → asks to enable mutation tools → implements. Uses only Read/Grep/Glob until approved; writes no code before explicit approval.
- `/open-pr [<branch-name>]` — stashes the tree, branches from the detected base (`main` then `master`), splits staged + untracked changes into atomic commits, pushes, and prints a pre-filled GitHub PR compare URL (PowerShell `[System.Uri]::EscapeDataString`-encoded). Never merges. Requires a GitHub remote.

**Skills** (`.claude/skills/`, auto-loaded) — pick the one matching the task:

- `frontend-design` — distinctive visual design, typography, intentional UI aesthetics.
- `ui-ux-pro-max` — UI/UX guidance across stacks: color palettes, font pairings, breakpoints, motion.
- `vercel-react-best-practices` — React/Next.js performance, bundling, rendering, rerender optimization.
- `web-design-guidelines` — accessibility and UI guideline compliance review.

## Environment

Copy `.env.example` → `.env`.

| Var                        | Notes                                       |
| -------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URI`      | e.g. `http://localhost:3000`                |
| `SCALEKIT_ENVIRONMENT_URL` | Scalekit tenant URL                         |
| `SCALEKIT_CLIENT_ID`       | Scalekit OAuth client ID                    |
| `SCALEKIT_CLIENT_SECRET`   | Scalekit OAuth client secret                |
| `MONGODB_URI`              | MongoDB connection string                   |
| `PINECONE_API_KEY`         | _(optional)_ Gates RAG feature              |
| `PINECONE_INDEX`           | _(optional)_ Pinecone index name            |
| `UPSTASH_REDIS_REST_URL`   | _(optional)_ Redis cache/rate-limit backend |
| `UPSTASH_REDIS_TOKEN`      | _(optional)_ Redis auth token               |

**Gotcha:** `src/lib/env.ts` validates with Zod but **does not crash on failure** — it logs an error and falls back to empty strings. Required vars (`SCALEKIT_*`, `MONGODB_URI`) will cause failures later, not at startup.

**Redis is optional:** `isCacheEnabled()` / `isRateLimitEnabled()` (in `src/lib/cache.ts` and `src/lib/rate-limit.ts`) check for both `UPSTASH_REDIS_*` vars. When absent, `Cache.get/set/delete` and `rateLimit` are no-ops — the app works but loses caching and rate limiting. No code changes required.

`.npmrc` sets `legacy-peer-deps=true` — use `npm install`, not other package managers.

## Architecture

- **Next.js 16 App Router** with TypeScript, `@/` alias → `./src/*`
- **Tailwind CSS v4** via `@tailwindcss/postcss`, **shadcn/ui** primitives (`components.json` confirms base-nova style)
- **MongoDB / Mongoose 9** – singleton cached on `globalThis.mongoose` (`src/lib/db.ts`)
- **Google Gemini** (`@langchain/google-genai`) + **OpenAI** (`@langchain/openai`) – per-bot provider/key/model stored in MongoDB
- **Scalekit** B2B OAuth – token stored in `httpOnly` cookie `access_token` (24h)
- **Pinecone** (`@pinecone-database/pinecone`) – optional vector store for RAG document retrieval
- **LangChain Core** wraps both providers for unified chat + embeddings interface
- Embedding dimension pinned to 768 so a single Pinecone index works across providers

## Key patterns

- **Server / client boundary**: server components fetch data (session, DB) and pass as props to client components. Client components (`"use client"`) handle all interactivity.
- **Route protection**: `src/proxy.ts` is a Next.js 16 **proxy** (the `middleware.ts` convention was renamed to `proxy.ts` in Next 16) — its `proxy()` + `config.matcher: ["/dashboard/:path*"]` guard is live. Dashboard pages additionally call `requireOwner()` inline (defined in `src/lib/auth.ts:16`), so both layers apply.
- **Route groups**: dashboard pages live under `src/app/(user)/dashboard` — `(user)` is a route group, so URLs stay `/dashboard/...` with no `/user` prefix.
- **Auth flow**: `/api/auth/login` → Scalekit → `/api/auth/verify?code=...` → set cookie → redirect to `/dashboard`.
- **API response shape**: consistently `{ success: boolean, message?: string, data?: any, error?: any }`.
- **Per-bot API keys**: each agent carries its own provider, model, and API key (`apiKeyOverride` in the model — note the field name) — no account-level fallback. Resolved in `src/lib/providerKey.ts`.
- **Redis caching & rate limiting**: `Cache` class (`src/lib/cache.ts`) provides `get`/`set`/`delete`/`deletePattern`/`memoize`; `rateLimit` (`src/lib/rate-limit.ts`) uses a fixed-window counter (Lua `INCR`+`EXPIRE` via `redis.eval`). Both gracefully degrade to no-ops when Upstash env vars are absent. Cache invalidation is manual on write paths (PUT/DELETE/POST). Chat limits: 20 req/min per IP for embedded chat, 60/min for playground previews (`src/app/api/chat/route.ts:39`).
- **Rate-limit IP resolution**: `getClientIp` in `src/lib/rate-limit.ts` prefers Cloudflare's `cf-connecting-ip` (platform-verified) before `x-forwarded-for` (spoofable), then `x-real-ip`, then `"0.0.0.0"`.
- **Knowledge base**: two layers — (1) system instruction built from business/persona config via `buildKnowledge()`, (2) optional RAG document retrieval via Pinecone (gated by `PINECONE_API_KEY`).
- **RAG is optional**: `isRagConfigured()` checks for `PINECONE_API_KEY` + `PINECONE_INDEX`. Without them, only the system instruction is used.
- **Chat persistence**: preview/playground chats skip DB writes (`preview: true`); embedded chats with `sessionId` persist to Conversation + Message models. History limit is 20 messages (`HISTORY_LIMIT = 20`).
- **CORS**: `/api/chat` and `/api/chat/config` return `Access-Control-Allow-Origin: *` for the embed widget.
- **No global state library** — form state is local `useState`. TanStack React Query for server state.
- **Embed widget**: self-contained vanilla JS at `public/chat_bot.js` (no build step). Reads `data-bot-id` attribute, fetches `/api/chat/config` for theming, posts to `/api/chat`.
- **Zod validation** lives in `src/lib/validations.ts` — covers chat request, chatbot create/update, and document creation (supports `url`, `text`, and `notion` source types).

## Non-obvious details

- `next.config.ts` force-excludes `mammoth` via `serverExternalPackages` (it doesn't bundle cleanly under Next's server build). PDF text is extracted with `unpdf` via a dynamic `import("unpdf")` in `src/lib/extractFile.ts`, so it needs no special config. (`pdf-parse`/`pdfjs-dist` are not used.)
- `.editorconfig` says `indent_size = 4` but `.prettierrc` enforces `tabWidth: 2`. Prettier wins in practice; be aware of the mismatch in editor defaults.
- Document ingestion supports 4 source types: `file` (PDF/DOCX/TXT/MD/CSV), `url`, `text`, and `notion` (page or database via Notion SDK).
- One-off migration script at `scripts/migrate-business-to-chatbot.mjs` — run with `node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs`. Safe to re-run.
- **Companion to `@CLAUDE.md`**: `@CLAUDE.md` is the **primary** instruction file (behavioral guidelines); read it **first**, then read this file. The two together form the complete agent instruction set for this repository.

## Providers & models

| Provider | Models                                                                    | Embeddings                      |
| -------- | ------------------------------------------------------------------------- | ------------------------------- |
| `gemini` | `gemini-2.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3.5-flash-lite` | `gemini-embedding-001` (768d)   |
| `openai` | `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`                                    | `text-embedding-3-small` (768d) |

Default model for each provider is the first in its list (`gemini-2.5-flash-lite`, `gpt-4o-mini`). Defined in `src/lib/options.ts`. Chat temperature is fixed at 0.3 (`src/lib/ai.ts`).

**Do not change the embedding model lightly:** Pinecone vectors are stored in one 768-dim space (`EMBED_DIMENSIONS = 768`; Gemini output truncated via MRL). Switching the embedding model invalidates every existing vector — docs must be deleted and re-added, or similarity scores are bogus. See the NOTE in `src/lib/ai.ts`.

## Style

- Tailwind's zinc/slate/gray palettes overridden with warm tones in `globals.css` (`@theme` block)
- `.bg-pinstripe` for landing page diagonal hatch background
- `motion/react` for animations, `lucide-react` icons
- `font-title` for badges/labels, `font-heading` for h1/h2, `font-sans` for body
- Custom heading fonts served from `/public/fonts/` (NormalFont, HeadingFont, TitleFont)
