"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Loader2, Save, Send } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useUpdateBot } from "@/hooks/use-bots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const AppearanceForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const updateMutation = useUpdateBot(bot._id);

  const [accentColor, setAccentColor] = useState(bot.appearance.accentColor);
  const [avatarUrl, setAvatarUrl] = useState(bot.appearance.avatarUrl);
  const [displayName, setDisplayName] = useState(bot.appearance.displayName);
  const [welcomeMessage, setWelcomeMessage] = useState(bot.appearance.welcomeMessage);

  const save = async () => {
    try {
      await updateMutation.mutateAsync({
        appearance: { accentColor, avatarUrl, displayName, welcomeMessage },
      });
      toast.success("Appearance saved");
      router.refresh();
    } catch {
      toast.error("Could not save.");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the chat widget looks on your site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="accent">Accent color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="accent"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-border bg-background p-1"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-32 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Support Agent"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">Avatar image URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…/avatar.png"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="welcome">Welcome message</Label>
              <Textarea
                id="welcome"
                rows={3}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Hello! How can I assist you today?"
              />
            </div>
            <div className="flex justify-end border-t border-border pt-4">
              <Button onClick={save} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save appearance
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      >
        <span className="mb-3 block font-title text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Live preview
        </span>
        <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
          <div className="flex items-center gap-3 bg-[#0d0d12] px-4 py-4 text-white">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #ff8a4c)` }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-[13px] font-semibold leading-tight">
                {displayName || "Support Agent"}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-white/50">online · ready to help</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-[#faf8f4] px-4 py-5" style={{ minHeight: 180 }}>
            <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-[13.5px] text-[#0d0d12] shadow-sm">
              {welcomeMessage || "Hello! How can I assist you today?"}
            </div>
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#0d0d12] px-3.5 py-2.5 text-[13.5px] text-white">
              Hi! I have a question about my order.
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-black/5 bg-[#f7f5f0] px-3 py-3">
            <div className="flex-1 rounded-xl border border-black/10 bg-[#faf8f4] px-3 py-2 text-[13px] text-[#9b9691]">
              Ask anything…
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ background: accentColor }}
            >
              <Send size={15} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
