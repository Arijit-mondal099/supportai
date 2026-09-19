"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, Bot, MoreVertical, Plus, Settings2, Trash2 } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBot } from "@/hooks/use-bots";

const PROVIDER_LABEL: Record<string, string> = { gemini: "Gemini", openai: "OpenAI" };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const editedLabel = (iso: string | null) =>
  iso
    ? `Edited ${new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric" })}`
    : "Not edited yet";

const ease = { type: "spring", bounce: 0.22, duration: 0.55 } as const;

const NewAgentButton = () => (
  <Button render={<Link href="/dashboard/agents/new" />} nativeButton={false}>
    <Plus className="h-4 w-4" /> New agent
  </Button>
);

export function AgentsGrid({ bots }: { bots: SerializedBot[] }) {
  const router = useRouter();
  const [items, setItems] = useState(bots);
  const [pending, setPending] = useState<SerializedBot | null>(null);
  const deleteMutation = useDeleteBot();

  const live = items.filter((b) => b.status === "live").length;

  const confirmDelete = async () => {
    if (!pending) return;
    try {
      await deleteMutation.mutateAsync(pending._id);
      setItems((prev) => prev.filter((b) => b._id !== pending._id));
      setPending(null);
      router.refresh();
    } catch {
      console.log("Failed to delete bot");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">Agents</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {items.length === 0
              ? "Create and manage your AI support agents."
              : `${items.length} ${items.length === 1 ? "agent" : "agents"} · ${live} live`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <NewAgentButton />
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ease}
        >
          <Card className="bg-pinstripe relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-card/88" aria-hidden />
            <CardContent className="relative px-6 py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <Bot className="h-7 w-7" aria-hidden />
              </div>
              <h2 className="mx-auto mt-5 max-w-md text-2xl font-bold tracking-tight text-balance">
                No agents yet
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Create your first agent to start answering customers around the clock.
              </p>
              <div className="mt-6 flex justify-center">
                <NewAgentButton />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((b) => {
            const isLive = b.status === "live";
            return (
              <motion.div
                key={b._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={ease}
                className="h-full"
              >
                <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="relative shrink-0">
                        <Avatar className="size-11 rounded-xl">
                          <AvatarFallback className="rounded-xl bg-secondary font-title text-sm font-bold">
                            <span className="inline-block scale-[0.85] leading-none">
                              {initials(b.name)}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        <span
                          title={isLive ? "Live" : "Draft"}
                          aria-hidden
                          className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-card ${isLive ? "bg-emerald-500" : "bg-zinc-400"}`}
                        />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">
                          <Link
                            href={`/dashboard/bots/${b._id}`}
                            className="transition-colors group-hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          >
                            {b.name}
                          </Link>
                        </CardTitle>
                        <p className="truncate text-[13px] text-muted-foreground">
                          {b.businessInfo.businessName ||
                            b.businessInfo.industry ||
                            b.botInfo.botName ||
                            "Untitled"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground"
                            aria-label={`Options for ${b.name}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link href={`/dashboard/bots/${b._id}`} />}>
                          <Settings2 className="mr-2 h-4 w-4" /> Manage
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPending(b)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <Badge variant="secondary" className="font-normal">
                      {PROVIDER_LABEL[b.provider] ?? b.provider}
                    </Badge>
                    <span className="truncate text-[13px] text-muted-foreground">
                      {b.model || "Default model"}
                    </span>
                    <span className="text-[13px] text-muted-foreground tabular-nums">
                      · {editedLabel(b.updatedAt)}
                    </span>
                  </CardContent>
                  <CardFooter className="mt-auto flex items-center justify-between gap-2">
                    <Badge variant={isLive ? "default" : "secondary"}>
                      {isLive ? "Live" : "Draft"}
                    </Badge>
                    <Button
                      render={<Link href={`/dashboard/bots/${b._id}`} />}
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                    >
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pending?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the agent, its knowledge base, and all conversations. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
