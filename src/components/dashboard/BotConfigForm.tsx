"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { apiClient } from "@/lib/axios";
import type { SerializedBot } from "@/lib/chatbots";
import {
  defaultModel,
  INDUSTRIES,
  MODELS,
  PROVIDERS,
  type Provider,
  TONES,
  withCurrent,
} from "@/lib/options";
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

export const BotConfigForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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

  const changeProvider = (p: Provider) => {
    setProvider(p);
    setModel(defaultModel(p));
  };

  const industryOptions = withCurrent(INDUSTRIES, businessInfo.industry);
  const toneOptions = withCurrent(TONES, personaInfo.communicationTone);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put(`/api/chatbots/${bot._id}`, {
        name,
        status,
        supportEmail,
        provider,
        model,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        businessInfo,
        botInfo: personaInfo,
      });
      if (data.success) {
        if (data.bot) {
          setMaskedKey(data.bot.apiKeyMasked);
          setHasKey(data.bot.hasApiKey);
        }
        setApiKey("");
        toast.success("Changes saved");
        router.refresh();
      } else {
        toast.error(data.message || "Could not save changes.");
      }
    } catch {
      toast.error("Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>The agent name and whether it&apos;s live.</CardDescription>
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
            />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <div className="flex w-fit rounded-lg border border-border p-0.5">
              {(["draft", "live"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1 text-xs font-semibold capitalize transition",
                    status === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business */}
      <Card>
        <CardHeader>
          <CardTitle>Business</CardTitle>
          <CardDescription>Context the agent uses to stay on-brand.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                placeholder="Acme Inc."
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
            <Label htmlFor="supportEmail">Support email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@acme.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Business description</Label>
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

      {/* Persona */}
      <Card>
        <CardHeader>
          <CardTitle>Persona</CardTitle>
          <CardDescription>How the agent presents itself and speaks.</CardDescription>
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
            <Label htmlFor="personality">Personality &amp; instructions</Label>
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

      {/* Model & key */}
      <Card>
        <CardHeader>
          <CardTitle>Model &amp; API key</CardTitle>
          <CardDescription>This agent uses its own provider, model, and key.</CardDescription>
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
            />
          </div>
        </CardContent>
      </Card>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-1 flex items-center justify-end gap-3 border-t border-border bg-background/80 px-1 py-3 backdrop-blur">
        {!hasKey && !apiKey.trim() && (
          <span className="text-xs text-destructive">An API key is required.</span>
        )}
        <Button onClick={save} disabled={saving || (!hasKey && !apiKey.trim())}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </div>
    </div>
  );
};
