# Dashboard

All agent building, tuning, and monitoring lives under `/dashboard` (route group `src/app/(user)/dashboard`, so URLs have no `/user` prefix). Guarded by `proxy()` + inline `requireOwner()`.

## Account-wide views

| Page     | Route                | Contents                                                                                                                                                                               |
| -------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview | `/dashboard`         | Totals (agents, live, conversations, messages), activity chart with `today / 7d / 14d / 12m / yearly` filter, top agents, recent conversations. Empty state → 3-step first-agent card. |
| Agents   | `/dashboard/agents`  | Grid of all agents: status badge (live/draft), Open link, three-dot delete menu.                                                                                                       |
| Plugins  | `/dashboard/plugins` | Integrations — Notion token (`PUT /api/account`). Required before Notion knowledge sources work.                                                                                       |
| Account  | `/dashboard/account` | Account management.                                                                                                                                                                    |

Layout (`layout.tsx`): `requireOwner()` else redirect to login, `listChatbots()`, sidebar (`AppSidebar`), page transition, top-center toaster.

## Per-agent views

Open any agent (`/dashboard/bots/[botId]/*`). Header shows avatar initials, live/draft badge, `businessName · industry`; tab bar + separator below.

| Tab           | Route                  | Component           | Notes                                                                                                       |
| ------------- | ---------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Overview      | `/dashboard/bots/[id]` | Bot overview        | Conversation/message counts, last active, AI/model/key summary                                              |
| Playground    | `.../playground`       | `AgentPlayground`   | `preview: true` chat. Tests tone/knowledge freely; nothing is stored. 60 req/min limit.                     |
| Config        | `.../config`           | `BotConfigForm`     | Name, status, business info, persona, provider/model/key. Delete section (`DeleteBotSection`).              |
| Knowledge     | `.../knowledge`        | `KnowledgeManager`  | Text/URL/File/Notion tabs, doc list with status badges + chunk counts + delete.                             |
| Appearance    | `.../appearance`       | `AppearanceForm`    | Display name, logo, greeting (≤60), headline (≤120), welcome, placeholder (≤80), 1–6 prompts. Live preview. |
| Embed         | `.../embed`            | `Embed`             | Snippet for this `botId`, live-status check, 4 install steps.                                               |
| Conversations | `.../conversations`    | `ConversationsView` | Session list (last 50) → full transcript per session.                                                       |

Every route ships a `loading.tsx` skeleton.

## Frontend patterns

- Server components fetch (session, `listChatbots`, `getChatbot`, analytics) and pass props down; `"use client"` components own interactivity.
- Server state via TanStack React Query (`QueryProvider` in root layout, keys in `src/lib/query-keys.ts`, `apiClient` axios with `withCredentials`).
- Hooks: `use-bots` (`useUpdateBot`), `use-documents`, `use-conversations`, `use-chat`.
- No global store; form state is local `useState` with dirty tracking.
- Charts: `recharts` (`OverviewChart`); icons `lucide-react`; animation `motion/react`.
