"use client";

import { motion } from "motion/react";
import {
  ChevronRight,
  ShoppingCart,
  Cloud,
  Banknote,
  HeartPulse,
  GraduationCap,
  Headphones,
} from "lucide-react";

const cases = [
  {
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Answer order, shipping, and return questions instantly — and cut ticket volume.",
  },
  {
    icon: Cloud,
    title: "SaaS",
    desc: "Onboard users and deflect how-to questions with answers pulled from your docs.",
  },
  {
    icon: Banknote,
    title: "Fintech",
    desc: "Handle account and billing queries with accurate, compliant, on-brand replies.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    desc: "Guide patients through appointments, forms, and policies around the clock.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Support students and staff with instant answers on courses and admissions.",
  },
  {
    icon: Headphones,
    title: "Internal helpdesk",
    desc: "Give your team one place to ask IT, HR, and ops questions — no more digging.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 },
};

export const UseCases = () => {
  return (
    <section id="use-cases" className="scroll-mt-24 max-w-7xl mx-auto mb-32 px-4">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            USE CASES
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
          Built for every support team
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-500">
          Whatever you sell, SupportAI answers from your own knowledge — in your tone, in seconds.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 shadow"
      >
        {cases.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="group relative bg-gray-50 p-6 sm:p-8 transition-colors hover:bg-zinc-50"
            >
              <span className="absolute right-6 top-6 font-mono text-xs text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};
