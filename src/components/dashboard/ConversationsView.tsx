"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useConversations, useConversationThread } from "@/hooks/use-conversations";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const ConversationsView = ({ botId }: { botId: string }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: conversations, isLoading } = useConversations(botId);
  const { data: messages, isLoading: threadLoading } = useConversationThread(botId, selected);

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
          ))}
        </div>
        <Card className="min-h-80">
          <CardContent className="py-5">
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-14 text-center">
          <MessageSquare className="mx-auto mb-3 text-muted-foreground/50" size={28} />
          <p className="text-sm text-muted-foreground">
            No conversations yet. Once visitors chat with this agent, they appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        className="space-y-2"
      >
        {conversations.map((c) => (
          <motion.div
            key={c._id}
            variants={{
              hidden: { opacity: 0, x: -12 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
          >
            <button
              onClick={() => setSelected(c._id)}
              className={cn(
                "w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition",
                selected === c._id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-muted-foreground/30",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs opacity-70">
                  {c.sessionId.slice(0, 14)}
                </span>
                <span className="shrink-0 text-[11px] opacity-70">{c.messageCount} msgs</span>
              </div>
              <p className="mt-1 text-[11px] opacity-60">{formatDate(c.lastMessageAt)}</p>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <Card className="min-h-80">
        <CardContent className="py-5">
          {!selected ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a conversation to read the transcript.
            </p>
          ) : threadLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-2/3 rounded-2xl" />
              <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
              <Skeleton className="h-16 w-3/4 rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {messages?.map((m) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
