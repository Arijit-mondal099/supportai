"use client";

import { useState } from "react";
import {
  Bot,
  Building2,
  Check,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Mail,
  MessageSquare,
  Save,
  Tag,
  Wand2,
} from "lucide-react";
import { Input } from "@/components/Input";
import { apiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import type { SerializedBot } from "@/lib/chatbots";

type Tab = "business" | "persona" | "model";

export const BotConfigForm = ({ bot }: { bot: SerializedBot }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("business");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(bot.name);
  const [status, setStatus] = useState<"draft" | "live">(bot.status);
  const [supportEmail, setSupportEmail] = useState(bot.supportEmail);
  const [businessInfo, setBusinessInfo] = useState(bot.businessInfo);
  const [personaInfo, setPersonaInfo] = useState(bot.botInfo);

  const [provider, setProvider] = useState<"gemini" | "openai">(bot.provider);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState(bot.apiKeyMasked);
  const [hasKey, setHasKey] = useState(bot.hasApiKey);

  const providerLabel = provider === "openai" ? "OpenAI" : "Google Gemini";

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put(`/api/chatbots/${bot._id}`, {
        name,
        status,
        supportEmail,
        businessInfo,
        botInfo: personaInfo,
        provider,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
      });
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        if (data.bot) {
          setMaskedKey(data.bot.apiKeyMasked);
          setHasKey(data.bot.hasApiKey);
        }
        setApiKey("");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "business", label: "Business", icon: <Building2 size={15} /> },
    { id: "persona", label: "Persona", icon: <Bot size={15} /> },
    { id: "model", label: "Model & Key", icon: <KeyRound size={15} /> },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header: name + status + save */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Chatbot name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Untitled chatbot"
            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 p-0.5">
            {(["draft", "live"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  status === s ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={save}
            disabled={saving || saved}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
              saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/60 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold tracking-wide transition ${
              activeTab === tab.id
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="px-6 py-7">
        {activeTab === "business" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="text"
                label="Business Name"
                icon={<Building2 size={14} />}
                placeholder="Acme Corporation"
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
              />
              <Input
                type="text"
                label="Industry"
                icon={<Tag size={14} />}
                placeholder="E-commerce, SaaS, Support…"
                value={businessInfo.industry}
                onChange={(e) => setBusinessInfo({ ...businessInfo, industry: e.target.value })}
              />
            </div>
            <Input
              type="email"
              label="Support Email"
              icon={<Mail size={14} />}
              placeholder="support@acme.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
            <Input
              type="textarea"
              label="Business Description"
              icon={<FileText size={14} />}
              placeholder="Describe your business — what you offer, who you serve, and what sets you apart. Your bot will use this to stay on-brand."
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
            />
          </div>
        )}

        {activeTab === "persona" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="text"
                label="Bot Name"
                icon={<Bot size={14} />}
                placeholder="Aria, Max, Nova…"
                value={personaInfo.botName}
                onChange={(e) => setPersonaInfo({ ...personaInfo, botName: e.target.value })}
              />
              <Input
                type="text"
                label="Communication Tone"
                icon={<MessageSquare size={14} />}
                placeholder="Friendly, professional, concise…"
                value={personaInfo.communicationTone}
                onChange={(e) =>
                  setPersonaInfo({ ...personaInfo, communicationTone: e.target.value })
                }
              />
            </div>
            <Input
              type="textarea"
              label="Personality Description"
              icon={<Wand2 size={14} />}
              placeholder="Describe your bot's character, how it should greet users, what topics to avoid, and any specific instructions for handling edge cases…"
              value={personaInfo.personalityDescription}
              onChange={(e) =>
                setPersonaInfo({ ...personaInfo, personalityDescription: e.target.value })
              }
            />
          </div>
        )}

        {activeTab === "model" && (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                AI provider
              </label>
              <div className="grid max-w-sm grid-cols-2 gap-2">
                {(["gemini", "openai"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      provider === p
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {p === "gemini" ? "Google Gemini" : "OpenAI"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <KeyRound size={13} /> {providerLabel} API key
              </label>
              {hasKey && (
                <p className="mb-2 font-mono text-xs text-slate-400">
                  Current: <span className="text-slate-600">{maskedKey}</span>
                </p>
              )}
              <div className="relative max-w-md">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={hasKey ? "Enter a new key to replace" : `Paste this bot's API key`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 font-mono text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-700"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Each chatbot uses its own key. If left empty, your account default key is used.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
