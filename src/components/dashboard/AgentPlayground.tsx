"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, RotateCcw, Send } from "lucide-react";
import { apiClient } from "@/lib/axios";
import type { SerializedBot } from "@/lib/chatbots";
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const providerLabel = PROVIDERS.find((p) => p.value === bot.provider)?.label ?? bot.provider;
  const modelLabel = MODELS[bot.provider]?.find((m) => m.value === bot.model)?.label || "Default";
  const accent = bot.appearance.accentColor || "#1b1a17";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const reset = () => {
    setMessages([welcome]);
    setError("");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError("");
    const history = messages.slice(1).map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);
    try {
      const { data } = await apiClient.post("/api/chat", {
        botId: bot._id,
        prompt: text,
        preview: true,
        history,
      });
      if (data.success) {
        setMessages((prev) => [...prev, { role: "model", text: data.data.text }]);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Request failed.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  const keyMissing = error.toLowerCase().includes("api key");

  return (
    <Card className="flex h-[32rem] flex-col gap-0 overflow-hidden py-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
            style={{ background: accent }}
          >
            <Bot size={15} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Playground</p>
            <p className="text-[11px] text-muted-foreground">
              {providerLabel} · {modelLabel}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} disabled={sending}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
              m.role === "user"
                ? "ml-auto rounded-br-sm text-white"
                : "rounded-bl-sm bg-muted text-foreground",
            )}
            style={m.role === "user" ? { background: accent } : undefined}
          >
            {m.text}
          </div>
        ))}

        {sending && (
          <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
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
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border px-3 py-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Send a message to test your agent…"
          disabled={sending}
        />
        <Button onClick={send} disabled={sending || !input.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
