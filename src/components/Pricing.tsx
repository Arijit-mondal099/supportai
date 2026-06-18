"use client";

import { motion } from "motion/react";
import { ChevronRight, Check, Github } from "lucide-react";

// TODO: point this at your real repository.
const REPO_URL = "https://github.com/Arijit-mondal099/AI-Customer-Support-Chatbot";

const included = [
  "Unlimited chatbots",
  "Unlimited conversations",
  "Self-host anywhere",
  "Full source code access",
  "Custom persona & branding",
  "Community support",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 },
};

export const Pricing = () => {
  const handleGetStarted = (): void => {
    window.location.href = "/api/auth/login";
  };

  return (
    <section id="pricing" className="scroll-mt-24 max-w-7xl mx-auto mb-32 px-4">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            OPEN SOURCE
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
          Free and open source. Forever.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-500">
          SupportAI is MIT-licensed and free to self-host. No seats, no usage caps, no credit card.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          {/* Price + CTAs */}
          <div className="lg:w-80 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-widest text-zinc-300">
              MIT LICENSE
            </span>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">$0</span>
              <span className="mb-2 text-sm font-medium text-zinc-400">forever</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Clone it, self-host it, and make it yours.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <motion.a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                <Github className="h-4 w-4 shrink-0" />
                <span>View on GitHub</span>
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 cursor-pointer"
              >
                Get started free
              </motion.button>
            </div>
          </div>

          {/* Divider — visible on all screens */}
          <div className="w-full h-px lg:w-px lg:h-auto bg-white/10" />

          {/* What's included */}
          <div className="flex-1">
            <p className="font-mono text-xs tracking-widest text-zinc-400 mb-5">
              EVERYTHING INCLUDED
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {included.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  <span className="text-sm text-zinc-200">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
