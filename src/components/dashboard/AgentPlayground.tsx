"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowUp, Bot, RotateCcw } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useSendMessage } from "@/hooks/use-chat";
import { MODELS, PROVIDERS } from "@/lib/options";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "model";
  text: string;
}

export const AgentPlayground = ({ bot }: { bot: SerializedBot }) => {
  const welcome: Msg = { role: "model", text: bot.appearance.welcomeMessage || "Hello!" };
  const [messages, setMessages] = useState<Msg[]>([welcome]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const sendMutation = useSendMessage();

  const providerLabel = PROVIDERS.find((p) => p.value === bot.provider)?.label ?? bot.provider;
  const modelLabel = MODELS[bot.provider]?.find((m) => m.value === bot.model)?.label || "Default";
  const accent = bot.appearance.accentColor || "#1b1a17";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMutation.isPending]);

  const reset = () => {
    setMessages([welcome]);
    setError("");
  };

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || sendMutation.isPending) return;
    setError("");
    const history = messages.slice(1).map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    try {
      const data = await sendMutation.mutateAsync({
        botId: bot._id,
        prompt: text,
        preview: true,
        history,
      });
      if (data.success && data.data) {
        const reply = data.data.text;
        setMessages((prev) => [...prev, { role: "model", text: reply }]);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Request failed.");
    }
  };

  const keyMissing = error.toLowerCase().includes("api key");
  const isLive = bot.status === "live";
  const suggestions = bot.appearance.prompts ?? [];
  const showSuggestions = messages.length <= 1 && !sendMutation.isPending && !error;

  return (
    <Card className="flex h-[32rem] flex-col gap-0 overflow-hidden py-0 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: accent }}
            >
              <Bot size={16} aria-hidden />
            </span>
            <span
              title={isLive ? "Live" : "Draft"}
              aria-hidden
              className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card ${isLive ? "bg-emerald-500" : "bg-zinc-400"}`}
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">
              {bot.appearance.displayName || "Playground"}
            </p>
            <p className="truncate text-xs text-muted-foreground tabular-nums">
              {providerLabel} · {modelLabel}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={sendMutation.isPending}
          className="shrink-0 text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <motion.div
                  key={`${i}-${m.text.slice(0, 20)}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm break-words whitespace-pre-wrap text-white shadow-sm"
                  style={{ background: accent }}
                >
                  {m.text}
                </motion.div>
              ) : (
                <motion.div
                  key={`${i}-${m.text.slice(0, 20)}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  className="flex items-end gap-2"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ background: accent }}
                    aria-hidden
                  >
                    <Bot size={13} />
                  </span>
                  <span className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2.5 text-sm break-words whitespace-pre-wrap text-foreground shadow-sm">
                    {m.text}
                  </span>
                </motion.div>
              ),
            )}
          </AnimatePresence>
        </div>

        {sendMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3 shadow-sm"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.15 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              {error}
              {keyMissing && (
                <>
                  {" "}
                  <Link
                    href={`/dashboard/bots/${bot._id}/config`}
                    className="font-medium underline"
                  >
                    Add a key
                  </Link>
                  .
                </>
              )}
            </span>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Suggestion chips from the agent's own starter prompts */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-t border-border px-4 pt-3 pb-3 no-scrollbar">
          {suggestions.slice(0, 4).map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              onClick={() => void send(p.prompt)}
              className="shrink-0 rounded-full"
            >
              {p.label}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className={cn(
          "px-4 pb-4",
          !(showSuggestions && suggestions.length > 0) && "border-t border-border pt-4",
        )}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 py-2 pr-2 pl-5 transition focus-within:border-muted-foreground/30">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Send a message to test your agent…"
            disabled={sendMutation.isPending}
            aria-label="Test message"
            className="h-12 border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
          />
          <motion.div whileTap={{ scale: 0.92 }} className="shrink-0">
            <Button
              onClick={() => void send()}
              disabled={sendMutation.isPending || !input.trim()}
              size="icon"
              style={{ background: "#c96442" }}
              className="h-11 w-11 rounded-xl text-white shadow-sm hover:brightness-95"
              aria-label="Send message"
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2.4} aria-hidden />
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};
