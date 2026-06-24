"use client";

import { ArrowRight, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "PLATFORM", href: "#platform" },
  { label: "USE CASES", href: "#use-cases" },
  { label: "RESOURCES", href: "#resources" },
  { label: "PRICING", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = ({ email }: { email: string | null | undefined }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = (): void => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = (): void => {
    window.location.href = "/api/auth/logout";
  };

  const handleNavClick = (e: ReactMouseEvent<HTMLAnchorElement>, href: string): void => {
    if (!href.startsWith("#")) return;
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();

    const scrollToEl = () => {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", href);
    };

    // On mobile, close the menu first and scroll once its close animation is
    // done — otherwise the re-render interrupts the smooth scroll.
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      window.setTimeout(scrollToEl, 300);
    } else {
      scrollToEl();
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      className="fixed z-50 top-0 left-0 w-full bg-[#ece9e1] border-b border-zinc-500/50"
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 border-r border-l border-zinc-500/50">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/" aria-label="SupportAI home" className="shrink-0">
            <span className="flex items-center gap-2">
              <img src="/favicon.png" alt="" className="h-8 w-8" />
              <span className="font-title text-lg font-bold tracking-tight text-zinc-900">
                Support<span className="text-zinc-400">AI</span>
              </span>
            </span>
          </Link>

          <ul className="hidden min-[960px]:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center gap-1 font-mono text-sm tracking-tight text-zinc-800 hover:text-zinc-950 transition"
                >
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {email ? (
            pathname === "/dashboard" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden min-[960px]:inline-flex bg-gray-50 text-zinc-900 font-mono text-xs tracking-tight px-4 py-2.5 rounded-full border border-zinc-200 shadow-sm cursor-pointer"
                onClick={() => router.push("/dashboard/embed")}
              >
                Embed Chatbot
              </motion.button>
            ) : pathname === "/dashboard/embed" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden min-[960px]:inline-flex bg-gray-50 text-zinc-900 font-mono text-xs tracking-tight px-4 py-2.5 rounded-full border border-zinc-200 shadow-sm cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                View Dashboard
              </motion.button>
            ) : (
              <div className="relative hidden min-[960px]:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                  ref={popupRef}
                >
                  <p className="text-white text-sm font-semibold uppercase">{email?.at(0)}</p>
                </motion.div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
                      className="absolute -bottom-24 right-0 z-50 w-44 bg-gray-50 rounded-lg border border-gray-200 shadow flex flex-col overflow-hidden"
                    >
                      <Link
                        href={"/dashboard"}
                        className="text-left text-sm font-medium cursor-pointer p-3"
                      >
                        Dashboard
                      </Link>

                      <button
                        className="text-left text-sm font-medium text-red-500 cursor-pointer p-3 border-t border-gray-200 flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <span>Logout</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hidden min-[960px]:inline-flex bg-zinc-100 text-zinc-900 font-mono text-sm tracking-tight px-5 py-3 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-200 transition"
                onClick={handleLogin}
              >
                Book a Demo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hidden min-[960px]:inline-flex items-center gap-2 bg-zinc-900 text-white font-mono text-sm tracking-tight px-5 py-3 rounded-xl cursor-pointer hover:bg-zinc-800 transition"
                onClick={handleLogin}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="max-[959px]:flex min-[960px]:hidden items-center justify-center h-9 w-9 rounded-lg border border-zinc-200 bg-gray-50 text-zinc-700 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-zinc-500/50 bg-[#ece9e1] max-[959px]:block min-[960px]:hidden"
          >
            <div className="px-4 sm:px-6 pb-6 pt-2 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-mono text-sm tracking-tight text-zinc-800 hover:text-zinc-950 transition px-3 py-2.5 rounded-xl hover:bg-zinc-200/50"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 border-t border-zinc-200 pt-4 flex flex-col gap-3">
                {email ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-mono text-sm tracking-tight text-zinc-800 px-3 py-2.5 rounded-xl hover:bg-zinc-200/50"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="font-mono text-sm tracking-tight text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      className="bg-zinc-100 text-zinc-900 font-mono text-sm tracking-tight px-5 py-3 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-200 transition text-left"
                    >
                      Book a Demo
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      className="bg-zinc-900 text-white font-mono text-sm tracking-tight px-5 py-3 rounded-xl cursor-pointer hover:bg-zinc-800 transition flex items-center gap-2 justify-center"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
