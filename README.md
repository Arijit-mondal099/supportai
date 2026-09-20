<div align="center">

<img alt="SupportAI" src="public/favicon.png" width="50" height="50" align="center" style="vertical-align: middle;">
<h1><a href="https://supportai-seven.vercel.app" style="color: white; text-decoration: none;">SupportAI</a></h1>

**AI-powered customer support, trained on your knowledge.**

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot/pulls)

[English](README.md) | [हिंदी](README.hi.md) | [बांলা](README.bn.md)

</div>

---

<div align="center">

Build custom AI support agents that know your business. Configure personality, tone, and AI for each agent. Add your knowledge — files, URLs, text, or Notion — and add a chat widget to any site with one `<script>` tag. No third-party processors, no hidden costs — you stay in control of your data.

</div>

<div align="center">

</div>

<div align="center">

<img alt="SupportAI Dashboard" src="public/dashboard.png" width="700">

</div>

## What is SupportAI?

SupportAI is a platform for creating AI-powered customer support chatbots. Each agent has its own personality, AI (Google Gemini or OpenAI), key, and knowledge base — giving you complete control over data and cost.

Built for businesses and SaaS products that want intelligent, on-brand support without sending customer data to third-party chat platforms. Your keys, your knowledge, your account.

---

## Features

| Feature                  | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| **AI Chat**              | Natural, helpful answers powered by Gemini or GPT                            |
| **Knowledge Base**       | Upload PDFs, DOCX, TXT, MD, CSV — or paste text, add a URL, connect Notion   |
| **Custom Persona**       | Set the bot name, tone of voice, and personality for each agent              |
| **Embed Widget**         | One small `<script>` tag that adds chat to any website                       |
| **AI Choice**            | Each agent can use Google Gemini or OpenAI, with its own model and key       |
| **Conversation History** | Remembers conversations with each visitor                                    |
| **Analytics Dashboard**  | Stats, activity charts with time filters, top agents, and per-agent insights |

---

## Build Your First Agent

Agents are created and managed from the **Dashboard**. Sign in, then click **New agent**. Each agent has its own AI, model, and key — so you can mix and match across your account.

The creation flow is a 4-step wizard:

### Step 1 — Basics

Give your agent context so it stays on-brand:

- **Agent name** — an internal label you'll recognize later (e.g. "Acme Returns")
- **Business name** + **Industry** — used to ground the agent's tone and terminology
- **Support email** — shown to visitors when the bot escalates to a human
- **Business description** — a short paragraph about what you offer, who you serve, and what sets you apart

### Step 2 — Persona

Make the agent feel like part of your team:

- **Bot display name** — the name shown in the chat window (e.g. "Aria", "Max")
- **Communication tone** — pick from Friendly, Professional, Casual, Formal, Empathetic, Concise, Playful, or Technical
- **Personality & instructions** — free-form guidance: how it greets users, topics to avoid, edge-case handling, etc.

### Step 3 — Model & Key

Choose the brain behind the agent:

- **AI** — Google Gemini or OpenAI
- **Model** — e.g. Gemini 2.5 Flash-Lite or GPT-4o mini
- **Key** — paste your key from Google or OpenAI. Each agent has its own key, so you can track cost per agent.

### Step 4 — Review

Check the summary, then decide:

- Toggle **Make live now** to publish the agent to embedded sites immediately — or leave it in draft and finish configuring first.

> Once created, you can open **Config** to switch the status between **draft** and **live** at any time. An agent must be **live** before visitors can chat with it through the embed widget.

---

## Add Knowledge

An agent is only as smart as the information you give it. After creating an agent, open its **Knowledge** tab and add sources. You can use any combination:

| Source     | Format                  | When to use it                                           |
| ---------- | ----------------------- | -------------------------------------------------------- |
| **Text**   | Plain text              | Paste FAQs, policies, product details, or return reasons |
| **URL**    | Web page URL            | Scrape a help article, docs page, or product page        |
| **File**   | PDF, DOCX, TXT, MD, CSV | Upload a manual, spreadsheet, or long-form document      |
| **Notion** | Page or database ID     | Index your Notion workspace content                      |

