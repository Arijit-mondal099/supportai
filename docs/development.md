# Development

## Commands

| Command              | Runs                 |
| -------------------- | -------------------- |
| `npm run dev`        | `next dev` (:3000)   |
| `npm run build`      | `next build`         |
| `npm run start`      | `next start`         |
| `npm run lint`       | `eslint .`           |
| `npm run typecheck`  | `tsc --noEmit`       |
| `npm run format`     | `prettier --check .` |
| `npm run format:fix` | `prettier --write .` |
| `npm run test`       | `vitest run`         |
| `npm run test:watch` | `vitest watch`       |

Package manager: `npm install` only (`.npmrc` `legacy-peer-deps=true`). Node from `.nvmrc` (`>= 22`).

Verification order when iterating: **`lint → typecheck → test → format`**. Pre-commit runs `lint + format` over _all_ files.

## Tests

- Runner: Vitest. Config `vitest.config.ts`: includes `src/**/*.{test,spec}.*`; excludes `node_modules/.next/dist`, `src/components/ui`, `src/components/dashboard`, `src/hooks`; coverage limited to `src/lib` + `src/app/api`. Setup `src/tests/setup.ts` silences `console.error`.
- Style: mock-based — no DB or live services (`requireOwner`, RAG, etc. mocked per test).
- Run one file: `npx vitest run <path>`. Coverage: `npm run test:coverage`.
- Existing suites (~16 files): `src/lib/*.test.ts` (ai, analytics, auth, chatbots, extractFile, knowledge, options, providerKey, rag, utils, validations) + `src/app/api/*/route.test.ts` (account, analytics, chat, chat/config, chatbots).

## Git hooks

| Hook         | Runs                                                 |
| ------------ | ---------------------------------------------------- |
| `pre-commit` | `npm run lint` + `npm run format` (check, all files) |
| `commit-msg` | `npx commitlint --edit` (conventional commits)       |

If the hook fails on formatting, run `npm run format:fix` and commit again. Commit messages must be conventional (`feat:`, `fix:`, `docs:`, ...).

## Conventions

- **Simplicity first:** smallest diff that solves the problem; no speculative abstractions.
- **Surgical edits:** touch only what the task needs; match surrounding style (Prettier `tabWidth: 2` wins over `.editorconfig` `indent_size = 4`).
- **API shape:** `{ success, message?, data?, error? }`; Zod in `src/lib/validations.ts`; owner id from session only.
- **Caching:** manual invalidation on write paths (see [Architecture](architecture.md)); key prefixes `support_ai:` / `cache:*` / `session:*` / `rl:*`.
- **Components:** server fetches → client interacts; React Query for server state; `cn()` (`clsx` + `tailwind-merge`) for classes.
- **Docs:** these files live in `docs/`; keep code samples copy-pasteable and paths (`src/...`) accurate.

## Useful paths

- Proxy/guard: `src/proxy.ts`. Auth: `src/lib/auth.ts`, `src/lib/getUserSession.ts`, `src/lib/scalekit.ts`.
- Chat: `src/app/api/chat/route.ts`, `src/lib/ai.ts`, `src/lib/rag.ts`, `src/lib/knowledge.ts`.
- Widget: `public/chat_bot.js`, snippet builder `src/components/Embed.tsx`.
- Migration: `scripts/migrate-business-to-chatbot.mjs` — `node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs` (idempotent).
