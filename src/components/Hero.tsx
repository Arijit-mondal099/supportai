"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const logos = [
  // Shield + wordmark
  <div key="l1" className="flex items-center gap-2">
    <svg viewBox="0 0 28 28" className="h-7 w-7" fill="currentColor">
      <path d="M14 2l9 3.2v6.6C23 18.4 19.2 23 14 25.5 8.8 23 5 18.4 5 11.8V5.2z" />
      <path
        d="M14 8.2l1.7 3.4 3.7.5-2.7 2.6.6 3.7L14 16.7l-3.3 1.7.6-3.7-2.7-2.6 3.7-.5z"
        fill="#f5f5f4"
      />
    </svg>
    <span className="text-xl font-bold tracking-tight">Logoipsum</span>
  </div>,
  // Dot cluster + wordmark
  <div key="l2" className="flex items-center gap-2">
    <svg viewBox="0 0 30 22" className="h-6 w-8" fill="currentColor">
      <circle cx="4" cy="4" r="3.4" />
      <circle cx="15" cy="4" r="3.4" />
      <circle cx="26" cy="4" r="3.4" />
      <circle cx="9.5" cy="14" r="3.4" />
      <circle cx="20.5" cy="14" r="3.4" />
    </svg>
    <span className="text-xl font-bold tracking-tight">logoipsum</span>
  </div>,
  // Droplet + wordmark
  <div key="l3" className="flex items-center gap-2">
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
      <path d="M12 2C7.5 7 4.5 11 4.5 15a7.5 7.5 0 0015 0c0-4-3-8-7.5-13z" />
    </svg>
    <span className="text-xl font-bold tracking-tight">logoipsum</span>
  </div>,
  // Boxed wordmark
  <div key="l4" className="flex items-center text-lg font-bold tracking-tight">
    <span className="rounded bg-zinc-300 px-2 py-0.5 text-white">LOGO</span>
    <span className="ml-1.5">IPSUM</span>
  </div>,
  // Outlined wordmark
  <div key="l5" className="flex items-center text-lg font-bold tracking-tight">
    <span>LOGO</span>
    <span className="ml-1.5 rounded border border-zinc-300 px-2 py-0.5">IPSUM</span>
  </div>,
];

const fadeMask = "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)";

export const Hero = ({ email }: { email: string | null }) => {
  const router = useRouter();

  const handleLogin = (): void => {
    window.location.href = "/api/auth/login";
  };

  const handleCta = (): void => {
    if (email) {
      router.push("/dashboard");
    } else {
      handleLogin();
    }
  };

  return (
    <section
      id="home"
      className="max-w-5xl mx-auto pt-28 sm:pt-40 pb-20 sm:pb-28 px-4 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
        className="flex w-full items-center"
      >
        <span className="h-px flex-1 bg-zinc-200" />

        <span className="flex shrink-0 items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            AI SUPPORT ASSISTANT
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>

        <span className="h-px flex-1 bg-zinc-200" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.05 }}
        className="mt-8 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-[1.08] sm:leading-[1.02] tracking-tight"
      >
        Your Customers Are Waiting
        <br />
        While You Search for Answers
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.12 }}
        className="mt-6 text-base sm:text-lg text-zinc-500 font-medium max-w-xl"
      >
        Ask anything— pricing, returns, troubleshooting, account help— and get the exact answers in
        seconds. Straight from your own docs.
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.2 }}
        className="mt-12 w-full max-w-2xl bg-zinc-900 rounded-3xl p-2.5 shadow-2xl text-left"
      >
        <p className="px-4 py-3 text-sm font-medium text-zinc-200">
          Set it. Answer it. Resolve it. AI-powered support for your team.
        </p>

        <div className="bg-gray-50 rounded-[20px] px-4 sm:px-6 pt-6 pb-5 flex flex-col gap-6 sm:gap-10">
          <p className="text-zinc-900 font-medium">AI Support Bot Generator</p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-1 items-center text-zinc-400 px-2 sm:px-0">
              <span className="truncate">Resolve billing questions from our help center…</span>
              <span className="ml-0.5 inline-block h-5 w-px bg-zinc-500 animate-pulse" />
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCta}
              className="shrink-0 bg-zinc-900 text-white font-medium text-sm px-5 py-3 rounded-xl cursor-pointer hover:bg-zinc-800 transition text-center"
            >
              Build my bot
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-24 w-full"
      >
        <p className="font-mono text-xs font-semibold tracking-widest text-zinc-500">
          TRUSTED BY LEADING COMPANIES
        </p>

        <div
          className="mt-10 w-full overflow-hidden"
          style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        >
          <motion.div
            className="flex w-max text-zinc-300"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} className="flex shrink-0 items-center justify-center mr-16">
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