### Adding a source

1. Open the agent → **Knowledge** tab.
2. Pick a source type from the tabs: **Text**, **URL**, **File**, or **Notion**.
3. Fill in the content and click **Add to knowledge base**.
4. The document is prepared and its status updates in the list below:

| Status         | What it means                                       |
| -------------- | --------------------------------------------------- |
| **ready**      | Added and ready to answer questions                 |
| **processing** | Still being split and embedded — check back         |
| **error**      | Something went wrong — re-add or try a smaller file |

> Notion requires an integration token set up once in **Plugins**. Make sure your integration is invited to the page or database you want to index (share → invite → your integration name).

Each source is prepared automatically, so your agent can find the most relevant answers.

---

## Embed on Your Site

Once an agent is **live**, you can put it on any website:

1. Open the agent → **Embed** tab.
2. Copy the single script tag.
3. Paste it into your site's HTML, just before the closing `</body>` tag.
4. Save and deploy — the chat widget appears in the bottom-right corner.

```html
<script
  src="https://supportai-seven.vercel.app/chat_bot.js"
  data-bot-id="YOUR_CHAT_BOT_ID"
></script>
```

This is one small script file — no extra setup needed. It works on any website (WordPress, Shopify, Next.js, plain HTML, and more).

The widget automatically:

- Uses the **display name**, **logo**, **greeting**, **headline**, **welcome message**, **input hint**, and **shortcut prompts (up to 6)** you set in the agent's **Appearance** tab
- Remembers the conversation so visitors can keep chatting across page visits
- Works on both mobile and desktop

---

## Dashboard Guide

Everything you need to build, tune, and monitor your agents lives in the Dashboard.

### Account-wide views

| Page         | What you see                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview** | A snapshot across all your agents: total agents, live count, conversations, messages, an activity chart with time filters, your top agents, and recent conversations. Click **New agent** from here to start. |
| **Agents**   | A grid of every agent you've created. Each card shows its status (live/draft) and a quick **Open** link to manage it. Use the three-dot menu to delete an agent.                                              |
| **Plugins**  | Connect extras — e.g. add your Notion connection used for Notion knowledge sources.                                                                                                                           |
| **Settings** | Manage your account.                                                                                                                                                                                          |

### Per-agent views

Open any agent to see its tab bar:

| Tab               | What you do here                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview**      | Quick stats: conversation count, message count, last active time, and key details (AI, model, and key).                                                                   |
| **Playground**    | Try your agent right in the browser. Send messages and see replies — without saving anything.                                                                             |
| **Config**        | Edit the agent name, status (draft/live), business info, personality, AI, model, and key. Also where you can permanently delete the agent.                                |
| **Knowledge**     | Add, browse, and remove knowledge sources (Text, URL, File, Notion). Watch each document go from `processing` to `ready`.                                                 |
| **Appearance**    | Change how the chat looks: display name, logo image, greeting, headline, welcome message, input hint, and shortcut prompts (up to 6). A live preview updates as you type. |
| **Embed**         | Grab the `<script>` snippet for this agent and confirm it's **live**.                                                                                                     |
| **Conversations** | Browse every visitor session for this agent. Click a session to read the full transcript.                                                                                 |

---

## How It Works

1. **Create your agent** — give it a name, business context, and personality.
2. **Pick an AI** — choose Google Gemini or OpenAI, and add that agent's key.
3. **Add your knowledge** — upload files, paste text, add URLs, or connect Notion.
4. **Test in the Playground** — adjust the personality and tone until it sounds right.
5. **Embed** — copy one `<script>` tag and add it to your site.

When someone chats, the agent uses your chosen personality and the most relevant knowledge from your sources to answer through your chosen AI.

---

## License

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Released under the MIT License. See [LICENSE](LICENSE) for details.
