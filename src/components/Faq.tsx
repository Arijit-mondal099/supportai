"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "How does SupportAI answer questions?",
    a: "It indexes your own docs, help center, and FAQs, then generates answers grounded in that content — so replies stay accurate and on-brand instead of generic guesses.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are live in minutes. Add your content, configure your bot's persona, and paste a single script tag on your site.",
  },
  {
    q: "Can I customize the bot's tone and branding?",
    a: "Yes. You control the bot's name, personality, communication tone, and appearance right from the dashboard.",
  },
  {
    q: "Which languages are supported?",
    a: "SupportAI understands and responds in dozens of languages automatically, based on the language of each customer's message.",
  },
  {
    q: "Is my data secure?",
    a: "Your content is used only to answer your customers. We follow industry-standard security practices and never train shared models on your data.",
  },
  {
    q: "What happens when the AI can't answer?",
    a: "You decide the fallback — hand off to a human, collect an email, or point the customer to a relevant help article.",
  },
];

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  const handleContact = (): void => {
    window.location.href = "/api/auth/login";
  };

  return (
    <section id="faq" className="scroll-mt-24 max-w-7xl mx-auto pb-32 px-4">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left: header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="lg:sticky lg:top-28 self-start"
        >
          <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
            <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              FAQ
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
              <ChevronRight className="w-4 h-4" />
            </span>
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.08] sm:leading-[1.05]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-500 leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Our team is happy to help.
          </p>
          <button
            onClick={handleContact}
            className="mt-6 inline-flex rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 cursor-pointer"
          >
            Contact support
          </button>
        </motion.div>

        {/* Right: accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border bg-gray-50 shadow transition-colors ${
                  isOpen ? "border-zinc-300" : "border-zinc-200"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-zinc-900">{f.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-500"
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-6 pb-5 text-zinc-500 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
