"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  ArrowUp,
  CircleQuestionMark,
  Headset,
  Loader2,
  Package,
  Plus,
  Save,
  Sparkles,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useUpdateBot } from "@/hooks/use-bots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Fixed brand accent — matches the embed widget's default. Colors are no
// longer customizable; the widget always renders this theme.
const BRAND_ACCENT = "#c96442";

const MAX_PROMPTS = 6;

// Decorative icons cycled across shortcut chips, mirroring the widget.
const CHIP_ICONS = [
  { Icon: Package, color: "#2f7bff" },
  { Icon: Headset, color: "#1f9d55" },
  { Icon: Tag, color: "#e8590c" },
  { Icon: Wrench, color: "#ec4899" },
  { Icon: CircleQuestionMark, color: "#d97706" },
  { Icon: Sparkles, color: "#8b5cf6" },
];

interface PromptDraft {
  label: string;
  prompt: string;
}

export const AppearanceForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const updateMutation = useUpdateBot(bot._id);

  const [avatarUrl, setAvatarUrl] = useState(bot.appearance.avatarUrl);
  const [displayName, setDisplayName] = useState(bot.appearance.displayName);
  const [greeting, setGreeting] = useState(bot.appearance.greeting);
  const [headline, setHeadline] = useState(bot.appearance.headline);
  const [welcomeMessage, setWelcomeMessage] = useState(bot.appearance.welcomeMessage);
  const [placeholder, setPlaceholder] = useState(bot.appearance.placeholder);
  const [prompts, setPrompts] = useState<PromptDraft[]>(bot.appearance.prompts);

  const updatePrompt = (index: number, field: "label" | "prompt", value: string) => {
    setPrompts((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const removePrompt = (index: number) => {
    setPrompts((prev) => prev.filter((_, i) => i !== index));
  };

  const addPrompt = () => {
    if (prompts.length >= MAX_PROMPTS) return;
    setPrompts((prev) => [...prev, { label: "", prompt: "" }]);
  };

  const save = async () => {
    const clean = prompts
      .map((p) => ({ label: p.label.trim(), prompt: p.prompt.trim() || p.label.trim() }))
      .filter((p) => p.label);
    if (!clean.length) {
      toast.error("Add at least one shortcut prompt.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        appearance: {
          avatarUrl,
          displayName,
          greeting,
          headline,
          welcomeMessage,
          placeholder,
          prompts: clean,
        },
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
            <CardDescription>
              Customize how the chat widget greets visitors. Colors follow the SupportAI brand theme
              and can&apos;t be changed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bot.status !== "live" && (
              <p className="rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                This agent is still a draft, so the embedded widget keeps showing the default
                greeting and prompts. Save your changes, then publish the agent for the embed to
                pick them up.
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Support Agent"
              />
              <p className="text-xs text-muted-foreground">
                Used to identify the agent to assistive technology.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">Logo image URL</Label>
              <Input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default SupportAI mark.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="greeting">Greeting</Label>
              <Input
                id="greeting"
                value={greeting}
                maxLength={60}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder="Hi there,"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={headline}
                maxLength={120}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Welcome back! How can I help?"
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
            <div className="space-y-1.5">
              <Label htmlFor="placeholder">Input placeholder</Label>
              <Input
                id="placeholder"
                value={placeholder}
                maxLength={80}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder="Ask me anything..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Shortcut prompts</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPrompt}
                  disabled={prompts.length >= MAX_PROMPTS}
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Up to {MAX_PROMPTS} chips shown under the greeting. The prompt is what gets sent
                when a visitor taps the chip.
              </p>
              <div className="space-y-2">
                {prompts.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <Input
                        value={p.label}
                        maxLength={40}
                        onChange={(e) => updatePrompt(i, "label", e.target.value)}
                        placeholder="Chip label"
                        aria-label={`Shortcut ${i + 1} label`}
                      />
                      <Input
                        value={p.prompt}
                        maxLength={200}
                        onChange={(e) => updatePrompt(i, "prompt", e.target.value)}
                        placeholder="Message to send"
                        aria-label={`Shortcut ${i + 1} message`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrompt(i)}
                      disabled={prompts.length <= 1}
                      aria-label={`Remove shortcut ${i + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
        {/* Mirrors the embedded widget's empty state: hero, prompt chips,
            composer with send button, and the powered-by line. */}
        <div className="overflow-hidden rounded-[10px] border border-[#dad9d4] bg-[#faf9f5] shadow-lg">
          <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center">
            <div className="mb-6 h-[62px] w-[62px] shrink-0 overflow-hidden rounded-xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/favicon.png" alt="SupportAI" className="h-full w-full object-cover" />
              )}
            </div>
            <p className="text-[23px] font-medium tracking-tight text-[#83827d]">
              {greeting || "Hi there,"}
            </p>
            <h2 className="-mt-0.5 text-[21px] font-semibold tracking-tight text-[#3d3929]">
              {headline || "Welcome back! How can I help?"}
            </h2>
            <p className="mt-3 max-w-[330px] text-[14.5px] leading-relaxed text-[#83827d]">
              {welcomeMessage ||
                "I'm here to help you tackle your tasks. Choose from the prompts below or just tell me what you need!"}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {prompts.map((p, i) => {
                const { Icon, color } = CHIP_ICONS[i % CHIP_ICONS.length];
                return (
                  <span
                    key={`${i}-${p.label}`}
                    className="inline-flex items-center gap-[7px] rounded-lg bg-[#e9e6dc] py-2 pl-[11px] pr-3.5 text-[13.5px] font-medium text-[#3d3929]"
                  >
                    <Icon size={15} style={{ color }} />
                    {p.label || "New shortcut"}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="px-3.5 pb-1.5 pt-2.5">
            <div className="rounded-[10px] border border-[#dad9d4] bg-[#ede9de]">
              <div className="flex items-center gap-2.5 p-3 pl-4">
                <span className="flex-1 text-[14.5px] text-[#b4b2a7]">
                  {placeholder || "Ask me anything..."}
                </span>
                <span
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] text-white"
                  style={{ background: BRAND_ACCENT }}
                >
                  <ArrowUp size={17} strokeWidth={2.4} />
                </span>
              </div>
            </div>
            <p className="py-2.5 text-center text-[10.5px] tracking-wide text-[#b4b2a7]">
              Powered by <span className="font-semibold">SupportAI</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
