# Embed Widget

Self-contained vanilla JS (`public/chat_bot.js`, ~1267 lines, no build step). One tag adds the chat bubble to any site: WordPress, Shopify, Next.js, plain HTML.

## Install

1. Set the agent **live** (Config → status, or **Make live now** at creation). Draft agents return `404 "This chatbot is not published yet."`.
2. Open the agent → **Embed** tab → copy the snippet.
3. Paste before `</body>`:

```html
<script
  src="https://supportai-seven.vercel.app/chat_bot.js"
  data-bot-id="YOUR_CHAT_BOT_ID"
></script>
```

For local testing, replace the origin with your `NEXT_PUBLIC_API_URI` (e.g. `http://localhost:3000/chat_bot.js`). A static demo lives at `public/index.html`.

## How it boots

- Reads `document.currentScript`: `data-bot-id` (preferred) or legacy `data-owner-id`. Derives `API_ORIGIN` from `script.src`. Aborts with `console.error` if both ids are missing.
- Mounts `div#supportai-chatbot-wrapper` with `attachShadow({ mode: "open" })` so host CSS (e.g. `body { display: flex }`) cannot break it. Injects ~600 lines of scoped styles.
- Session: `localStorage supportai_session_id`, else `s_<random><timestamp>`; rotated on **New chat**.
- Fetches `GET {origin}/api/chat/config?botId=...` (`cache: no-store`) and applies `appearance.{displayName, avatarUrl, welcomeMessage, greeting, headline, placeholder, prompts[0..6]}`. Falls back to defaults with a console warning on failure. Legacy `accentColor` is ignored — brand accent `#c96442` is fixed.

## UI behavior

- Toggle: 48px circle, chat/close morph, `z-index: 2147483647`. Panel: 400×660 at `bottom:100px right:28px` with pop-in; `.expanded` fullscreen mode; under 480px it docks to `100dvh - 130px`.
- Topbar: expand/compress, new-chat, close. Empty state: favicon mark, eyebrow, title, welcome, up to 6 shortcut chips (defaults: Track order, Talk to support, Pricing, Fix issue, FAQs, More).
- Composer: auto-growing textarea, 2000-char client limit with counter past 80%, `Enter` send / `Shift+Enter` newline, IME `isComposing` guard, `Escape` closes.
- Theming: CSS vars (`--ink`, `--sub`, `--line`, `--chip`, `--composer`, `--panel`, `--accent`); dark mode follows `prefers-color-scheme` (OS setting, not a dashboard toggle); `prefers-reduced-motion` disables animation.
- Markdown: HTML-escaped, then a safe subset (h1–h4, bold/italic/strike, inline + fenced code with `data-lang`, `https?`/`mailto` links only, nested lists, blockquote, hr, tables). User messages use `textContent` only; `avatarUrl` assigned via `.src`; chips via `textContent` — XSS-safe.
- Chat: `POST {origin}/api/chat {prompt, botId, ownerId, sessionId}` with 60s `AbortController` timeout and a generation counter that drops stale replies after reset. Typing state reads `Agent shaping…`. `429` shows a live countdown (capped 300s, mirrors `Retry-After`); `≥500` shows a generic error.
- Persistence: conversations survive page visits via the stored `sessionId` (server upserts `Conversation` + two `Message` rows per turn).
- Appearance tab fields map 1:1 to the widget: display name, logo, greeting, headline, welcome, placeholder, prompts. Until the agent is live, the widget shows defaults.

## Customization limits

- Position/size are fixed (bottom-right bubble). No per-site CSS API — edit `public/chat_bot.js` and self-host it if you need chrome changes.
- Colors follow the brand accent; per-agent `accentColor` is stored but not applied by the current widget.
