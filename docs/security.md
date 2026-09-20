# Security

Your keys, your knowledge, your account — no third-party chat processors. What you own and what the app enforces:

## Authentication and sessions

- Scalekit OAuth only; no local passwords. Token in `httpOnly` cookie `access_token`, 24h expiry, `secure` in production, `path: /`.
- Session validation cached 300s as `session:<sha256(token)>` — the raw token is never used as a key.
- `/dashboard/*` has two guards: `proxy()` redirect + inline `requireOwner()`.
- Logout clears the Redis session and the cookie.

## Owner isolation

- `requireOwner()` derives `ownerId`/`email` from the session. All Mongo queries filter by it; request-supplied owner ids are ignored (except legacy `ownerId` fallback in public chat, which still only resolves that owner's bots).
- Bot serialization masks keys (`•••• + last4`). Full `apiKeyOverride` never leaves the server except to the provider SDK.
- Notion tokens are `select: false` and read only in the ingest path.

## Per-agent provider keys

- Each agent carries its own `provider/model/apiKeyOverride`. Compromise of one key affects one agent; rotate in **Config** → save (also refreshes `knowledge` and busts caches).
- Chat temperature is fixed (`0.3`); models are allow-listed in `src/lib/options.ts`.

## Public surface

| Endpoint               | Auth   | Protections                                                                                                         |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| `POST /api/chat`       | None   | Rate limit 20/min/IP (60 preview), draft blocked, CORS `*`, history capped at 20, persistence only with `sessionId` |
| `GET /api/chat/config` | None   | Live-only, cached 300s, `Cache-Control: private, no-store`, CORS `*`                                                |
| `/api/auth/*`          | None   | OAuth code exchange server-side; secrets never in client                                                            |
| `/api/*` (rest)        | Cookie | `requireOwner`, Zod validation, owner-scoped queries                                                                |

CORS `*` on chat endpoints is intentional (third-party sites embed the widget). Dashboard APIs send no CORS headers and rely on same-origin cookies.

## Rate limiting and IP trust

- Fixed-window Redis Lua (`INCR`+`EXPIRE`), fail-open (Redis down → requests pass, logged).
- `getClientIp()` prefers platform-verified `cf-connecting-ip`, then first `x-forwarded-for`, then `x-real-ip`, else `"0.0.0.0"`. `x-forwarded-for` is spoofable — treat limits as abuse friction, not hard security.
- Without Redis there is no rate limiting: put the app behind a WAF/CDN limiter for public production traffic.

## Caching

- Upstash-backed `Cache` (`support_ai:` prefix) with manual invalidation; stale worst-case is minutes (bot config 300s, bot reads 120s, conversations 60s). No PII in keys beyond ids.
- Without Redis every read hits Mongo — slower but correct.

## Reporting

Open a GitHub issue for vulnerabilities in non-secret handling; for key/token exposure rotate first (provider dashboard, Notion integrations, Scalekit client secret), then report. Never commit `.env` — only `.env.example` is tracked.
