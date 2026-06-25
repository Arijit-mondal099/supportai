"use client";

import Link from "next/link";
import { Activity, Bot, ChevronRight, MessageSquare, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import type { AccountAnalytics } from "@/lib/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

export const OverviewContent = ({ analytics }: { analytics: AccountAnalytics }) => {
  const { totals, daily, topAgents, recent } = analytics;
  const stats = [
    { label: "Agents", value: totals.agents, icon: Bot },
    { label: "Live", value: totals.liveAgents, icon: Activity },
    { label: "Conversations", value: totals.conversations, icon: Users },
    { label: "Messages", value: totals.messages, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm mb-3">
            <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              DASHBOARD
            </span>
            <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
              <ChevronRight className="w-4 h-4" />
            </span>
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Activity across all your agents.</p>
        </div>
        <Button render={<Link href="/dashboard/agents/new" />} nativeButton={false}>
          <Plus className="h-4 w-4" /> New agent
        </Button>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            >
              <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">
                    {s.value.toLocaleString("en-US")}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart + Top agents */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.25 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <Card className="lg:col-span-2 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Last 14 days across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart data={daily} />
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Top agents</CardTitle>
            <CardDescription>By messages handled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAgents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              topAgents.map((a) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/dashboard/bots/${a._id}`}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {a.name}
                    </Link>
                    <span className="shrink-0 text-sm text-muted-foreground">{a.messages}</span>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent conversations */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.35 }}
      >
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent conversations</CardTitle>
            <CardDescription>Latest sessions across your agents</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead className="text-right">Last active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.botName}</TableCell>
                      <TableCell>{c.messageCount}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDate(c.lastMessageAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
