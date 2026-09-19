"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Briefcase, KeyRound, Loader2, Save, Settings2, Smile } from "lucide-react";
import type { SerializedBot } from "@/lib/chatbots";
import { useUpdateBot } from "@/hooks/use-bots";
import {
  defaultModel,
  INDUSTRIES,
  MODELS,
  PROVIDERS,
  type Provider,
  TONES,
  withCurrent,
} from "@/lib/options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ease = { type: "spring", bounce: 0.22, duration: 0.5 } as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-foreground">
    {children}
  </span>
);

export const BotConfigForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const updateMutation = useUpdateBot(bot._id);

  const [name, setName] = useState(bot.name);
  const [status, setStatus] = useState<"draft" | "live">(bot.status);
  const [supportEmail, setSupportEmail] = useState(bot.supportEmail);
  const [businessInfo, setBusinessInfo] = useState(bot.businessInfo);
  const [personaInfo, setPersonaInfo] = useState(bot.botInfo);
  const [provider, setProvider] = useState<Provider>(bot.provider);
  const [model, setModel] = useState(bot.model || defaultModel(bot.provider));
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState(bot.apiKeyMasked);
  const [hasKey, setHasKey] = useState(bot.hasApiKey);

  // Baseline for unsaved-changes tracking — captured from the loaded bot.
  const [baseline, setBaseline] = useState(() =>
    JSON.stringify({
      name: bot.name,
      status: bot.status,
      supportEmail: bot.supportEmail,
      businessInfo: bot.businessInfo,
      personaInfo: bot.botInfo,
      provider: bot.provider,
      model: bot.model || defaultModel(bot.provider),
    }),
  );
  const snapshot = () =>
    JSON.stringify({ name, status, supportEmail, businessInfo, personaInfo, provider, model });
  const dirty = apiKey.trim().length > 0 || snapshot() !== baseline;

  const changeProvider = (p: Provider) => {
    setProvider(p);
    setModel(defaultModel(p));
  };

  const industryOptions = withCurrent(INDUSTRIES, businessInfo.industry);
  const toneOptions = withCurrent(TONES, personaInfo.communicationTone);

  const save = async () => {
    try {
      const data = await updateMutation.mutateAsync({
        name,
        status,
        supportEmail,
        provider,
        model,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        businessInfo,
        botInfo: personaInfo,
      });
      if (data.bot) {
        setMaskedKey(data.bot.apiKeyMasked);
        setHasKey(data.bot.hasApiKey);
      }
      setApiKey("");
      setBaseline(snapshot());
      toast.success("Changes saved");
      router.refresh();
    } catch {
      toast.error("Could not save changes.");
    }
  };

  const needsKey = !hasKey && !apiKey.trim();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-4"
    >
      {/* General */}
      <motion.div variants={sectionVariants} transition={ease}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <SectionIcon>
              <Settings2 className="h-4 w-4" aria-hidden />
            </SectionIcon>
            <div>
              <CardTitle>General</CardTitle>
              <CardDescription>The agent name and whether it&apos;s live.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Agent name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Untitled agent"
                className="max-w-sm"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div
                role="group"
                aria-label="Agent status"
                className="flex w-fit items-center rounded-xl border border-border bg-muted/40 p-1"
              >
                {(["draft", "live"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold capitalize transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      status === s
                        ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        s === "live" ? "bg-emerald-500" : "bg-zinc-400",
                      )}
                    />
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {status === "live"
                  ? "Live agents answer on embedded sites immediately."
                  : "Drafts stay hidden until you flip them live."}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Business */}
      <motion.div variants={sectionVariants} transition={ease}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <SectionIcon>
              <Briefcase className="h-4 w-4" aria-hidden />
            </SectionIcon>
            <div>
              <CardTitle>Business</CardTitle>
              <CardDescription>Context the agent uses to stay on-brand.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                  }
                  placeholder="Acme Inc."
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select
                  value={businessInfo.industry}
                  onValueChange={(v) => setBusinessInfo({ ...businessInfo, industry: v as string })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supportEmail">
                Support email <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@acme.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Business description{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                placeholder="What you offer, who you serve, what sets you apart…"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Persona */}
      <motion.div variants={sectionVariants} transition={ease}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <SectionIcon>
              <Smile className="h-4 w-4" aria-hidden />
            </SectionIcon>
            <div>
              <CardTitle>Persona</CardTitle>
              <CardDescription>How the agent presents itself and speaks.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="botName">Bot display name</Label>
                <Input
                  id="botName"
                  value={personaInfo.botName}
                  onChange={(e) => setPersonaInfo({ ...personaInfo, botName: e.target.value })}
                  placeholder="Aria, Max, Nova…"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Communication tone</Label>
                <Select
                  value={personaInfo.communicationTone}
                  onValueChange={(v) =>
                    setPersonaInfo({ ...personaInfo, communicationTone: v as string })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="personality">
                Personality &amp; instructions{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="personality"
                rows={5}
                value={personaInfo.personalityDescription}
                onChange={(e) =>
                  setPersonaInfo({ ...personaInfo, personalityDescription: e.target.value })
                }
                placeholder="How it should greet users, topics to avoid, edge-case handling…"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model & key */}
      <motion.div variants={sectionVariants} transition={ease}>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <SectionIcon>
              <KeyRound className="h-4 w-4" aria-hidden />
            </SectionIcon>
            <div>
              <CardTitle>Model &amp; API key</CardTitle>
              <CardDescription>This agent uses its own provider, model, and key.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Provider</Label>
                <Select value={provider} onValueChange={(v) => changeProvider(v as Provider)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select value={model} onValueChange={(v) => setModel(v as string)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS[provider].map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apiKey">
                API key <span className="text-destructive">*</span>
              </Label>
              {hasKey && (
                <p className="font-mono text-xs text-muted-foreground">
                  Current: <span className="text-foreground">{maskedKey}</span>
                </p>
              )}
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasKey ? "Enter a new key to replace" : "Paste this agent's API key"}
                className="max-w-md font-mono"
                autoComplete="new-password"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating save bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.3 }}
        className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur"
      >
        {dirty ? (
          <Badge variant="secondary" className="shrink-0">
            Unsaved changes
          </Badge>
        ) : (
          <span className="shrink-0 text-[13px] text-muted-foreground">All changes saved</span>
        )}
        <div className="flex items-center gap-3">
          {needsKey && <span className="text-xs text-destructive">An API key is required.</span>}
          <Button onClick={save} disabled={updateMutation.isPending || !dirty || needsKey}>
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            Save changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
