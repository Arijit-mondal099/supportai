"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Bot, Check, Code2, Copy, Eye, FileCode2, Rocket } from "lucide-react";
import { ENV } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ease = { type: "spring", bounce: 0.22, duration: 0.5 } as const;

export const Embed = ({ botId }: { botId: string }) => {
  const script = `<script\n  src="${ENV.API_URI}/chat_bot.js"\n  data-bot-id="${botId}"\n></script>`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      toast.success("Snippet copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // A genuine sequence — copy, paste, deploy, see — so numbered markers
  // earn their place here.
  const steps = [
    {
      n: "01",
      title: "Copy the snippet",
      desc: "Grab this agent's personalised script tag.",
      Icon: Copy,
    },
    {
      n: "02",
      title: "Paste before </body>",
      desc: "Add it just before the closing body tag.",
      Icon: FileCode2,
    },
    {
      n: "03",
      title: "Save & deploy",
      desc: "Upload to your server or redeploy your site.",
      Icon: Rocket,
    },
    {
      n: "04",
      title: "See it live",
      desc: "The chat widget appears in the bottom-right.",
      Icon: Eye,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Snippet */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={ease}>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
              <Code2 className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-lg">Embed this agent</CardTitle>
              <CardDescription>
                One script tag. Zero dependencies. Live on any website.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-hidden rounded-xl bg-[#1b1a17] shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
                <span className="flex items-center gap-2 font-mono text-xs text-[#948f82]">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  </span>
                  index.html
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copy}
                  className="text-[#f7f5ef] hover:bg-white/10 hover:text-[#f7f5ef]"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.9]">
                <code>
                  <span className="text-[#948f82]">&lt;script</span>
                  {"\n  "}
                  <span className="text-[#e8440a]">src</span>
                  <span className="text-[#948f82]">=</span>
                  <span className="text-[#f7f5ef]">&quot;{ENV.API_URI}/chat_bot.js&quot;</span>
                  {"\n  "}
                  <span className="text-[#e8440a]">data-bot-id</span>
                  <span className="text-[#948f82]">=</span>
                  <span className="text-[#f7f5ef]">&quot;{botId}&quot;</span>
                  {"\n"}
                  <span className="text-[#948f82]">&gt;&lt;/script&gt;</span>
                </code>
              </pre>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Place it just before your closing{" "}
              <code className="font-mono text-xs">&lt;/body&gt;</code> tag.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((s) => (
          <motion.div
            key={s.n}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={ease}
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                  <s.Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="font-title text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">
                  STEP {s.n}
                </p>
                <h4 className="text-sm font-semibold">{s.title}</h4>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
                <Eye className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <CardTitle className="text-lg">Live preview</CardTitle>
                <CardDescription>How the widget sits on your site</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-pinstripe relative overflow-hidden rounded-xl border border-border">
              {/* Mock website */}
              <div aria-hidden className="space-y-3 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 rounded-full bg-zinc-300" />
                  <div className="flex gap-2">
                    <div className="h-3 w-10 rounded-full bg-zinc-200" />
                    <div className="h-3 w-10 rounded-full bg-zinc-200" />
                    <div className="h-3 w-10 rounded-full bg-zinc-200" />
                  </div>
                </div>
                <div className="h-5 w-2/3 rounded-md bg-zinc-300" />
                <div className="h-5 w-1/2 rounded-md bg-zinc-300" />
                <div className="space-y-2 pt-1">
                  <div className="h-2.5 w-full rounded-full bg-zinc-200" />
                  <div className="h-2.5 w-11/12 rounded-full bg-zinc-200" />
                  <div className="h-2.5 w-3/4 rounded-full bg-zinc-200" />
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="h-7 w-24 rounded-lg bg-zinc-800" />
                  <div className="h-7 w-24 rounded-lg border border-zinc-300" />
                </div>
              </div>
              {/* Widget button */}
              <div className="absolute right-5 bottom-5">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 motion-reduce:animate-none" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Bot className="h-5 w-5" aria-hidden />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
