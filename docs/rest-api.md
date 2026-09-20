# REST API

Dashboard backend. All routes below require the `access_token` cookie (`requireOwner()`); unauthenticated → `401 { success: false, message: "Unauthorized" }`. Every response uses `{ success, message?, data?, error? }` unless noted. Owner scoping is server-side — `ownerId` comes from the session, never the client.

## Auth

| Method | Path               | Notes                                                              |
| ------ | ------------------ | ------------------------------------------------------------------ |
| GET    | `/api/auth/login`  | Redirects to Scalekit authorize URL.                               |
| GET    | `/api/auth/verify` | `?code=` callback; sets `httpOnly` cookie; redirects `/dashboard`. |
| GET    | `/api/auth/logout` | Clears Redis session + cookie; redirects to `ENV.API_URI`.         |

See [Authentication](authentication.md).

## Chatbots

### `GET /api/chatbots`

List owner's agents. Cached `cache:bots:{owner}` (120s).

```json
{
  "success": true,
  "bots": [{ "_id": "...", "name": "...", "status": "live", "...": "see serializeBot" }]
}
```

`serializeBot()` (`src/lib/chatbots.ts`) masks the key as `•••• + last4`.

### `POST /api/chatbots` → `201`

Create (lenient schema — parse failure falls back to `{}`).

```json
{
  "name": "Acme Returns",
  "status": "draft",
  "supportEmail": "help@acme.test",
  "provider": "gemini",
  "model": "",
  "apiKey": "AIza...",
  "businessInfo": { "businessName": "Acme", "industry": "E-commerce", "description": "..." },
  "botInfo": { "botName": "Aria", "communicationTone": "Friendly", "personalityDescription": "..." }
}
```

Defaults: `name "Untitled chatbot"`, `status draft` (unless `live`), `supportEmail` → owner email, `provider` normalized (unknown → `gemini`), `apiKeyOverride` trimmed, `knowledge = buildKnowledge(...)`. Invalidates `cache:bots:*`, `cache:analytics:*`.

### `GET /api/chatbots/[botId]`

One agent. Cached `cache:bot:{owner}:{bot}` (120s). Bad id or foreign owner → `404`.

### `PUT /api/chatbots/[botId]`

Full/partial update (`chatbotUpdateSchema`, strict — `400` on Zod errors). Same fields as create plus:

```json
{
  "appearance": {
    "accentColor": "#e8440a",
    "avatarUrl": "https://...",
    "displayName": "Aria",
    "welcomeMessage": "Hello! ...",
    "greeting": "Hi there,",
    "headline": "Welcome back!...",
    "placeholder": "Ask me anything...",
    "prompts": [{ "label": "...", "prompt": "..." }]
  }
}
```

Constraints: `accentColor` hex `#rrggbb`; `displayName` 1–100; `greeting ≤ 60`; `headline ≤ 120`; `placeholder ≤ 80`; `prompts` 1–6, `label ≤ 40`, `prompt ≤ 200` (replaces wholesale). Merges `businessInfo/botInfo/appearance`, regenerates `knowledge`, `save()`. Invalidates `cache:bot_config:*`, `cache:bot:*`, `cache:bots:*`, analytics, conversations.

### `DELETE /api/chatbots/[botId]`

Deletes the bot + `conversations/messages/documents/chunks` for that `botId` + Pinecone vectors (best-effort via stored `pineconeIds`) + same cache keys. → `{ success: true, message: "Chatbot deleted" }`.

## Documents (knowledge)

`runtime = nodejs`. All require bot ownership.

### `GET /api/chatbots/[botId]/documents`

```json
{
  "success": true,
  "documents": [
    { "_id": "...", "title": "...", "sourceType": "file", "status": "ready", "chunkCount": 12 }
  ]
}
```

Sorted `createdAt: -1`.

### `POST /api/chatbots/[botId]/documents` → `201`

Requires Pinecone configured, else `400`. Rate limit `rl:docs:{owner}:{bot}` 10/10min → `429`.

Multipart (file):

```bash
curl -X POST http://localhost:3000/api/chatbots/<BOT>/documents \
  -H 'Cookie: access_token=<JWT>' \
  -F 'file=@manual.pdf' -F 'title=Returns manual'
```

JSON:

```json
{ "sourceType": "url", "title": "Help page", "url": "https://..." }
{ "sourceType": "text", "title": "FAQs", "content": "..." }
{ "sourceType": "notion", "title": "Handbook", "resourceId": "<page-or-db-id-or-url>", "resourceType": "page" }
```

Notion needs the Plugins token first. URL fetch strips HTML; Notion uses `NotionAPILoader`. Empty extraction → `400 "No usable text"`. Success → `{ success: true, document: {...} }`; indexing failure marks `error` + `500 "Failed to index"`.

### `DELETE /api/chatbots/[botId]/documents/[docId]`

Removes Pinecone vectors + chunks + document. → `{ success: true, message: "Document deleted" }`.

## Conversations

### `GET /api/chatbots/[botId]/conversations`

List (last 50, `lastMessageAt` desc). Cached `cache:conversations:{bot}` (60s):

```json
{ "success": true, "conversations": [{ "_id": "...", "sessionId": "s_...", "messageCount": 4 }] }
```

### `GET /api/chatbots/[botId]/conversations?conversationId=...`

Transcript (`createdAt` asc). Cached `cache:conversation:{bot}:{convo}` (120s):

```json
{
  "success": true,
  "messages": [{ "_id": "...", "role": "user", "text": "...", "createdAt": "..." }]
}
```

## Analytics

### `GET /api/chatbots/[botId]/analytics`

Per-agent totals. Cached `cache:analytics:{owner}:{bot}` (300s):

```json
{ "success": true, "analytics": { "conversations": 12, "messages": 48, "lastActiveAt": "..." } }
```

### `GET /api/analytics?range=...`

Account activity series (`src/lib/analytics.ts`). `range ∈ today | 7d | 14d | 12m | yearly` (default `14d`); else `400 "Invalid range"`:

```json
{ "success": true, "data": { "range": "14d", "points": [{ "label": "Mon", "messages": 7 }] } }
```

`getAccountAnalytics()` also powers the overview (totals, live count, daily series, top agents, recent conversations).

## Account (Plugins)

### `GET /api/account`

```json
{ "success": true, "hasNotionIntegration": false }
```

### `PUT /api/account`

```json
{ "notionIntegrationToken": "secret_..." }
```

Trimmed; `""` clears. Upserts `Owner`. → `{ success: true, hasNotionIntegration: true }`.

## Client conventions

- Frontend uses `apiClient` (`src/lib/axios.ts`: `baseURL NEXT_PUBLIC_API_URI`, `withCredentials: true`) + React Query keys (`src/lib/query-keys.ts`).
- Mutations must invalidate: bots list, bot detail, documents, conversations — mirroring the server cache keys above.
