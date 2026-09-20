# Troubleshooting

## Auth

| Symptom                                  | Likely cause → fix                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `/api/auth/login` → `400/500`            | Missing `SCALEKIT_*` (env logs but doesn't throw) → fill `.env`, restart.           |
| Callback lands on error / loops to login | `NEXT_PUBLIC_API_URI` ≠ Scalekit redirect URI (scheme/port matter) → align both.    |
| `/dashboard` redirects immediately       | No/expired `access_token` cookie → log in again; check cookie flags in devtools.    |
| Dashboard APIs → `401 Unauthorized`      | Session invalid → re-login; if Redis was flushed, sessions re-validate on next hit. |

## Chat

| Symptom                                    | Likely cause → fix                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `404 "Chatbot not found."`                 | Wrong `botId` (must be ObjectId) or legacy `ownerId` with no bots → copy id from Embed tab.                                             |
| `404 "This chatbot is not published yet."` | Agent is `draft` → Config → set `live`, or test with `preview: true`.                                                                   |
| `400 "No API key configured"`              | Empty `apiKeyOverride` → Config → Step 3 key → save.                                                                                    |
| `400 <zod messages>`                       | Missing `prompt` or neither `botId`/`ownerId` → see [Chat API](chat-api.md).                                                            |
| `429 "Rate limit exceeded"`                | 20/min (embed) or 60/min (preview) per IP → wait for `Retry-After` seconds.                                                             |
| `500 "An error occurred..."`               | Provider key invalid/quota, or RAG failure → check server logs; RAG alone never 500s (best-effort) unless the LLM call fails.           |
| Generic answers, ignores documents         | RAG off (`PINECONE_*` unset) or docs still `processing`/`error` → set Pinecone env (768d cosine index), re-add docs, watch for `ready`. |
| Playground works, widget doesn't           | Widget hits live-only path with cached config → confirm `live`, hard-refresh, wait ≤5 min for `cache:bot_config` refresh.               |

## Knowledge ingestion

| Symptom                                          | Likely cause → fix                                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `400 "Knowledge base not configured (Pinecone)"` | `PINECONE_API_KEY/INDEX` missing → set both, restart.                                                             |
| `400 "Unsupported file type"`                    | Extension outside pdf/docx/txt/md/csv → convert first.                                                            |
| `400 "No usable text"`                           | Empty/scanned PDF or blank page → OCR or paste text instead.                                                      |
| `500 "Failed to index"` + `error` status         | Embedding/index failure (bad key, wrong dims, Pinecone outage) → verify 768d cosine index + provider key, re-add. |
| Notion → `400 "Configure ... Plugins first"`     | No owner token → Plugins → `PUT /api/account` → invite integration to the page/db.                                |
| Docs `429`                                       | 10/10min per bot → wait and retry.                                                                                |

## Redis / cache

- No `UPSTASH_REDIS_*` → caching and rate limiting silently off. Correct but slower/unlimited — set both vars to enable.
- Stale appearance/analytics/conversations → manual-invalidation windows (60–300s). Writes already bust keys best-effort; wait or re-save.
- Redis errors are fail-open: chat still answers, limits don't apply. Check Upstash status/quotas.

## Build and dev

| Symptom                      | Likely cause → fix                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run build` fails on env | Real vars missing (CI uses stubs) → provide `.env` for local builds.                     |
| Pre-commit hook fails        | `lint` or `format` (check) dirty → run `npm run format:fix`, fix eslint, retry.          |
| `commit-msg` rejected        | Non-conventional message → use `feat:`, `fix:`, `docs:`, etc.                            |
| Tests fail without services  | Tests are mocked — a failure is a real regression, not env. Run `npx vitest run <file>`. |

Still stuck? Capture the endpoint, status, `message`, and relevant server log (`RAG retrieve failed`, `Failed to log conversation`, `Environment variable validation failed`) and open an issue per [Contributing](contributing.md).
