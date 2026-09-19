"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  ArrowUp,
  CircleQuestionMark,
  Headset,
  Info,
  Loader2,
  Package,
  Palette,
  Plus,
  Save,
  Sparkles,
  Tag,
  Wrench,
  X,
} from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useUpdateBot } from "@/hooks/use-bots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Fixed brand accent — matches the embed widget's default. Colors are no
// longer customizable; the widget always renders this theme.
const BRAND_ACCENT = "#c96442";

const MAX_PROMPTS = 6;

const LIMITS = { greeting: 60, headline: 120, placeholder: 80 } as const;

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

const ease = { type: "spring", bounce: 0.22, duration: 0.5 } as const;

const CountedLabel = ({
  htmlFor,
  children,
  value,
  max,
}: {
  htmlFor: string;
  children: React.ReactNode;
  value: number;
  max: number;
}) => (
  <div className="flex items-baseline justify-between gap-2">
    <Label htmlFor={htmlFor}>{children}</Label>
    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
      {value} / {max}
    </span>
  </div>
);

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

  const [baseline, setBaseline] = useState(() =>
    JSON.stringify({
      avatarUrl: bot.appearance.avatarUrl,
      displayName: bot.appearance.displayName,
      greeting: bot.appearance.greeting,
      headline: bot.appearance.headline,
      welcomeMessage: bot.appearance.welcomeMessage,
      placeholder: bot.appearance.placeholder,
      prompts: bot.appearance.prompts,
    }),
  );
  const snapshot = () =>
    JSON.stringify({
      avatarUrl,
      displayName,
      greeting,
      headline,
      welcomeMessage,
      placeholder,
      prompts,
    });
  const dirty = snapshot() !== baseline;

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
      setBaseline(
        JSON.stringify({
          avatarUrl,
          displayName,
          greeting,
          headline,
          welcomeMessage,
          placeholder,
          prompts: clean,
        }),
      );
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
      className="grid items-start gap-4 lg:grid-cols-2"
    >
      {/* Form */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={ease}
      >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
              <Palette className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>
                How the chat widget greets visitors. Colors follow the SupportAI brand theme.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {bot.status !== "live" && (
              <p className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
                <span>
                  This agent is still a draft, so the embedded widget keeps showing the default
                  greeting and prompts. Save your changes, then publish the agent for the embed to
                  pick them up.
                </span>
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Support Agent"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="avatarUrl">Logo image URL</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://…/logo.png"
                  inputMode="url"
                />
              </div>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">
              Leave the logo empty to use the default SupportAI mark.
            </p>
            <div className="space-y-1.5">
              <CountedLabel htmlFor="greeting" value={greeting.length} max={LIMITS.greeting}>
                Greeting
              </CountedLabel>
              <Input
                id="greeting"
                value={greeting}
                maxLength={LIMITS.greeting}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder="Hi there,"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <CountedLabel htmlFor="headline" value={headline.length} max={LIMITS.headline}>
                Headline
              </CountedLabel>
              <Input
                id="headline"
                value={headline}
                maxLength={LIMITS.headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Welcome back! How can I help?"
                autoComplete="off"
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
              <CountedLabel
                htmlFor="placeholder"
                value={placeholder.length}
                max={LIMITS.placeholder}
              >
                Input placeholder
              </CountedLabel>
              <Input
                id="placeholder"
                value={placeholder}
                maxLength={LIMITS.placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                placeholder="Ask me anything..."
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>
                  Shortcut prompts{" "}
                  <span className="font-normal text-muted-foreground tabular-nums">
                    ({prompts.length} / {MAX_PROMPTS})
                  </span>
                </Label>
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
                Chips shown under the greeting. The prompt is what gets sent when a visitor taps the
                chip — leave it empty to send the label.
              </p>
              <div className="space-y-2">
                {prompts.map((p, i) => {
                  const { Icon, color } = CHIP_ICONS[i % CHIP_ICONS.length];
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40"
                        aria-hidden
                      >
                        <Icon size={15} style={{ color }} />
                      </span>
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
                        className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              {dirty ? (
                <Badge variant="secondary" className="shrink-0">
                  Unsaved changes
                </Badge>
              ) : (
                <span className="shrink-0 text-[13px] text-muted-foreground">
                  All changes saved
                </span>
              )}
              <Button onClick={save} disabled={updateMutation.isPending || !dirty}>
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="h-4 w-4" aria-hidden />
                )}
                Save appearance
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Live preview — sticks while the form scrolls */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={ease}
        className="lg:sticky lg:top-6"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-title text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Live preview
          </span>
          <Badge variant={bot.status === "live" ? "default" : "secondary"}>
            {bot.status === "live" ? "Live" : "Draft"}
          </Badge>
        </div>
        {/* Mirrors the embedded widget's empty state: hero, prompt chips,
            composer with send button, and the powered-by line. */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[#faf9f5] shadow-lg">
          <div className="flex flex-col items-center px-6 pt-8 pb-2 text-center">
            <div className="mb-6 h-[62px] w-[62px] shrink-0 overflow-hidden rounded-2xl shadow-sm">
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
                    className="inline-flex items-center gap-[7px] rounded-lg bg-[#e9e6dc] py-2 pr-3.5 pl-[11px] text-[13.5px] font-medium text-[#3d3929]"
                  >
                    <Icon size={15} style={{ color }} />
                    {p.label || "New shortcut"}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="px-3.5 pt-2.5 pb-1.5">
            <div className="rounded-[10px] border border-[#dad9d4] bg-[#ede9de]">
              <div className="flex items-center gap-2.5 p-3 pl-4">
                <span className="flex-1 truncate text-[14.5px] text-[#b4b2a7]">
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
