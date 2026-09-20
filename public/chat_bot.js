(async function () {
  const script_tag = document.currentScript;
  const bot_id = script_tag.getAttribute("data-bot-id");
  const owner_id = script_tag.getAttribute("data-owner-id");
  // Derive the API origin from the script's own URL so the widget works on any deployment.
  const API_ORIGIN = new URL(script_tag.src).origin;
  const API_URI = API_ORIGIN + "/api/chat";

  if (!bot_id && !owner_id) {
    // Never alert() on someone else's page: log for the integrator instead.
    console.error(
      "[SupportAI] Missing data-bot-id on the embed script tag; chat widget not started.",
    );
    return;
  }

  // Stable anonymous session id so a visitor's messages group into one conversation.
  let session_id = null;
  try {
    session_id = localStorage.getItem("supportai_session_id");
    if (!session_id) {
      session_id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("supportai_session_id", session_id);
    }
  } catch {
    session_id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const DEFAULT_SUB =
    "I'm here to help you tackle your tasks. Choose from the prompts below or just tell me what you need!";

  // Longest prompt the widget will send. The API sets no upper bound, so the
  // input enforces one: it keeps payloads and token bills sane.
  const MAX_CHARS = 2000;

  // Input placeholder comes from the bot's appearance config; this is the
  // fallback used before the config loads and after a rate-limit cooldown.
  let inputPlaceholder = "Ask me anything...";

  /* ----------------------------- CSS --------------------------------- */
  const style = document.createElement("style");
  style.textContent = `
    #chatbot-toggle, #chatbot-box {
      /* Warm paper theme — sampled from the app's oklch tokens
         (light: card/foreground/muted/secondary/border/input/primary) */
      color-scheme: light dark;
      /* Cut inherited host typography: body line-height / text-align from
         the embedding page must not leak through the shadow boundary. */
      line-height: 1.5;
      text-align: start;
      --ink:    #3d3929;
      --sub:    #83827d;
      --faint:  #b4b2a7;
      --line:   #dad9d4;
      --chip:   #e9e6dc;
      --chip-hover: #d8d4c8;
      --composer: #ede9de;
      --panel:  #faf9f5;
      --radius: 10px;
      --font: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    /* Dark app theme — follows the visitor's OS color scheme, since the
       embed runs on third-party pages that can't share the dashboard's
       dark class. Values sampled from the dark oklch tokens. */
    @media (prefers-color-scheme: dark) {
      #chatbot-toggle, #chatbot-box {
        --ink:    #faf9f5;
        --sub:    #b7b5a9;
        --faint:  #52514a;
        --line:   #3e3e38;
        --chip:   #1a1915;
        --chip-hover: #393834;
        --composer: #1b1b19;
        --panel:  #262624;
      }
    }

    #chatbot-toggle {
      all: unset;
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #3ddc84;
      color: #0e0e0c;
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(19,19,19,.22), 0 2px 6px rgba(19,19,19,.12);
      transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease;
      font-family: var(--font);
    }
    #chatbot-toggle:hover {
      transform: scale(1.06) translateY(-2px);
      box-shadow: 0 12px 32px rgba(19,19,19,.28), 0 4px 10px rgba(19,19,19,.14);
    }
    #chatbot-toggle:active { transform: scale(.95); }
    #chatbot-toggle:focus-visible { outline: 2px solid #0e0e0c; outline-offset: 3px; }

    #chatbot-toggle .icon-chat,
    #chatbot-toggle .icon-close {
      position: absolute;
      transition: opacity .2s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    #chatbot-toggle.open .icon-chat  { opacity: 0; transform: rotate(90deg) scale(.5); }
    #chatbot-toggle .icon-close       { opacity: 0; transform: rotate(-90deg) scale(.5); }
    #chatbot-toggle.open .icon-close  { opacity: 1; transform: rotate(0deg) scale(1); }

    #chatbot-box {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 400px;
      height: 660px;
      max-height: calc(100vh - 140px);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: none;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: var(--font);
      color: var(--ink);
      z-index: 2147483646;
      transform-origin: bottom right;
      -webkit-font-smoothing: antialiased;
    }
    #chatbot-box.visible {
      display: flex;
      animation: cb-pop-in .32s cubic-bezier(.34,1.56,.64,1) forwards;
    }
    @keyframes cb-pop-in {
      from { opacity: 0; transform: scale(.9) translateY(14px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    #chatbot-box.expanded {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: auto;
      height: auto;
      max-height: none;
      border-radius: 0;
    }
    /* Expanded: document-style reading column */
    .expanded .cb-topbar {
      padding: 14px 20px 12px;
    }
    .expanded .cb-scroll {
      align-items: center;
      padding: 12px 24px 16px;
    }
    .expanded .cb-hero,
    .expanded #chatbot-messages {
      width: 100%;
      max-width: 760px;
    }
    .expanded .cb-hero {
      padding-top: 48px;
    }
    .expanded .cb-dock {
      display: flex;
      justify-content: center;
      padding: 12px 24px 6px;
    }
    .expanded .cb-composer {
      width: 100%;
      max-width: 760px;
    }

    /* Top utility bar */
    .cb-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px 0;
      flex-shrink: 0;
    }
    .cb-topbar-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .cb-icon-btn {
      all: unset;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #6f6c68;
      cursor: pointer;
      transition: background .15s ease, color .15s ease, transform .15s ease;
    }
    .cb-icon-btn:hover { background: var(--chip); color: var(--ink); }
    .cb-icon-btn:active { transform: scale(.92); }
    .cb-icon-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    /* Scroll region: hero + messages */
    .cb-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      padding: 8px 24px 12px;
      display: flex;
      flex-direction: column;
      scrollbar-width: thin;
      scrollbar-color: var(--faint) transparent;
    }
    .cb-scroll::-webkit-scrollbar { width: 4px; }
    .cb-scroll::-webkit-scrollbar-thumb { background: var(--faint); border-radius: 4px; }
    /* Edge fade: content dissolves under the top / above the dock while scrolling */
    .cb-scroll.cb-mask-top {
      -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 32px);
      mask-image: linear-gradient(to bottom, transparent 0, #000 32px);
    }
    .cb-scroll.cb-mask-bottom {
      -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent 100%);
      mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent 100%);
    }
    .cb-scroll.cb-mask-top.cb-mask-bottom {
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0,
        #000 32px,
        #000 calc(100% - 32px),
        transparent 100%
      );
      mask-image: linear-gradient(
        to bottom,
        transparent 0,
        #000 32px,
        #000 calc(100% - 32px),
        transparent 100%
      );
    }

    /* Hero (empty state) */
    .cb-hero {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 26px 0 8px;
    }
    .cb-mark {
      width: 62px;
      height: 62px;
      border-radius: 12px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 26px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .cb-mark img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
    .cb-eyebrow {
      margin: 0;
      font-size: 23px;
      font-weight: 500;
      letter-spacing: -.01em;
      color: var(--sub);
    }
    .cb-title {
      margin: 2px 0 0;
      font-size: 21px;
      font-weight: 650;
      letter-spacing: -.015em;
      line-height: 1.3;
      color: var(--ink);
    }
    .cb-sub {
      margin: 12px 0 0;
      font-size: 14.5px;
      line-height: 1.55;
      color: var(--sub);
      max-width: 330px;
    }

    .cb-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 24px;
    }
    .cb-chip {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 14px 8px 11px;
      background: var(--chip);
      border: 1px solid transparent;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 550;
      letter-spacing: -.005em;
      color: var(--ink);
      cursor: pointer;
      transition: background .15s ease, border-color .15s ease, transform .15s cubic-bezier(.34,1.56,.64,1);
      font-family: var(--font);
    }
    .cb-chip:hover { background: var(--chip-hover); transform: translateY(-1px); }
    .cb-chip:active { transform: scale(.96); }
    .cb-chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .cb-chip svg { flex-shrink: 0; }

    /* Messages */
    #chatbot-messages {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 6px 0 4px;
    }
    #chatbot-messages:empty { padding: 0; }
    .cb-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
      animation: cb-msg-in .22s cubic-bezier(.34,1.56,.64,1) forwards;
    }
    @keyframes cb-msg-in {
      from { opacity: 0; transform: translateY(8px) scale(.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .cb-msg.model {
      align-self: flex-start;
      background: var(--panel);
      color: var(--ink);
      border: 1px solid var(--line);
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(19,19,19,.05);
    }
    .cb-msg.cb-rate-limit { transition: opacity 0.3s ease; }
    .cb-msg.cb-rate-limit-hide { opacity: 0; }
    .cb-msg.user {
      align-self: flex-end;
      background: var(--ink);
      color: var(--panel);
      border-bottom-right-radius: 4px;
    }
    /* Rich text inside assistant messages */
    .cb-msg.model h1,
    .cb-msg.model h2,
    .cb-msg.model h3,
    .cb-msg.model h4,
    .cb-msg.model p,
    .cb-msg.model ul,
    .cb-msg.model ol,
    .cb-msg.model pre,
    .cb-msg.model table,
    .cb-msg.model blockquote {
      margin: 0 0 8px;
    }
    .cb-msg.model > :last-child { margin-bottom: 0; }
    .cb-msg.model h1 { font-size: 15px; font-weight: 700; }
    .cb-msg.model h2 { font-size: 14.5px; font-weight: 700; }
    .cb-msg.model h3 { font-size: 14px; font-weight: 650; }
    .cb-msg.model h4 { font-size: 13.5px; font-weight: 650; }
    .cb-msg.model ul,
    .cb-msg.model ol { padding-left: 20px; }
    .cb-msg.model li { margin: 3px 0; }
    .cb-msg.model li > ul,
    .cb-msg.model li > ol { margin: 3px 0 0; }
    .cb-msg.model a { color: var(--accent); text-decoration: underline; }
    .cb-msg.model code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.88em;
      background: var(--composer);
      border: 1px solid var(--line);
      border-radius: 5px;
      padding: 1px 5px;
    }
    .cb-msg.model pre {
      background: var(--composer);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px 12px;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .cb-msg.model pre::before {
      content: attr(data-lang);
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--faint);
      margin-bottom: 6px;
    }
    .cb-msg.model pre code {
      background: none;
      border: 0;
      padding: 0;
      font-size: 12.5px;
    }
    .cb-msg.model blockquote {
      border-left: 3px solid var(--accent);
      padding-left: 10px;
      color: var(--sub);
    }
    .cb-msg.model hr {
      border: 0;
      border-top: 1px solid var(--line);
    }
    .cb-msg.model table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .cb-msg.model th,
    .cb-msg.model td {
      text-align: left;
      border: 1px solid var(--line);
      padding: 6px 8px;
      vertical-align: top;
    }
    .cb-msg.model th { background: var(--composer); }
    .cb-typing {
      align-self: flex-start;
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 10px 18px 10px 13px;
      border-radius: 999px;
      border-bottom-left-radius: 6px;
      box-shadow: 0 1px 4px rgba(19,19,19,.05);
      animation: cb-msg-in .25s ease forwards;
    }
    .cb-typing-spinner {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: var(--accent);
      animation: cb-spin 1s linear infinite;
    }
    @keyframes cb-spin {
      to { transform: rotate(360deg); }
    }
    .cb-typing-text {
      font-size: 13.5px;
      font-weight: 550;
      letter-spacing: 0.01em;
      white-space: nowrap;
      background: linear-gradient(100deg, var(--sub) 30%, var(--ink) 50%, var(--sub) 70%);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      animation: cb-shimmer 1.6s linear infinite;
    }
    @keyframes cb-shimmer {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }

    /* Composer dock */
    .cb-dock { padding: 10px 14px 6px; flex-shrink: 0; background: var(--panel); }
    .cb-composer {
      position: relative;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--composer);
      overflow: hidden;
      transition: border-color .18s ease, box-shadow .18s ease;
    }
    .cb-count {
      position: absolute;
      left: 14px;
      bottom: 7px;
      font-size: 10.5px;
      letter-spacing: 0.02em;
      color: var(--faint);
      pointer-events: none;
    }
    .cb-count[hidden] { display: none; }
    .cb-count-max {
      color: var(--accent);
      font-weight: 600;
    }
    .cb-composer:focus-within {
      border-color: color-mix(in srgb, var(--accent) 55%, transparent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 8%, transparent);
    }
    .cb-ask {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px 8px 14px;
    }
    #chat-input {
      flex: 1;
      border: 0;
      background: transparent;
      resize: none;
      outline: none;
      font-family: var(--font);
      font-size: 14.5px;
      line-height: 1.5;
      color: var(--ink);
      padding: 2px 0 0;
      min-height: 22px;
      max-height: 150px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    #chat-input::-webkit-scrollbar {
      display: none;
    }
    #chat-input::placeholder { color: var(--faint); }
    .cb-ask-btn {
      all: unset;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--faint);
      cursor: pointer;
      flex-shrink: 0;
      transition: background .15s ease, color .15s ease, transform .15s ease;
    }
    .cb-ask-btn:hover { background: #ececea; color: var(--ink); }
    .cb-ask-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    #cb-send {
      width: 38px;
      height: 38px;
      align-self: flex-end;
      border-radius: 10px;
      background: var(--accent);
      color: #fff;
      box-shadow: 0 4px 12px rgba(19, 19, 19, 0.18);
    }
    #cb-send:hover {
      background: var(--accent);
      color: #fff;
      filter: brightness(0.92);
    }
    #cb-send:active {
      transform: scale(0.93);
    }
    #cb-send:disabled {
      opacity: 0.45;
      box-shadow: none;
      cursor: default;
      filter: none;
    }
    .cb-powered {
      flex-shrink: 0;
      text-align: center;
      font-size: 10.5px;
      letter-spacing: 0.04em;
      color: var(--faint);
      padding: 0 14px 10px;
      background: var(--panel);
    }
    .cb-powered a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }
    .cb-powered a:hover { text-decoration: underline; }
    .cb-powered a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
    }

    @media (max-width: 480px) {
      #chatbot-toggle { bottom: 16px; right: 16px; width: 44px; height: 44px; }
      #chatbot-box {
        right: 12px; left: 12px; width: auto;
        height: calc(100dvh - 130px);
        max-height: none;
        bottom: 82px;
      }
      .cb-scroll { padding: 4px 18px 10px; }
      .cb-eyebrow { font-size: 20px; }
      .cb-title { font-size: 18px; }
      .cb-sub { font-size: 13.5px; }
      .cb-chip { font-size: 12.5px; padding: 7px 12px 7px 10px; }
      #chat-input { min-height: 22px; font-size: 14px; }
    }
    @media (min-width: 481px) and (max-width: 768px) {
      #chatbot-box { width: 380px; }
    }
  `;
  const wrapper = document.createElement("div");
  wrapper.id = "supportai-chatbot-wrapper";
  wrapper.style.setProperty("--accent", "#c96442");
  // Opt out of smooth-scroll hijacking: libs like Lenis swallow wheel events
  // at the document level. The attribute lives on the light-DOM wrapper
  // because shadow events retarget to the host for outside listeners, so
  // inner elements are invisible to such libraries.
  // Collapse the host element out of the page's layout: it carries only
  // fixed-position shadow content, so it takes no space and shrugs off host
  // rules like `body{display:flex}` or `div{margin:...}`. Declarations carry
  // inline !important priority so host `!important` rules cannot override
  // them either. (No pointer-events/overflow tweaks: the former is inherited
  // by the widget, the latter is unnecessary at zero size, and fixed
  // descendants escape clipping regardless.)
  wrapper.style.setProperty("position", "absolute", "important");
  wrapper.style.setProperty("top", "0", "important");
  wrapper.style.setProperty("left", "0", "important");
  wrapper.style.setProperty("width", "0", "important");
  wrapper.style.setProperty("height", "0", "important");
  wrapper.style.setProperty("margin", "0", "important");
  wrapper.style.setProperty("padding", "0", "important");
  wrapper.style.setProperty("border", "0", "important");
  wrapper.setAttribute("data-lenis-prevent", "");
  const shadow = wrapper.attachShadow({ mode: "open" });
  shadow.appendChild(style);

  /* ---------------------------- Toggle btn --------------------------- */
  const button = document.createElement("button");
  button.id = "chatbot-toggle";
  button.setAttribute("aria-label", "Open chat");
  button.innerHTML =
    '<svg class="icon-chat" width="19" height="22" viewBox="0 0 28 32" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z"/></svg>' +
    '<svg class="icon-close" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>';

  /* ----------------------------- Panel ------------------------------- */
  const chat_box = document.createElement("div");
  chat_box.id = "chatbot-box";
  chat_box.setAttribute("role", "dialog");
  chat_box.setAttribute("aria-label", "Chat");
  chat_box.innerHTML = `
    <div class="cb-topbar">
      <button class="cb-icon-btn" id="cb-expand" title="Expand" aria-label="Expand chat" aria-pressed="false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H4v5"/><path d="M4 4l6 6"/><path d="M15 20h5v-5"/><path d="M20 20l-6-6"/></svg>
      </button>
      <span class="cb-topbar-group">
      <button class="cb-icon-btn" id="cb-newchat" title="New chat" aria-label="Start new chat">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="5" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/>
          <circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>
          <circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/>
        </svg>
      </button>
      <button class="cb-icon-btn" id="cb-close" aria-label="Close chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      </span>
    </div>

    <div class="cb-scroll" id="cb-scroll">
      <div class="cb-hero" id="cb-hero">
        <div class="cb-mark" id="cb-mark">
          <img src="${API_ORIGIN}/favicon.png" alt="Assistant logo" />
        </div>
        <p class="cb-eyebrow" id="cb-eyebrow">Hi there,</p>
        <h2 class="cb-title" id="cb-title">Welcome back! How can I help?</h2>
        <p class="cb-sub" id="cb-welcome">${DEFAULT_SUB}</p>
        <div class="cb-chips" id="cb-chips">
          <button class="cb-chip" data-prompt="Where is my order?">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2f7bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>
            Track my order
          </button>
          <button class="cb-chip" data-prompt="How do I contact human support?">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/></svg>
            Talk to support
          </button>
          <button class="cb-chip" data-prompt="What are your pricing plans?">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8590c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            Pricing &amp; plans
          </button>
          <button class="cb-chip" data-prompt="Help me troubleshoot an issue">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>
            Fix an issue
          </button>
          <button class="cb-chip" data-prompt="Show me your most frequently asked questions">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            FAQs
          </button>
          <button class="cb-chip" data-prompt="What else can you do?">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5z"/><path d="M19 2.5c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7z"/></svg>
            More
          </button>
        </div>
      </div>
      <div id="chatbot-messages" aria-live="polite"></div>
    </div>

    <div class="cb-dock">
      <div class="cb-composer">
        <div class="cb-ask">
          <textarea id="chat-input" rows="1" placeholder="Ask me anything..." aria-label="Ask me anything" autocomplete="off"></textarea>
          <button class="cb-ask-btn" id="cb-send" aria-label="Send message" title="Send" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
          </button>
        </div>
        <span class="cb-count" id="cb-count" hidden></span>
      </div>
    </div>
    <div class="cb-powered">Powered by <a id="cb-powered-link" href="#" target="_blank" rel="noopener">SupportAI</a></div>
  `;

  function setOpen(isOpen) {
    chat_box.classList.toggle("visible", isOpen);
    button.classList.toggle("open", isOpen);
    chat_box.style.display = isOpen ? "flex" : "none";
    button.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    // Fullscreen carries its own close button — never show the floater over it,
    // even when reopening a panel that was left expanded.
    const isFullscreen = chat_box.classList.contains("expanded");
    button.style.display = isOpen && isFullscreen ? "none" : "flex";
    if (isOpen) {
      chat_box.classList.remove("visible");
      void chat_box.offsetWidth;
      chat_box.classList.add("visible");
      const input = chat_box.querySelector("#chat-input");
      if (input) input.focus();
    }
  }

  button.onclick = () => setOpen(chat_box.style.display !== "flex");

  shadow.appendChild(button);
  shadow.appendChild(chat_box);
  // Mount on <html>, not <body>: any transformed/filtered ancestor becomes
  // the containing block for `position: fixed` descendants (and clips them
  // through its own overflow), and app shells commonly wrap body content in
  // such containers for transitions. <html> itself is effectively never
  // transformed, so the toggle and panel stay viewport-anchored on every
  // host. (Falls back to body only if documentElement is unavailable.)
  (document.documentElement || document.body).appendChild(wrapper);

  const scroller = chat_box.querySelector("#cb-scroll");
  const hero = chat_box.querySelector("#cb-hero");
  const chips = chat_box.querySelector("#cb-chips");
  const messages = chat_box.querySelector("#chatbot-messages");
  const chat_input = chat_box.querySelector("#chat-input");
  const send_btn = chat_box.querySelector("#cb-send");
  const close_btn = chat_box.querySelector("#cb-close");
  const newchat_btn = chat_box.querySelector("#cb-newchat");
  const expand_btn = chat_box.querySelector("#cb-expand");

  close_btn.onclick = () => setOpen(false);

  const EXPAND_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H4v5"/><path d="M4 4l6 6"/><path d="M15 20h5v-5"/><path d="M20 20l-6-6"/></svg>';
  const COMPRESS_ICON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5"/><path d="M4 4l6 6"/><path d="M20 15v5h-5"/><path d="M20 20l-6-6"/></svg>';
  expand_btn.onclick = () => {
    const expanded = chat_box.classList.toggle("expanded");
    expand_btn.innerHTML = expanded ? COMPRESS_ICON : EXPAND_ICON;
    expand_btn.setAttribute("aria-label", expanded ? "Restore chat size" : "Expand chat");
    expand_btn.setAttribute("title", expanded ? "Restore" : "Expand");
    expand_btn.setAttribute("aria-pressed", String(expanded));
    // Fullscreen has its own close button — park the floating toggle.
    button.style.display = expanded ? "none" : "flex";
    syncScrollFade();
  };

  const powered_link = chat_box.querySelector("#cb-powered-link");
  if (powered_link) powered_link.href = API_ORIGIN + "/";

  function scrollBottom() {
    scroller.scrollTop = scroller.scrollHeight;
    syncScrollFade();
  }

  // Top fade only when scrolled down, bottom fade only when more sits below.
  function syncScrollFade() {
    scroller.classList.toggle("cb-mask-top", scroller.scrollTop > 8);
    const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    scroller.classList.toggle("cb-mask-bottom", remaining > 8);
  }
  scroller.addEventListener("scroll", syncScrollFade, { passive: true });
  // Hostile-host shield: some apps lock page scrolling with document-level
  // `wheel`/`touchmove` preventDefault (modal managers, scroll-lock libs,
  // smooth-scrollers, full-page scrollers). Those composed events bubble out
  // of the shadow tree, so stop them at the panel — the widget scrolls
  // natively and never needs host handlers to see these events. Passive is
  // fine: stopPropagation (unlike preventDefault) is allowed in passive
  // listeners. Scoped to the panel so the floating toggle still lets the
  // page scroll normally underneath it.
  ["wheel", "touchmove"].forEach(function (type) {
    chat_box.addEventListener(
      type,
      function (e) {
        e.stopPropagation();
      },
      { passive: true },
    );
  });
  window.addEventListener("resize", syncScrollFade);
  syncScrollFade();

  function resetChat() {
    // Invalidate any in-flight reply first: the aborted request settles at
    // once (unblocking the composer), and the generation check in
    // sendMessage drops its response so it can never land in the fresh chat.
    chatGeneration++;
    if (activeRequest) {
      activeRequest.abort();
      activeRequest = null;
    }
    // Rotate the session so the next reply starts a fresh server-side
    // conversation; otherwise it would still be conditioned on the history
    // just cleared from the screen.
    session_id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try {
      localStorage.setItem("supportai_session_id", session_id);
    } catch {
      // Storage unavailable (e.g. private mode): memory-only session.
    }
    messages.innerHTML = "";
    hero.style.display = "flex";
    chat_input.value = "";
    syncAskButtons();
    syncCount();
    chat_input.focus();
    scrollBottom();
  }
  newchat_btn.onclick = resetChat;

  // Send button is always visible; enabled only when there is text to send,
  // no reply is currently pending, and no rate-limit cooldown is active.
  let sending = false;
  let activeRequest = null;
  let chatGeneration = 0;
  let cooldownUntil = 0;
  let rateLimitTimer = null;
  let rateLimitNode = null;
  function syncAskButtons() {
    send_btn.disabled =
      sending || Date.now() < cooldownUntil || chat_input.value.trim().length === 0;
  }
  // After a 429, park sending until the window resets: the server counts
  // every hit (even blocked ones), so retrying early only extends the ban.
  // A notice bubble carries a live countdown and removes itself the moment
  // the ban lifts; the input placeholder mirrors the countdown meanwhile.
  function clearRateLimitUI() {
    if (rateLimitTimer) {
      clearInterval(rateLimitTimer);
      rateLimitTimer = null;
    }
    if (rateLimitNode) {
      const node = rateLimitNode;
      rateLimitNode = null;
      node.classList.add("cb-rate-limit-hide");
      setTimeout(function () {
        node.remove();
      }, 350);
    }
    chat_input.placeholder = inputPlaceholder;
    syncAskButtons();
  }
  function showRateLimit(seconds) {
    clearRateLimitUI();
    cooldownUntil = Date.now() + seconds * 1000;
    syncAskButtons();
    const box = document.createElement("div");
    box.className = "cb-msg model cb-rate-limit";
    box.innerHTML =
      'Rate limit: please wait <strong><span class="cb-rate-secs">' +
      seconds +
      "</span>s</strong> before sending another message.";
    messages.appendChild(box);
    scrollBottom();
    rateLimitNode = box;
    const secsEl = box.querySelector(".cb-rate-secs");
    chat_input.placeholder = "Please wait " + seconds + "s...";
    rateLimitTimer = setInterval(function () {
      const left = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (left <= 0) {
        clearRateLimitUI();
        return;
      }
      if (secsEl) secsEl.textContent = String(left);
      chat_input.placeholder = "Please wait " + left + "s...";
    }, 1000);
  }
  chat_input.addEventListener("input", (e) => {
    if (!e.isComposing && chat_input.value.length > MAX_CHARS) {
      chat_input.value = chat_input.value.slice(0, MAX_CHARS);
    }
    chat_input.style.height = "auto";
    chat_input.style.height = Math.min(chat_input.scrollHeight, 150) + "px";
    syncAskButtons();
    syncCount();
  });
  syncAskButtons();

  // Character counter: appears for the last stretch, flags the ceiling.
  const count_el = chat_box.querySelector("#cb-count");
  function syncCount() {
    const len = chat_input.value.length;
    if (len < Math.ceil(MAX_CHARS * 0.8)) {
      count_el.hidden = true;
      return;
    }
    count_el.hidden = false;
    count_el.textContent = len + " / " + MAX_CHARS;
    count_el.classList.toggle("cb-count-max", len >= MAX_CHARS);
  }

  chips.addEventListener("click", (e) => {
    const chip = e.target.closest(".cb-chip");
    if (!chip) return;
    chat_input.value = chip.getAttribute("data-prompt") || chip.textContent.trim();
    syncAskButtons();
    sendMessage();
  });

  // Decorative icons cycled across custom shortcut chips (label and prompt
  // text always come from the bot owner; labels are set via textContent).
  const CHIP_ICONS = [
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2f7bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1f9d55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8590c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5z"/><path d="M19 2.5c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7z"/></svg>',
  ];

  function renderPrompts(prompts) {
    chips.innerHTML = "";
    prompts.slice(0, 6).forEach(function (p, i) {
      if (!p || !p.label || !String(p.label).trim()) return;
      const btn = document.createElement("button");
      btn.className = "cb-chip";
      btn.setAttribute("data-prompt", p.prompt && String(p.prompt).trim() ? p.prompt : p.label);
      btn.innerHTML = CHIP_ICONS[i % CHIP_ICONS.length];
      btn.appendChild(document.createTextNode(String(p.label)));
      chips.appendChild(btn);
    });
  }

  /* ------------------ Apply per-bot appearance ----------------------- */
  if (bot_id) {
    // no-store: the config endpoint is edge-cached (s-maxage), and a plain
    // fetch could otherwise keep serving pre-save appearance for minutes.
    fetch(API_ORIGIN + "/api/chat/config?botId=" + encodeURIComponent(bot_id), {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((cfg) => {
        if (!cfg || !cfg.success || !cfg.appearance) {
          console.warn(
            "[SupportAI] Using default chat appearance" +
              (cfg && cfg.message ? ": " + cfg.message : " (config unavailable)") +
              " [botId=" +
              bot_id +
              "]",
          );
          return;
        }
        const a = cfg.appearance;

        // Colors are fixed to the brand theme: a stored per-bot accentColor
        // (from before color customization was removed) is intentionally
        // ignored so every embed renders identically.
        if (a.displayName) {
          button.setAttribute("aria-label", "Chat with " + a.displayName);
          chat_box.setAttribute("aria-label", "Chat with " + a.displayName);
        }

        const mark = chat_box.querySelector("#cb-mark");
        if (a.avatarUrl && mark) {
          // DOM sink only: assigning .src never parses HTML, so a hostile
          // avatarUrl (e.g. `" onerror="...`) cannot break out into markup.
          const logo = mark.querySelector("img") || document.createElement("img");
          logo.src = a.avatarUrl;
          logo.alt = "Assistant avatar";
          if (!logo.parentNode) {
            mark.textContent = "";
            mark.appendChild(logo);
          }
        }

        if (a.welcomeMessage) {
          const sub = chat_box.querySelector("#cb-welcome");
          if (sub) sub.textContent = a.welcomeMessage;
        }

        if (a.greeting) {
          const eyebrow = chat_box.querySelector("#cb-eyebrow");
          if (eyebrow) eyebrow.textContent = a.greeting;
        }

        if (a.headline) {
          const title = chat_box.querySelector("#cb-title");
          if (title) title.textContent = a.headline;
        }

        if (a.placeholder) {
          inputPlaceholder = a.placeholder;
          chat_input.placeholder = a.placeholder;
          chat_input.setAttribute("aria-label", a.placeholder);
        }

        if (Array.isArray(a.prompts) && a.prompts.length) {
          renderPrompts(a.prompts);
        }
      })
      .catch(() => {
        console.warn(
          "[SupportAI] Chat config fetch failed; using default appearance [botId=" + bot_id + "]",
        );
      });
  }

  // Tiny markdown renderer for assistant messages: HTML is escaped first,
  // then a safe subset (headings, bold/italic/strike, code, links, lists,
  // quotes, tables, rules) is applied. User messages stay plain text.
  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderInline(s) {
    const codes = [];
    s = s.replace(/`([^`\n]+)`/g, function (m, code) {
      codes.push("<code>" + code + "</code>");
      return " " + (codes.length - 1) + " ";
    });
    s = s
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/(^|[^a-zA-Z0-9_])_([^_]+)_/g, "$1<em>$2</em>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (m, label, url) {
        const safe = /^(https?:\/\/|mailto:)/i.test(url) ? url : "#";
        return '<a href="' + safe + '" target="_blank" rel="noopener">' + label + "</a>";
      })
      .replace(
        /(^|\s)(https?:\/\/[^\s<]+)/g,
        '$1<a href="$2" target="_blank" rel="noopener">$2</a>',
      );
    return s.replace(/ (\d+) /g, function (m, i) {
      return codes[+i];
    });
  }

  function renderListBlock(lines) {
    let html = "";
    const stack = [];
    lines.forEach(function (line) {
      const m = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
      if (!m) {
        if (stack.length) html += "<br>" + renderInline(line.trim());
        return;
      }
      const indent = m[1].replace(/\t/g, "  ").length;
      const tag = /^\d/.test(m[2]) ? "ol" : "ul";
      while (stack.length && indent < stack[stack.length - 1].indent) {
        html += "</li></" + stack.pop().tag + ">";
      }
      if (!stack.length || indent > stack[stack.length - 1].indent) {
        stack.push({ indent: indent, tag: tag });
        html += "<" + tag + "><li>" + renderInline(m[3]);
      } else {
        if (stack[stack.length - 1].tag !== tag) {
          html += "</li></" + stack.pop().tag + ">";
          stack.push({ indent: indent, tag: tag });
          html += "<" + tag + ">";
        }
        html += "</li><li>" + renderInline(m[3]);
      }
    });
    while (stack.length) html += "</li></" + stack.pop().tag + ">";
    return html;
  }

  function isTableBlock(lines) {
    if (lines.length < 2 || !lines.every((l) => l.indexOf("|") !== -1)) return false;
    return /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[1]) && /-{2,}/.test(lines[1]);
  }

  function renderTable(lines) {
    const row = function (l, cell) {
      return (
        "<tr>" +
        l
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map(function (c) {
            return "<" + cell + ">" + renderInline(c.trim()) + "</" + cell + ">";
          })
          .join("") +
        "</tr>"
      );
    };
    return (
      "<table><thead>" +
      row(lines[0], "th") +
      "</thead><tbody>" +
      lines
        .slice(2)
        .map(function (l) {
          return row(l, "td");
        })
        .join("") +
      "</tbody></table>"
    );
  }

  function renderMarkdown(src) {
    const fenced = [];
    src = escapeHtml(src.replace(/\r\n/g, "\n"));
    src = src.replace(/```(\w*)\n([\s\S]*?)(?:```|$)/g, function (m, lang, code) {
      fenced.push(
        '<pre data-lang="' +
          (lang || "code") +
          '"><code>' +
          code.replace(/\n$/, "") +
          "</code></pre>",
      );
      return "" + (fenced.length - 1) + "";
    });
    return src
      .split(/\n{2,}/)
      .map(function (block) {
        const lines = block.split("\n");
        if (lines.length === 1 && /^\d+$/.test(lines[0])) {
          return fenced[+lines[0].slice(1, -1)];
        }
        const first = lines[0];
        const heading = first.match(/^(#{1,4})\s+(.*)$/);
        if (heading) {
          return (
            "<h" +
            heading[1].length +
            ">" +
            renderInline(heading[2]) +
            "</h" +
            heading[1].length +
            ">"
          );
        }
        if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(first) && lines.length === 1) return "<hr>";
        if (lines.every((l) => /^\s*&gt;/.test(l))) {
          return (
            "<blockquote>" +
            renderInline(lines.map((l) => l.replace(/^\s*&gt;+\s?/, "")).join("<br>")) +
            "</blockquote>"
          );
        }
        if (lines.some((l) => /^(\s*)([-*+]|\d+[.)])\s+/.test(l))) return renderListBlock(lines);
        if (isTableBlock(lines)) return renderTable(lines);
        return "<p>" + renderInline(lines.join("<br>")) + "</p>";
      })
      .join("");
  }

  function add_message(text, role) {
    if (role === "user" && hero.style.display !== "none") {
      hero.style.display = "none";
    }
    const box = document.createElement("div");
    box.className = "cb-msg " + role;
    if (role === "model") box.innerHTML = renderMarkdown(text);
    else box.textContent = text;
    messages.appendChild(box);
    scrollBottom();
  }

  send_btn.onclick = sendMessage;

  chat_input.addEventListener("keydown", (e) => {
    // Skip while an IME composition is active: Enter confirms the
    // candidate first, and submitting mid-composition would send
    // incomplete text (mirrors the isComposing guard on input).
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Escape") setOpen(false);
  });

  async function sendMessage() {
    const text = chat_input.value.trim().slice(0, MAX_CHARS);
    if (!text || sending || Date.now() < cooldownUntil) return;
    sending = true;
    syncAskButtons();
    const generation = chatGeneration;

    add_message(text, "user");
    chat_input.value = "";
    chat_input.style.height = "auto";
    syncAskButtons();
    syncCount();

    const typing = document.createElement("div");
    typing.className = "cb-typing";
    typing.setAttribute("aria-label", "Assistant is typing");
    typing.setAttribute("role", "status");
    typing.innerHTML =
      '<svg class="cb-typing-spinner" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0.5 3.2"/></svg>' +
      '<span class="cb-typing-text">Agent shaping...</span>';
    messages.appendChild(typing);
    scrollBottom();

    const ctrl = new AbortController();
    activeRequest = ctrl;
    const timer = setTimeout(function () {
      ctrl.abort();
    }, 60000);
    try {
      const res = await fetch(API_URI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          prompt: text,
          botId: bot_id,
          ownerId: owner_id,
          sessionId: session_id,
        }),
      });
      activeRequest = null;

      let val = null;
      try {
        val = await res.json();
      } catch {
        val = null;
      }

      typing.remove();
      if (generation !== chatGeneration) {
        // New chat started while this request was in flight; drop the stale
        // response instead of appending it under the restored hero.
        sending = false;
        syncAskButtons();
        return;
      }
      if (val && val.success && val.data && val.data.text) {
        add_message(val.data.text, "model");
      } else if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") || "", 10);
        if (retryAfter > 0) {
          showRateLimit(Math.min(retryAfter, 300));
        } else {
          add_message(
            (val && val.message) || "Rate limit: please slow down a bit and try again soon.",
            "model",
          );
        }
      } else if (res.status >= 500) {
        add_message(
          "The service is having trouble right now. Please try again in a moment.",
          "model",
        );
      } else {
        add_message(
          (val && val.message) || "Sorry, I'm not available right now. Please try again later.",
          "model",
        );
      }
    } catch (error) {
      activeRequest = null;
      typing.remove();
      // A reset aborts the request on purpose: no error bubble in the new chat.
      // The 60s timeout keeps its generation, so its message still shows.
      if (generation === chatGeneration) {
        if (error && error.name === "AbortError") {
          add_message("That took too long. Please check your connection and try again.", "model");
        } else {
          add_message("Sorry, something went wrong. Please try again.", "model");
        }
      }
    } finally {
      // Stay armed through body parsing: fetch resolves on headers, so a
      // stalled body would otherwise hang the composer past the timeout.
      clearTimeout(timer);
    }
    sending = false;
    syncAskButtons();
  }
})();
