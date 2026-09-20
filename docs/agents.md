# Agents

An agent is one chatbot row (`Chatbot` model) with its own business context, persona, provider, key, knowledge pointer, and appearance. Everything is per-agent — there is no account-level AI fallback.

## Lifecycle

```text
draft → live → (embed serves traffic) → draft (pause) → delete (cascades)
```

- New agents default to `draft` unless **Make live now** is checked.
- Only `live` agents answer `POST /api/chat` from the embed widget. Drafts return `404 "This chatbot is not published yet."`.
- `preview: true` (Playground) bypasses the live check and is never persisted.
- Deleting an agent removes its conversations, messages, documents, chunks, and Pinecone vectors.

## 4-step creation wizard

Dashboard → **New agent** (`/dashboard/agents/new`, `CreateAgentWizard.tsx`) → `POST /api/chatbots`.

### Step 1 — Basics

| Field                    | Purpose                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| Agent name               | Internal label (default `Untitled chatbot`)                                 |
| Business name + industry | Grounds tone/terminology; industry list in `options.ts` (11 values + Other) |
| Support email            | Shown on escalation; defaults to owner email                                |
| Business description     | Free text: offer, audience, differentiators                                 |

### Step 2 — Persona

| Field                      | Purpose                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Bot display name           | Shown in the widget (default `Support Agent`)                                              |
| Communication tone         | 8 options: Friendly, Professional, Casual, Formal, Empathetic, Concise, Playful, Technical |
| Personality & instructions | Free-form: greeting style, avoid-list, edge cases                                          |

These feed `buildKnowledge()` (`src/lib/knowledge.ts`) into the system prompt: Business Context + Persona + Core Instructions + Safety Rules.

### Step 3 — Model & key

| Field    | Values                                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider | `gemini` (Google Gemini) or `openai` (OpenAI); `normalizeProvider()` defaults to Gemini                                                                                                 |
| Model    | Gemini: `gemini-2.5-flash-lite` (default), `gemini-3.1-flash-lite`, `gemini-3.5-flash-lite`. OpenAI: `gpt-4o-mini` (default), `gpt-4o`, `gpt-4-turbo`. Empty string = provider default. |
| API key  | Pasted per agent into `apiKeyOverride`. Trimmed; never shared across agents.                                                                                                            |

Chat temperature is fixed at `0.3` (`src/lib/ai.ts`).

### Step 4 — Review

Confirm the summary, toggle **Make live now**, create. Re-open the agent to add knowledge, tune appearance, and grab the embed tag.

## Managing an agent

Per-agent tabs (`/dashboard/bots/[botId]/*`):

| Tab           | Route           | What you do                                                             |
| ------------- | --------------- | ----------------------------------------------------------------------- |
| Overview      | `(detail)`      | Stats: conversations, messages, last active; AI/model/key summary       |
| Playground    | `playground`    | Browser chat with `preview: true` — free testing, nothing saved         |
| Config        | `config`        | Edit name, status, business/persona, provider/model/key; delete agent   |
| Knowledge     | `knowledge`     | Add/remove Text, URL, File, Notion sources; watch `processing → ready`  |
| Appearance    | `appearance`    | Display name, logo, greeting, headline, welcome, placeholder, 6 prompts |
| Embed         | `embed`         | Copy `<script>` snippet; confirms `live` status                         |
| Conversations | `conversations` | Browse sessions, read transcripts                                       |

Updates go through `PUT /api/chatbots/[botId]` (`chatbotUpdateSchema`). Appearance prompts replace wholesale (1–6 items, `label ≤ 40`, `prompt ≤ 200`). Saving regenerates `knowledge` and invalidates `cache:bot*`, `cache:bot_config:*`, analytics, and conversation caches.

## Providers and embeddings

| Provider | Chat models                            | Embedding model (768d)                            |
| -------- | -------------------------------------- | ------------------------------------------------- |
| `gemini` | 2.5 / 3.1 / 3.5 Flash-Lite             | `gemini-embedding-001` (MRL-truncated 3072 → 768) |
| `openai` | `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo` | `text-embedding-3-small` (reduced to 768)         |

Both support embeddings (`supportsEmbeddings()` is true for both), so RAG works with either. One Pinecone index serves all agents because every vector is 768 dims.

> Do not change the embedding model lightly: existing Pinecone vectors become invalid and every document must be deleted and re-added. See the NOTE in `src/lib/ai.ts`.
