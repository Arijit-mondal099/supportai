# Contributing

Thanks for helping with SupportAI. PRs are welcome — see the [open PRs](https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot/pulls).

## Workflow

1. Fork + clone, `npm install`, `cp .env.example .env`.
2. Create a branch from `main` (or `master` if that's the default): `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
3. Make surgical changes: smallest diff, match style, no drive-by refactors.
4. Verify: `npm run lint → npm run typecheck → npm run test → npm run format`. Run `npm run format:fix` before committing (pre-commit checks, not fixes).
5. Commit with conventional messages (`feat:`, `fix:`, `docs:`, `chore:`, ... — enforced by commitlint).
6. Push and open a PR with: what changed, why, how you verified, screenshots for UI.

Repo ships `/fix-bug` and `/open-pr` helpers (`.opencode/commands/`) if you use OpenCode.

## What to work on

- Docs gaps (these `docs/` files), widget a11y, ingestion edge cases (scanned PDFs, large Notion DBs), test coverage in `src/lib` + `src/app/api`, troubleshooting entries from real failures.
- Avoid: switching embedding models/dims (invalidates Pinecone vectors), account-level key fallbacks (per-bot keys are intentional), changing the `{ success, ... }` envelope.

## Standards

- TypeScript strict; Zod for new API inputs (`src/lib/validations.ts`).
- Owner isolation: new queries filter by session `ownerId`; never trust client ids.
- Cache: new cached reads need write-path invalidation.
- Tests: mock externals (DB, RAG, Scalekit); colocate route tests next to `route.ts`.
- License: MIT (`LICENSE`). By contributing you agree your work is MIT-licensed.
