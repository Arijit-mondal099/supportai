# Deployment

Stateless Next.js app + external MongoDB / Pinecone / Redis. No `Dockerfile`; Vercel-ready.

## Vercel (recommended)

1. Push to GitHub; import the repo.
2. Set env vars (see matrix below). Use production `NEXT_PUBLIC_API_URI` (e.g. `https://supportai-seven.vercel.app`).
3. Register `${NEXT_PUBLIC_API_URI}/api/auth/verify` as the Scalekit redirect URI.
4. Deploy. `next build` + `next start` need no local services.

CI (`.github/workflows/ci.yml`) runs `lint+format`, `typecheck`, `test`, `build` as independent jobs on `main`/`master` (also PRs, manual dispatch) with Node from `.nvmrc` and `npm ci`. The build job injects stub env (`NEXT_PUBLIC_API_URI=http://localhost:3000`, `SCALEKIT_*=stub`, `MONGODB_URI=mongodb+srv://stub...`, `PINECONE_*=stub`) — stubs satisfy the build but not runtime.

## Self-host

```bash
npm ci
npm run build
npm run start   # serves :3000
```

Any Node `>= 22` host works (VPS, Docker wrapper you own, Render/Fly). Provide real env vars; keep `access_token` cookie HTTPS in production (`secure` flag is prod-only).

## Environment matrix

| Var                      | Prod required | Notes                                                             |
| ------------------------ | ------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URI`    | Yes           | Public origin; baked into client + embed snippet + OAuth redirect |
| `SCALEKIT_*` (3)         | Yes           | OAuth tenant                                                      |
| `MONGODB_URI`            | Yes           | `db_connection()` throws without it                               |
| `PINECONE_API_KEY/INDEX` | No            | Without both: knowledge POSTs `400`, chat skips retrieval         |
| `UPSTASH_REDIS_*` (2)    | No            | Without both: no cache, no rate limits                            |

Pinecone index: **768 dimensions, cosine**. Redis: Upstash REST pair.

## Build behavior

- `src/lib/env.ts` never throws — missing vars log and fall back to `""`. A build with stubs succeeds; runtime calls (DB, Scalekit, Pinecone) fail downstream. Always verify post-deploy: login → dashboard → playground message → embed on a test page.
- `next.config.ts` marks `mammoth` as `serverExternalPackages` (DOCX parsing). No extra config for `unpdf`.
- Embed widget needs no build: `public/chat_bot.js` is served as-is. The snippet's `src` origin determines the API origin, so test sites must point at the right deployment.

## Post-deploy checklist

- [ ] `/api/auth/login` redirects to Scalekit (not `400/500`).
- [ ] Callback lands on `/dashboard` with `access_token` set.
- [ ] Playground answers (provider key valid).
- [ ] Knowledge `POST` works (Pinecone) or degrades with a clear `400`.
- [ ] Embed on an external origin chats (CORS `*` on `/api/chat` + `/api/chat/config`).
- [ ] Redis (if set): repeat config/chat calls hit cache; abuse triggers `429 + Retry-After`.
