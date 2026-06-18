"use client";

import { CopyButton } from "@/components/CopyButton";
import { ENV } from "@/lib/env";
import { Bot } from "lucide-react";

export const Embed = ({ botId }: { botId: string }) => {
  const script = `<script\n  src="${ENV.API_URI}/chat_bot.js"\n  data-bot-id="${botId}"\n></script>`;
  const steps = [
    {
      n: "01",
      title: "Copy the snippet",
      desc: "Click the copy button to grab this bot's personalised script tag.",
    },
    {
      n: "02",
      title: "Paste before </body>",
      desc: "Open your HTML file and paste just before the closing body tag.",
    },
    {
      n: "03",
      title: "Save & deploy",
      desc: "Save your file and upload it to your server or redeploy your project.",
    },
    {
      n: "04",
      title: "See it live",
      desc: "Visit your site — the chat widget appears in the bottom-right corner.",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Embed this chatbot</h2>
        <p className="text-sm text-slate-400">
          One script tag. Zero dependencies. Paste it once and this bot is live on any website.
        </p>
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header bar */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-zinc-800 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <span className="flex-1 font-mono text-[12px] tracking-wider text-slate-400">
              index.html
            </span>
            <CopyButton text={script} />
          </div>

          {/* Code */}
          <pre className="m-0 overflow-x-auto bg-white px-7 py-7 font-mono text-[13.5px] leading-[1.9]">
            <code>
              <span className="text-sky-500">&lt;script</span>
              {"\n  "}
              <span className="text-violet-500">src</span>
              <span className="text-slate-400">=</span>
              <span className="text-orange-400">&quot;{ENV.API_URI}/chat_bot.js&quot;</span>
              {"\n  "}
              <span className="text-violet-500">data-bot-id</span>
              <span className="text-slate-400">=</span>
              <span className="text-orange-400">&quot;{botId}&quot;</span>
              {"\n"}
              <span className="text-sky-500">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>

        <p className="pl-1 font-mono text-[12px] text-slate-400">
          ↳ Place this just before your closing{" "}
          <code className="rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[12px] text-violet-500">
            &lt;/body&gt;
          </code>{" "}
          tag
        </p>
      </section>

      <section>
        <h3 className="mb-5 text-base font-bold tracking-tight text-slate-900">How to integrate</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(139,92,246,0.1)]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-violet-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative mb-4 block font-mono text-[11px] font-medium tracking-widest text-violet-400">
                {s.n}
              </span>
              <h4 className="relative mb-2 text-[15px] font-semibold tracking-tight text-slate-800">
                {s.title}
              </h4>
              <p className="relative text-[13px] leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-4">
          <h3 className="text-base font-bold tracking-tight text-slate-900">Live preview</h3>
          <span className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-[11px] text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
            </div>
            <span className="rounded border border-slate-200 bg-white px-3 py-1 font-mono text-[12px] text-slate-400">
              yourwebsite.com
            </span>
          </div>

          <div className="relative flex h-64 items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3 text-slate-300">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className="font-mono text-[13px]">Your website content</span>
            </div>

            <div className="absolute bottom-5 right-5 flex h-13 w-13 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
              <Bot />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
