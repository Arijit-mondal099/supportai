"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const buildTabs = (botId: string) => [
  { label: "Overview", href: `/dashboard/bots/${botId}`, exact: true },
  { label: "Playground", href: `/dashboard/bots/${botId}/playground` },
  { label: "Config", href: `/dashboard/bots/${botId}/config` },
  { label: "Knowledge", href: `/dashboard/bots/${botId}/knowledge` },
  { label: "Appearance", href: `/dashboard/bots/${botId}/appearance` },
  { label: "Embed", href: `/dashboard/bots/${botId}/embed` },
  { label: "Conversations", href: `/dashboard/bots/${botId}/conversations` },
];

export const TabBar = ({ botId }: { botId: string }) => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {buildTabs(botId).map((t) => {
        const active = t.exact
          ? pathname === t.href
          : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
