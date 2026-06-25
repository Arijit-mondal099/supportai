"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { defaultModel, INDUSTRIES, MODELS, PROVIDERS, type Provider, TONES } from "@/lib/options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useCreateBot } from "@/hooks/use-bots";

const STEPS = ["Basics", "Persona", "Model & key", "Review"];

export function CreateAgentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const createMutation = useCreateBot();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [botName, setBotName] = useState("");
  const [tone, setTone] = useState("");
  const [personality, setPersonality] = useState("");
  const [provider, setProvider] = useState<Provider>("gemini");
  const [model, setModel] = useState(defaultModel("gemini"));
  const [apiKey, setApiKey] = useState("");
  const [makeLive, setMakeLive] = useState(false);

  const changeProvider = (p: Provider) => {
    setProvider(p);
    setModel(defaultModel(p));
  };

  const canNext =
    step === 0
      ? name.trim().length > 0 && businessName.trim().length > 0
      : step === 1
        ? botName.trim().length > 0 && tone.trim().length > 0
        : step === 2
          ? apiKey.trim().length > 0
          : true;

  const create = async () => {
    try {
      const data = await createMutation.mutateAsync({
        name,
        status: makeLive ? "live" : "draft",
        supportEmail,
        provider,
        model,
        apiKey: apiKey.trim(),
        businessInfo: { businessName, industry, description },
        botInfo: { botName, communicationTone: tone, personalityDescription: personality },
      });
      toast.success("Agent created", { description: "Add knowledge to make it smarter." });
      router.push(`/dashboard/bots/${data.bot._id}`);
      router.refresh();
    } catch {
      toast.error("Could not create agent.");
    }
  };

  const providerLabel = PROVIDERS.find((p) => p.value === provider)?.label ?? "Google Gemini";
  const modelLabel = MODELS[provider].find((m) => m.value === model)?.label ?? model;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/agents"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Agents
        </Link>
        <span className="inline-flex items-center gap-2 bg-gray-50 border border-zinc-200 rounded-xl pl-3 pr-1 py-1 shadow-sm mb-3">
          <span className="flex items-center gap-2 font-title text-[10px] font-normal uppercase tracking-tight text-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            NEW AGENT
          </span>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border border-zinc-200 bg-zinc-100 text-zinc-700">
            <ChevronRight className="w-4 h-4" />
          </span>
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Create an agent</h1>
        <p className="text-sm text-muted-foreground">
          Set up a new AI support agent in a few steps.
        </p>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          );
        })}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Tell us about your business so the agent stays on-brand."}
            {step === 1 && "Give your agent a name and personality."}
            {step === 2 && "Choose a provider, model, and add this agent's API key."}
            {step === 3 && "Review and create your agent."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Agent name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Acme Support"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="business">Business name</Label>
                      <Input
                        id="business"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Industry</Label>
                      <Select value={industry} onValueChange={(v) => setIndustry(v as string)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((o) => (
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What you offer, who you serve, what sets you apart…"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="botName">Bot display name</Label>
                      <Input
                        id="botName"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        placeholder="Aria, Max, Nova…"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Communication tone</Label>
                      <Select value={tone} onValueChange={(v) => setTone(v as string)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TONES.map((o) => (
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
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="How it should greet users, topics to avoid, edge-case handling…"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
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
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste this agent's API key"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Each agent uses its own key — grab one from your provider&apos;s console.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <dl className="divide-y divide-border rounded-lg border border-border">
                    {[
                      ["Agent name", name || "—"],
                      ["Business", businessName || "—"],
                      ["Industry", industry || "—"],
                      ["Bot name", botName || "—"],
                      ["Tone", tone || "—"],
                      ["Provider", providerLabel],
                      ["Model", modelLabel],
                      ["API key", apiKey.trim() ? "Set" : "Not set"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-4 px-4 py-2.5">
                        <dt className="text-sm text-muted-foreground">{k}</dt>
                        <dd className="truncate text-sm font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    onClick={() => setMakeLive((v) => !v)}
                    className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left transition hover:bg-muted"
                  >
                    <span>
                      <span className="text-sm font-medium">Make live now</span>
                      <span className="block text-xs text-muted-foreground">
                        Live agents can answer on embedded sites immediately.
                      </span>
                    </span>
                    <span
                      className={cn(
                        "relative h-5 w-9 shrink-0 rounded-full transition",
                        makeLive ? "bg-primary" : "bg-input",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
                          makeLive ? "left-4.5" : "left-0.5",
                        )}
                      />
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || createMutation.isPending}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </motion.div>
        {step < STEPS.length - 1 ? (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={create} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Create agent
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
