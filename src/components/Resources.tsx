"use client";

import { motion } from "motion/react";
import { ChevronRight, BookOpen, Code2, Newspaper, FileText, ArrowUpRight } from "lucide-react";

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    desc: "Step-by-step guides to set up, train, and customize your bot.",
    tag: "Guides",
  },
  {
    icon: Code2,
    title: "API reference",
    desc: "Integrate SupportAI deeply with our REST API and webhooks.",
    tag: "Developers",
  },
  {
    icon: Newspaper,
    title: "Blog",
    desc: "Product updates, best practices, and support playbooks.",
    tag: "Reading",
  },
  {
    icon: FileText,
    title: "Tutorials",
    desc: "Hands-on walkthroughs for the most common workflows.",
    tag: "Learn",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 },
};

export const Resources = () => {
  return (
    <section id="resources" className="scroll-mt-24 max-w-7xl mx-auto mb-32 px-4">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            RESOURCES
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
          Learn &amp; build with SupportAI
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-500">
          Everything you need to go from sign-up to a live, on-brand assistant.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.a
              key={r.title}
              href="#"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.07 }}
              className="group flex flex-col sm:flex-row items-start gap-4 sm:gap-5 rounded-3xl border border-zinc-200 bg-gray-50 shadow p-6 sm:p-7 transition-colors hover:border-zinc-300"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900">{r.title}</h3>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] tracking-widest text-zinc-500">
                    {r.tag.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{r.desc}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 self-end sm:self-start text-zinc-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900" />
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};
