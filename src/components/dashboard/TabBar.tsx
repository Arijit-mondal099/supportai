"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Code2,
  Database,
  FlaskConical,
  LayoutDashboard,
  MessagesSquare,
  Palette,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const buildTabs = (botId: string) => [
  { label: "Overview", href: `/dashboard/bots/${botId}`, exact: true, icon: LayoutDashboard },
  { label: "Playground", href: `/dashboard/bots/${botId}/playground`, icon: FlaskConical },
  { label: "Config", href: `/dashboard/bots/${botId}/config`, icon: Settings2 },
  { label: "Knowledge", href: `/dashboard/bots/${botId}/knowledge`, icon: Database },
  { label: "Appearance", href: `/dashboard/bots/${botId}/appearance`, icon: Palette },
  { label: "Embed", href: `/dashboard/bots/${botId}/embed`, icon: Code2 },
  { label: "Conversations", href: `/dashboard/bots/${botId}/conversations`, icon: MessagesSquare },
];

export const TabBar = ({ botId }: { botId: string }) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Agent sections"
      className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto overflow-y-hidden px-1 py-1"
    >
      {buildTabs(botId).map((t) => {
        const Icon = t.icon;
        const active = t.exact
          ? pathname === t.href
          : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-active-pill"
                aria-hidden
                className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm"
                transition={{ type: "spring", bounce: 0.22, duration: 0.45 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon
                className={cn("h-4 w-4", active ? "text-foreground" : "text-muted-foreground/70")}
                aria-hidden
              />
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
