# Knowledge Base

Each agent answers from two layers: (1) a system instruction built from its business/persona config, and (2) optional RAG retrieval over your documents in Pinecone.

## Sources

| Source | Input                                   | When to use                              |
| ------ | --------------------------------------- | ---------------------------------------- |
| Text   | Pasted content                          | FAQs, policies, product details          |
| URL    | Web page URL                            | Help articles, docs pages, product pages |
| File   | PDF, DOCX, TXT, MD, CSV                 | Manuals, spreadsheets, long documents    |
| Notion | Page or database ID (needs integration) | Workspace content                        |

Add from the agent → **Knowledge** tab (`KnowledgeManager.tsx`, 4 tabs). Title is optional. Files accept `.pdf,.docx,.txt,.md,.csv`.

### Status

| Status       | Meaning                                        |
| ------------ | ---------------------------------------------- |
| `processing` | Being split and embedded — check back          |
| `ready`      | Indexed; retrieval can use it                  |
| `error`      | Indexing failed — re-add or try a smaller file |

## Ingestion pipeline

1. `POST /api/chatbots/[botId]/documents` (owner-checked, `runtime: nodejs`). Requires `isRagConfigured()` or `400 "Knowledge base not configured (Pinecone)"`.
2. Extract text:
   - File → `extractTextFromFile()` (`src/lib/extractFile.ts`): PDF via dynamic `import("unpdf")`, DOCX via `mammoth` (in `serverExternalPackages`), TXT/MD/CSV via UTF-8 read. Other extensions → `400 Unsupported file type`.
   - URL → `fetch` + `stripHtml` (drops script/style/tags, collapses whitespace).
   - Text → direct content.
   - Notion → `extractTextFromNotion()` via `NotionAPILoader`; requires the owner token from **Plugins** (`PUT /api/account`), else `400 "Configure ... Plugins first"`. Accepts page or database IDs/URLs (`parseNotionId` handles 32-hex).
3. Needs the bot's own API key + a provider with embeddings, else `400`.
4. Rate limit: `rl:docs:{owner}:{bot}` — 10 requests / 10 min, else `429`.
5. `splitText()` (`src/lib/rag.ts`): `RecursiveCharacterTextSplitter`, 1000 chars / 150 overlap, whitespace-normalized. Empty result → `400 "No usable text"`.
6. `Document.create({ status: processing })` → `addDocuments()` (Pinecone `fromExistingIndex`, metadata `{botId, documentId}`, ids `${docId}_${i}`) + `Chunk.insertMany()` → `status: ready, chunkCount`. Failure → `status: error` + `500 "Failed to index"`.

Delete with `DELETE /api/chatbots/[botId]/documents/[docId]`: removes Pinecone vectors (best-effort `deleteVectors`) + Mongo `chunks` + `document`.

## Retrieval at chat time

In `POST /api/chat`:

```text
systemText = bot.knowledge
if (isRagConfigured() && supportsEmbeddings(provider)):
  snippets = retrieve(provider, apiKey, botId, prompt, 5)   # similaritySearch filter {botId}
  if snippets: systemText = "Relevant knowledge:\n[1] ...\n---\n" + bot.knowledge
invoke([SystemMessage(systemText), ...last 20 turns, HumanMessage(prompt)])
```

- Retrieval is best-effort: failures log and fall back to the system prompt.
- Only the owning bot's chunks match (Pinecone metadata filter `{botId}`).
- History limit `HISTORY_LIMIT = 20` applies to both preview and persisted chats.

## Limits and notes

- Pinecone index must be **768 dimensions, cosine**. All embeddings are pinned to 768d so one index serves both providers.
- Large PDFs/DOCX take longer; `processing` is synchronous in the request — keep files focused.
- Notion databases use `propertiesAsHeader`; the integration must be invited to each page/database (Notion share → invite).
- One-off legacy migration: `node --env-file=.env.local scripts/migrate-business-to-chatbot.mjs` (idempotent).
