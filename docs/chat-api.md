# Chat API

Public endpoints consumed by the embed widget. No session required; CORS `Access-Control-Allow-Origin: *`.

## `POST /api/chat`

Answers a prompt. File: `src/app/api/chat/route.ts`.

### Request

Validated by `chatRequestSchema` (`src/lib/validations.ts`):

```json
{
  "prompt": "Where is my order?",
  "botId": "64f...",
  "sessionId": "s_abc123",
  "preview": false,
  "history": [{ "role": "user", "text": "hi" }]
}
```

| Field       | Required                 | Notes                                                                       |
| ----------- | ------------------------ | --------------------------------------------------------------------------- |
| `prompt`    | Yes                      | Non-empty string                                                            |
| `botId`     | One of `botId`/`ownerId` | Valid ObjectId preferred. `ownerId` is legacy fallback only.                |
| `ownerId`   | (see above)              | Nullable. Legacy fallback: owner's first `live` bot (`404` when none).      |
| `sessionId` | No                       | Persist the exchange when present and `preview` is falsy.                   |
| `preview`   | No                       | Playground mode: replays `history`, skips live-check scoping and DB writes. |
| `history`   | No                       | Prior turns for preview only (`{role: user\|model, text}`), last 20 kept.   |

Invalid bodies → `400 { success: false, message: "<zod issues joined by '; '>" }`.

### Rate limiting

`rateLimit(rl:chat:{botId|ownerId|unknown}:{ip}, limit, 60s)` — Redis fixed-window (`INCR`+`EXPIRE` Lua), fail-open on Redis errors.

| Mode     | Limit                     |
| -------- | ------------------------- |
| Embedded | 20 req/min per IP per bot |
| Preview  | 60 req/min per IP per bot |

Exceeded → `429 { success: false, message: "Rate limit exceeded..." }` with `Retry-After` header (also exposed via CORS). IP resolution (`getClientIp`): `cf-connecting-ip` → first `x-forwarded-for` → `x-real-ip` → `"0.0.0.0"`. Without Redis, no limiting occurs.

### Resolution and errors

| Status | When                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------- |
| `404`  | Unknown id → `"Chatbot not found."`; draft id (non-preview) → `"This chatbot is not published yet."` |
| `400`  | Bot has no API key → `"No API key configured for this chatbot."`                                     |
| `500`  | LLM/RAG infra failure → `"An error occurred while processing the request."`                          |

### Context and persistence

- History: preview slices request `history` to `HISTORY_LIMIT = 20`; embedded loads the conversation's last 20 `Message` rows.
- RAG (best-effort): if `isRagConfigured()` and the provider supports embeddings, top-5 `similaritySearch({botId})` snippets prepend `Relevant knowledge:\n[1] ...\n---\n` to `bot.knowledge`. Retrieval errors never fail the reply.
- Model: `getChatModel(provider, apiKey, model)` (`temperature: 0.3`); reply content normalized from string | content-parts.
- Persist (only when `!preview && sessionId`): upsert `Conversation {botId, sessionId}` (`messageCount + 2`, `lastMessageAt = now`), `insertMany` user + model `Message`s. Logging errors never fail the reply. Invalidates `cache:analytics:{owner}`, `cache:analytics:{owner}:{bot}`, `cache:conversations:{bot}`, `cache:conversation:{bot}:{convo}`.

### Response

```json
{ "success": true, "data": { "role": "model", "text": "..." } }
```

`OPTIONS` returns `204` with CORS headers.

### Example

```bash
curl -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"What are your pricing plans?","botId":"<BOT_ID>","sessionId":"s_demo123"}'
```

## `GET /api/chat/config?botId=...`

Widget theming. File: `src/app/api/chat/config/route.ts`.

- Public, CORS `*`, `Cache-Control: private, no-store` (freshness via Redis, not edge cache).
- `botId` must be a valid ObjectId; only `live` bots resolve (draft-aware `404`).
- Cached: `Cache.get(cache:bot_config:{botId})` TTL 300s → `{ success: true, appearance }`; else `findOne(...).select("appearance")`, cache, return.
- Invalidated on bot update/delete — appearance edits propagate within ~5 min worst case (instant on cache miss after invalidation).

```bash
curl 'http://localhost:3000/api/chat/config?botId=<BOT_ID>'
```
