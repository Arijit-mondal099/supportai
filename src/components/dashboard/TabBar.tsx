"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const buildTabs = (botId: string) => [
  { label: "Overview", href: `/dashboard/bots/${botId}`, exact: true },
  { label: "Config", href: `/dashboard/bots/${botId}/config` },
  { label: "Knowledge", href: `/dashboard/bots/${botId}/knowledge` },
  { label: "Appearance", href: `/dashboard/bots/${botId}/appearance` },
  { label: "Embed", href: `/dashboard/bots/${botId}/embed` },
  { label: "Conversations", href: `/dashboard/bots/${botId}/conversations` },
];

export const TabBar = ({ botId }: { botId: string }) => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {buildTabs(botId).map((t) => {
        const active = t.exact
          ? pathname === t.href
          : pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
              active
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
};
