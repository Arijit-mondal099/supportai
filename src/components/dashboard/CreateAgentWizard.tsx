"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { defaultModel, INDUSTRIES, MODELS, PROVIDERS, type Provider, TONES } from "@/lib/options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateBot } from "@/hooks/use-bots";

const STEPS = ["Basics", "Persona", "Model & key", "Review"] as const;

const STEP_DESCRIPTIONS = [
  "Tell us about your business so the agent stays on-brand.",
  "Give your agent a name and personality.",
  "Choose a provider, model, and add this agent's API key.",
  "Review and create your agent.",
] as const;

const ease = { type: "spring", bounce: 0.22, duration: 0.45 } as const;

export function CreateAgentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(Math.min(STEPS.length - 1, Math.max(0, next)));
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
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={ease}>
        <Link
          href="/dashboard/agents"
          className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Agents
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Create an agent
            </h1>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Set up a new AI support agent in a few steps.
            </p>
          </div>
          <p className="shrink-0 text-[13px] text-muted-foreground tabular-nums">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label="Setup progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={ease}
          />
        </div>
      </motion.div>

      {/* Stepper — a real sequence, so numbered markers earn their place */}
      <motion.ol
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.08 }}
        className="flex items-center gap-2"
      >
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary ring-2 ring-ring/30",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-[13px] font-medium sm:inline",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1 transition-colors",
                    i < step ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </motion.ol>

      {/* Step card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...ease, delay: 0.14 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{STEPS[step]}</CardTitle>
            <CardDescription>{STEP_DESCRIPTIONS[step]}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: 28 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 * direction }}
                transition={ease}
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
                        autoComplete="off"
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
                          autoComplete="organization"
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
                      <Label htmlFor="supportEmail">
                        Support email{" "}
                        <span className="font-normal text-muted-foreground">(optional)</span>
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
                          autoComplete="off"
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
                      <Label htmlFor="personality">
                        Personality &amp; instructions{" "}
                        <span className="font-normal text-muted-foreground">(optional)</span>
                      </Label>
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
                        <Select
                          value={provider}
                          onValueChange={(v) => changeProvider(v as Provider)}
                        >
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
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Each agent uses its own key — grab one from your provider&apos;s console.
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <dl className="divide-y divide-border rounded-xl border border-border bg-muted/40">
                      {[
                        ["Agent name", name || "—"],
                        ["Business", businessName || "—"],
                        ["Industry", industry || "—"],
                        ["Bot name", botName || "—"],
                        ["Tone", tone || "—"],
                        ["Provider", providerLabel],
                        ["Model", modelLabel],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between gap-4 px-4 py-2.5"
                        >
                          <dt className="shrink-0 text-sm text-muted-foreground">{k}</dt>
                          <dd className="truncate text-sm font-medium">{v}</dd>
                        </div>
                      ))}
                      <div className="flex items-center justify-between gap-4 px-4 py-2.5">
                        <dt className="shrink-0 text-sm text-muted-foreground">API key</dt>
                        <dd>
                          <Badge variant="secondary">Set</Badge>
                        </dd>
                      </div>
                    </dl>
                    <Separator />
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="make-live" className="flex-1 cursor-pointer">
                        <span className="block text-sm font-medium">Make live now</span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          Live agents can answer on embedded sites immediately.
                        </span>
                      </Label>
                      <Switch id="make-live" checked={makeLive} onCheckedChange={setMakeLive} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => goTo(step - 1)}
              disabled={step === 0 || createMutation.isPending}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => goTo(step + 1)} disabled={!canNext}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={create} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden />
                )}
                Create agent
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
