"use client";

import { motion } from "motion/react";
import { ChevronRight, Clock, TrendingDown, Zap, Settings } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Round-the-clock support without human limitations",
  },
  {
    icon: TrendingDown,
    title: "Cost Reduction",
    desc: "Reduce support costs by up to 60% with automated responses",
  },
  {
    icon: Zap,
    title: "Fast Response Time",
    desc: "Instant answers to customer queries in milliseconds",
  },
  {
    icon: Settings,
    title: "Admin Controlled",
    desc: "Full control over knowledge, tone, and escalation rules",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 },
};

export const Feature = () => {
  return (
    <section id="features" className="scroll-mt-24 max-w-7xl mx-auto mb-32 px-4">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            WHY SUPPORTAI
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
          Why Businesses Choose Support<span className="text-zinc-400">AI</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-500">
          The tools you need to deliver fast, accurate, on-brand support at scale.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="group rounded-3xl border border-zinc-200 bg-gray-50 p-6 sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
