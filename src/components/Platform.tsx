"use client";

import { motion } from "motion/react";
import { ChevronRight, Database, Bot, BarChart3, Plug } from "lucide-react";

const cards = [
  {
    icon: Database,
    title: "Knowledge ingestion",
    desc: "Connect docs, help center, and FAQs. We index everything automatically.",
  },
  {
    icon: BarChart3,
    title: "Insights & analytics",
    desc: "Track resolution rates, top questions, and gaps in your content.",
  },
  {
    icon: Plug,
    title: "Drop-in integrations",
    desc: "Embed on any site with one script tag. Works with your stack.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 },
};

export const Platform = () => {
  return (
    <section id="platform" className="scroll-mt-24 max-w-7xl mx-auto mb-32 px-4">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            PLATFORM
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
          One platform to power every conversation
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-500">
          From ingesting your knowledge to answering customers in real time — it all runs in one
          place.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Featured dark card */}
        <motion.div
          {...fadeUp}
          className="md:col-span-3 relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"
          />
          <div className="relative lg:max-w-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl lg:text-3xl font-bold tracking-tight">
              AI answers, grounded in your docs
            </h3>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              Every reply is generated from your own knowledge base — accurate, on-brand, and cited.
              No hallucinations, no generic guesses.
            </p>
          </div>

          {/* Faux conversation */}
          <div className="relative flex-1 w-full rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex justify-end">
              <span className="rounded-2xl rounded-br-md bg-white/10 px-4 py-2 text-sm">
                How do I request a refund?
              </span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-4 w-4" />
              </div>
              <span className="rounded-2xl rounded-tl-md bg-white/10 px-4 py-2 text-sm text-zinc-300">
                You can request a refund within 30 days right from your account settings → Billing →
                Refunds.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Supporting cards */}
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 + i * 0.08 }}
              className="group rounded-3xl border border-zinc-200 bg-gray-50 shadow p-7 transition-colors hover:border-zinc-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
