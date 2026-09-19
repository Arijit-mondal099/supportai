"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Inbox, MessagesSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useConversations, useConversationThread } from "@/hooks/use-conversations";

const pulse = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
  },
};

const SkeletonPulse = ({ className }: { className?: string }) => (
  <motion.div {...pulse}>
    <Skeleton className={className} />
  </motion.div>
);

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" }) : "";

const shortId = (sessionId: string) =>
  sessionId.length > 14 ? `${sessionId.slice(0, 14)}…` : sessionId;

const ease = { type: "spring", bounce: 0.22, duration: 0.4 } as const;

export const ConversationsView = ({ botId }: { botId: string }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: conversations, isLoading } = useConversations(botId);
  // Open the latest session right away so the transcript is never blank.
  const effective = selected ?? conversations?.[0]?._id ?? null;
  const { data: messages, isLoading: threadLoading } = useConversationThread(botId, effective);

  const active = conversations?.find((c) => c._id === effective) ?? null;

  if (isLoading) {
    return (
      <div className="grid items-start gap-4 lg:grid-cols-[20rem_1fr]" aria-hidden>
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <SkeletonPulse className="h-3 w-20" />
            <SkeletonPulse className="h-5 w-10 rounded-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <SkeletonPulse className="h-3.5 w-24" />
                  <SkeletonPulse className="h-5 w-12 rounded-full" />
                </div>
                <SkeletonPulse className="mt-2 h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
        <Card className="min-h-80 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
            <SkeletonPulse className="h-4 w-40" />
            <SkeletonPulse className="h-4 w-16" />
          </div>
          <CardContent className="space-y-3 py-5">
            <SkeletonPulse className="h-12 w-2/3 rounded-2xl rounded-bl-sm" />
            <SkeletonPulse className="ml-auto h-10 w-1/2 rounded-2xl rounded-br-sm" />
            <SkeletonPulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card className="border-dashed bg-transparent">
        <CardContent className="flex flex-col items-center px-4 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-medium">No conversations yet</p>
          <p className="mt-1 max-w-[36ch] text-[13px] text-muted-foreground">
            Once visitors chat with this agent, sessions appear here with full transcripts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[20rem_1fr]">
      {/* Session list */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-title text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Sessions
          </span>
          <Badge variant="secondary" className="tabular-nums">
            {conversations.length}
          </Badge>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="max-h-[32rem] space-y-2 overflow-y-auto pr-0.5"
          role="listbox"
          aria-label="Conversations"
          aria-activedescendant={effective ?? undefined}
        >
          {conversations.map((c) => {
            const isActive = effective === c._id;
            return (
              <motion.div
                key={c._id}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={ease}
              >
                <button
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setSelected(c._id)}
                  className={cn(
                    "relative w-full cursor-pointer overflow-hidden rounded-xl border bg-card px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    isActive
                      ? "border-primary/60 shadow-sm ring-1 ring-primary/30"
                      : "border-border hover:border-muted-foreground/30 hover:shadow-sm",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="session-indicator"
                      aria-hidden
                      className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary"
                      transition={ease}
                    />
                  )}
                  <div className="flex items-center justify-between gap-2 pl-1.5">
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {shortId(c.sessionId)}
                    </span>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                      {c.messageCount} {c.messageCount === 1 ? "msg" : "msgs"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 truncate pl-1.5 text-xs text-muted-foreground tabular-nums">
                    {formatDate(c.lastMessageAt)}
                  </p>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Transcript */}
      <Card className="min-h-80 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <p className="truncate text-sm font-medium">
            {active ? (
              <>
                Session <span className="font-mono text-[13px]">{shortId(active.sessionId)}</span>
              </>
            ) : (
              "Transcript"
            )}
          </p>
          {active && (
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {active.messageCount} {active.messageCount === 1 ? "message" : "messages"}
            </span>
          )}
        </div>
        <CardContent className="py-5">
          {!effective ? (
            <p className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground">
              <MessagesSquare className="h-4 w-4" aria-hidden />
              Select a session to read the transcript.
            </p>
          ) : threadLoading ? (
            <div className="space-y-4" aria-hidden>
              <div>
                <SkeletonPulse className="h-12 w-2/3 rounded-2xl rounded-bl-sm" />
                <SkeletonPulse className="mt-1 h-3 w-16" />
              </div>
              <div>
                <SkeletonPulse className="ml-auto h-10 w-1/2 rounded-2xl rounded-br-sm" />
                <SkeletonPulse className="mt-1 ml-auto h-3 w-16" />
              </div>
              <div>
                <SkeletonPulse className="h-16 w-3/4 rounded-2xl rounded-bl-sm" />
                <SkeletonPulse className="mt-1 h-3 w-16" />
              </div>
            </div>
          ) : !messages || messages.length === 0 ? (
            <p className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">
              No messages in this session.
            </p>
          ) : (
            <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
              {messages.map((m) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={ease}
                  className={cn("max-w-[85%]", m.role === "user" && "ml-auto")}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm break-words whitespace-pre-wrap shadow-sm",
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm border border-border bg-card text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                  {m.createdAt && (
                    <p
                      className={cn(
                        "mt-1 text-[11px] text-muted-foreground tabular-nums",
                        m.role === "user" ? "text-right" : "text-left",
                      )}
                    >
                      {formatTime(m.createdAt)}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
