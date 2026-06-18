"use client";

import { CopyButton } from "@/components/CopyButton";
import { ENV } from "@/lib/env";
import { Bot } from "lucide-react";
import { motion } from "motion/react";

export const Embed = ({ ownerId }: { ownerId: string }) => {
  const script = `<script\n  src="${ENV.API_URI}/chat_bot.js"\n  data-owner-id="${ownerId}"\n></script>`;
  const steps = [
    {
      n: "01",
      title: "Copy the snippet",
      desc: "Click the copy button to grab your personalised script tag.",
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
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
      className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden py-24"
    >
      <div className="relative z-10 max-w-4xl mx-auto border border-zinc-200 shadow-2xl rounded-2xl p-2 md:p-4 lg:p-6 space-y-8">
        <section className="text-left space-y-2">
          <h1 className="text-2xl lg:text-4xl font-bold leading-[1.08] tracking-tight text-slate-900">
            Embed your <span className="text-zinc-400">chat Bot</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            One script tag. Zero dependencies. Paste it once and you&apos;re live on any website.
          </p>
        </section>

        <section className="mb-16 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border-b border-slate-200">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              <span className="flex-1 font-mono text-[12px] text-slate-400 tracking-wider">
                index.html
              </span>
              <CopyButton text={script} />
            </div>

            {/* Code */}
            <pre className="px-7 py-7 font-mono text-[13.5px] leading-[1.9] overflow-x-auto m-0 bg-white">
              <code>
                <span className="text-sky-500">&lt;script</span>
                {"\n  "}
                <span className="text-violet-500">src</span>
                <span className="text-slate-400">=</span>
                <span className="text-orange-400">&quot;{ENV.API_URI}/chat_bot.js&quot;</span>
                {"\n  "}
                <span className="text-violet-500">data-owner-id</span>
                <span className="text-slate-400">=</span>
                <span className="text-orange-400">&quot;{ownerId}&quot;</span>
                {"\n"}
                <span className="text-sky-500">&gt;&lt;/script&gt;</span>
              </code>
            </pre>
          </div>

          <p className="mt-3 pl-1 font-mono text-[12px] text-slate-400">
            ↳ Place this just before your closing{" "}
            <code className="rounded px-1.5 py-0.5 bg-violet-50 text-violet-500 border border-violet-200 text-[12px]">
              &lt;/body&gt;
            </code>{" "}
            tag
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-7">How to integrate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(139,92,246,0.1)]"
              >
                {/* hover shimmer */}
                <div className="absolute inset-0 bg-linear-to-br from-violet-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="relative block font-mono text-[11px] font-medium text-violet-400 tracking-widest mb-4">
                  {s.n}
                </span>
                <h3 className="relative text-[15px] font-semibold text-slate-800 tracking-tight mb-2">
                  {s.title}
                </h3>
                <p className="relative text-[13px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="">
          <div className="flex items-center gap-4 mb-7">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Live Preview</h2>
            <span className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-[11px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 border-b border-slate-200">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              <span className="font-mono text-[12px] text-slate-400 bg-white border border-slate-200 rounded px-3 py-1">
                yourwebsite.com
              </span>
            </div>

            {/* Preview body */}
            <div className="relative h-64 flex items-center justify-center bg-slate-50">
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

              {/* Simulated widget button */}
              <div className="absolute bottom-5 right-5 w-13 h-13 rounded-full bg-slate-900 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] text-white">
                <Bot />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
