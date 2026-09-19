"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Inbox,
  MessagesSquare,
  Plus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { AccountAnalytics } from "@/lib/analytics";
import type { ActivityPoint, ActivityRange } from "@/lib/activity-ranges";
import { ACTIVITY_RANGE_OPTIONS } from "@/lib/activity-ranges";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ease = { type: "spring", bounce: 0.22, duration: 0.55 } as const;

const RANGE_META: Record<
  ActivityRange,
  { description: string; span: string; average: string; peak: string }
> = {
  today: {
    description: "Hour by hour · today (UTC)",
    span: "today",
    average: "Hourly average",
    peak: "Peak hour",
  },
  "7d": {
    description: "Last 7 days across all agents",
    span: "in last 7 days",
    average: "Daily average",
    peak: "Peak day",
  },
  "14d": {
    description: "Last 14 days across all agents",
    span: "in last 14 days",
    average: "Daily average",
    peak: "Peak day",
  },
  "12m": {
    description: "Last 12 months across all agents",
    span: "in last 12 months",
    average: "Monthly average",
    peak: "Peak month",
  },
  yearly: {
    description: "All time across all agents · by year",
    span: "all time",
    average: "Yearly average",
    peak: "Peak year",
  },
};

export const OverviewContent = ({ analytics }: { analytics: AccountAnalytics }) => {
  const { totals, daily, topAgents, recent } = analytics;
  const [range, setRange] = useState<ActivityRange>("14d");
  const [points, setPoints] = useState<ActivityPoint[]>(daily);
  const [loadingRange, setLoadingRange] = useState(false);
  const meta = RANGE_META[range];

  const handleRangeChange = async (next: ActivityRange) => {
    if (next === range || loadingRange) return;
    setRange(next);
    setLoadingRange(true);
    try {
      const res = await fetch(`/api/analytics?range=${next}`);
      const body = await res.json();
      if (body?.success && Array.isArray(body.data?.points)) {
        setPoints(body.data.points as ActivityPoint[]);
      }
    } catch {
      // Keep the previous points on failure — the chart never blanks out.
    } finally {
      setLoadingRange(false);
    }
  };

  const periodTotal = points.reduce((sum, d) => sum + d.messages, 0);
  const peak = points.reduce(
    (best, d) => (d.messages > best.messages ? d : best),
    points[0] ?? { label: "—", messages: 0 },
  );
  const periodAvg = points.length ? Math.round(periodTotal / points.length) : 0;
  const drafts = Math.max(totals.agents - totals.liveAgents, 0);
  const livePct = totals.agents ? Math.round((totals.liveAgents / totals.agents) * 100) : 0;
  const maxTop = Math.max(...topAgents.map((a) => a.messages), 1);

  const stats = [
    {
      label: "Agents",
      value: totals.agents,
      caption: `${totals.liveAgents} live · ${drafts} draft`,
      icon: Bot,
      meter: totals.agents ? livePct : 0,
      meterClass: "bg-primary",
    },
    {
      label: "Live now",
      value: totals.liveAgents,
      caption: totals.agents ? `${livePct}% of fleet online` : "No agents yet",
      icon: Activity,
      meter: livePct,
      meterClass: "bg-emerald-500",
      pulse: totals.liveAgents > 0,
    },
    {
      label: "Conversations",
      value: totals.conversations,
      caption: "Sessions handled to date",
      icon: Users,
      meter: totals.conversations ? 100 : 0,
      meterClass: "bg-primary",
    },
    {
      label: "Messages",
      value: totals.messages,
      caption: `${periodTotal.toLocaleString("en-US")} ${meta.span}`,
      icon: MessagesSquare,
      meter: totals.messages ? 100 : 0,
      meterClass: "bg-primary",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* Command header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">Overview</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Every agent, every conversation — one glance. Pick up where your customers left off.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" render={<Link href="/dashboard/agents" />} nativeButton={false}>
            View agents
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button render={<Link href="/dashboard/agents/new" />} nativeButton={false}>
            <Plus className="h-4 w-4" /> New agent
          </Button>
        </div>
      </motion.div>

      {/* Counter strip */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={ease}
            >
              <Card className="bg-pinstripe group relative overflow-hidden transition-shadow hover:shadow-md">
                <div className="absolute inset-0 bg-card/85" aria-hidden />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-1">
                  <span className="font-title text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                    {s.label}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-transform group-hover:-translate-y-0.5">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-4xl font-bold tracking-tight tabular-nums">
                      {s.value.toLocaleString("en-US")}
                    </span>
                    {"pulse" in s && s.pulse ? (
                      <span className="mb-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-[13px] text-muted-foreground">{s.caption}</p>
                  <div
                    className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"
                    role="presentation"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.meter}%` }}
                      transition={{ ...ease, delay: 0.3 }}
                      className={`h-full rounded-full ${s.meterClass}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity ledger + agent rail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.2 }}
        className="grid items-start gap-4 lg:grid-cols-5"
      >
        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Message activity</CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </div>
            <CardAction>
              <Select
                value={range}
                onValueChange={(v) => void handleRangeChange(v as ActivityRange)}
                disabled={loadingRange}
              >
                <SelectTrigger size="sm" className="w-[136px]" aria-label="Time range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_RANGE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className={loadingRange ? "opacity-50 transition-opacity" : undefined}>
              <OverviewChart key={range} data={points} />
            </div>
            <Separator className="my-4" />
            <dl className="grid grid-cols-3 gap-2 text-center sm:text-left">
              {[
                { k: "Period total", v: periodTotal.toLocaleString("en-US") },
                { k: meta.average, v: periodAvg.toLocaleString("en-US") },
                { k: meta.peak, v: `${peak.label} · ${peak.messages}` },
              ].map((f) => (
                <div key={f.k} className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                  <dt className="font-title text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {f.k}
                  </dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums">{f.v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Top agents</CardTitle>
              <CardDescription>Ranked by messages handled</CardDescription>
            </div>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/dashboard/agents" />}
                nativeButton={false}
                className="text-muted-foreground"
              >
                All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {topAgents.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                  <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-medium">No activity yet</p>
                <p className="mt-1 max-w-[26ch] text-[13px] text-muted-foreground">
                  Messages your agents handle will rank them here.
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {topAgents.map((a, i) => (
                  <li key={a._id}>
                    <Link
                      href={`/dashboard/bots/${a._id}`}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Avatar size="sm" className="shrink-0">
                        <AvatarFallback className="overflow-hidden rounded-full bg-secondary p-1 text-center font-title text-[10px] leading-none font-bold text-foreground">
                          <span className="inline-block scale-[0.82] leading-none">
                            {initials(a.name)}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium group-hover:underline">
                            {a.name}
                          </span>
                          <Badge
                            variant={a.status === "live" ? "default" : "secondary"}
                            className="shrink-0"
                          >
                            {a.status === "live" ? "Live" : "Draft"}
                          </Badge>
                        </span>
                        <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-secondary">
                          <span
                            className={`block h-full rounded-full ${i === 0 ? "bg-[#e8440a]" : "bg-primary/70"}`}
                            style={{ width: `${Math.max((a.messages / maxTop) * 100, 6)}%` }}
                          />
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">
                        {a.messages.toLocaleString("en-US")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent conversations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.32 }}
      >
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Recent conversations</CardTitle>
              <CardDescription>Latest sessions across your agents</CardDescription>
            </div>
            <CardAction>
              <Badge variant="outline" className="tabular-nums">
                {recent.length} shown
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                  <MessagesSquare className="h-5 w-5 text-muted-foreground" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-medium">No conversations yet</p>
                <p className="mt-1 max-w-[32ch] text-[13px] text-muted-foreground">
                  Embed an agent on your site and new sessions will appear here in real time.
                </p>
                <Button
                  size="sm"
                  render={<Link href="/dashboard/agents/new" />}
                  nativeButton={false}
                  className="mt-4"
                >
                  <Plus className="h-3.5 w-3.5" /> New agent
                </Button>
              </div>
            ) : (
              <div className="-mx-2 overflow-x-auto px-2">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-title text-[11px] tracking-[0.12em] uppercase">
                        Agent
                      </TableHead>
                      <TableHead className="font-title text-[11px] tracking-[0.12em] uppercase">
                        Messages
                      </TableHead>
                      <TableHead className="text-right font-title text-[11px] tracking-[0.12em] uppercase">
                        Last active
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((c) => (
                      <TableRow key={c._id} className="hover:bg-muted/50">
                        <TableCell>
                          <span className="flex items-center gap-3.5 py-0.5">
                            <Avatar size="sm" className="">
                              <AvatarFallback className="overflow-hidden rounded-full bg-secondary p-1 text-center font-title text-[10px] leading-none font-bold">
                                <span className="inline-block scale-[0.82] leading-none">
                                  {initials(c.botName)}
                                </span>
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium">{c.botName}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="tabular-nums">
                            {c.messageCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap text-muted-foreground tabular-nums">
                          {formatDate(c.lastMessageAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
