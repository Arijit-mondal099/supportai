# AGENTS.md

## Commands

| Command         | What it runs                     |
| --------------- | -------------------------------- |
| `npm run dev`   | `next dev` (dev server on :3000) |
| `npm run build` | `next build`                     |
| `npm run start` | `next start`                     |
| `npm run lint`  | `eslint`                         |
| `npm run format` | `prettier --check .`            |
| `npm run format:fix` | `prettier --write .`       |
| `npm run prepare` | `husky` (auto-runs on `npm install`) |

No test or typecheck scripts exist.

## Git hooks (husky)

| Hook | What it runs |
|------|-------------|
| `pre-commit` | `npm run lint` + `npm run format` |
| `commit-msg` | `commitlint` – enforces [conventional commits](https://www.conventionalcommits.org/) (`type: message`, e.g. `feat: add login`, `fix: handle null`) |

## Environment

Copy `.env.local` template with these vars (all required):

- `NEXT_PUBLIC_API_URI` – e.g. `http://localhost:3000`
- `SCALEKIT_ENVIRONMENT_URL`, `SCALEKIT_CLIENT_ID`, `SCALEKIT_CLIENT_SECRET`
- `MONGODB_URI`

Env vars are read in `src/lib/env.ts` with non-null assertions – missing vars crash at module import.

## Architecture

- **Next.js 16 App Router** with TypeScript, `@/` alias → `./src/*`
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **MongoDB / Mongoose** – singleton connection cached on `globalThis.mongoose` (`src/lib/db.ts`)
- **Google Gemini** (`@google/genai`) – model `"gemini-3-flash-preview"`, per-business API key stored in MongoDB
- **Scalekit** B2B OAuth – token stored in `httpOnly` cookie `access_token` (24h)

## Key patterns

- **Server / client boundary**: server components fetch data (session, DB) and pass as props to client components. Client components (`"use client"`) handle all interactivity.
- **Route protection**: `src/proxy.ts` is a Next.js middleware **misnamed** – it exports `config.matcher` and the middleware signature but sits at `src/proxy.ts` instead of `src/middleware.ts`, so it is **not auto-invoked**. Dashboard pages rely on `getUserSession()` in each page component instead.
- **Auth flow**: `/api/auth/login` → Scalekit → `/api/auth/verify?code=...` → set cookie → redirect home.
- **API response shape**: consistently `{ success: boolean, message?: string, data?: any, error?: any }`.
- **Upsert pattern**: `POST /api/business` uses `findOneAndUpdate` with `upsert: true`.
- **Business knowledge base**: constructed as a system instruction string (no vector DB / RAG). Stored on the Business document.
- **Chat is stateless**: `history: []` each request. Frontend manages its own message history.
- **CORS**: `/api/chat` returns `Access-Control-Allow-Origin: *` for embed widget.

## Routes

| Path                      | Handler                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `/api/auth/login`         | `GET` – redirect to Scalekit                               |
| `/api/auth/verify`        | `GET` – OAuth callback                                     |
| `/api/auth/logout`        | `GET` – delete cookie                                      |
| `/api/business`           | `POST` – upsert business config                            |
| `/api/business/[ownerId]` | `GET` – get business by ownerId                            |
| `/api/chat`               | `POST` – send prompt to Gemini; `OPTIONS` – CORS preflight |

## Style

- Tailwind zinc palette, `motion/react` for animations, `lucide-react` icons
- No global state library – form state is local `useState`
