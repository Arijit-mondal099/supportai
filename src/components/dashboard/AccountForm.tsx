"use client";

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, KeyRound, Save } from "lucide-react";
import { apiClient } from "@/lib/axios";

type Provider = "gemini" | "openai";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "gemini", label: "Google Gemini" },
  { id: "openai", label: "OpenAI" },
];

export const AccountForm = () => {
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<Provider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get("/api/account");
        if (data.success) {
          setEmail(data.account.email);
          setProvider(data.account.provider === "openai" ? "openai" : "gemini");
          setMaskedKey(data.account.apiKeyMasked);
          setHasKey(data.account.hasApiKey);
        }
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await apiClient.put("/api/account", { provider, apiKey });
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        setMaskedKey(data.account.apiKeyMasked);
        setHasKey(data.account.hasApiKey);
        setApiKey("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const providerLabel = PROVIDERS.find((p) => p.id === provider)?.label ?? "Gemini";

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Choose your AI provider and key — they&apos;re shared across all of your chatbots.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <span className="text-xs font-semibold text-slate-500">Signed in as</span>
          <p className="mt-1 text-sm font-medium text-slate-800">{email || "…"}</p>
        </div>

        <div className="space-y-5 px-6 py-6">
          {/* Provider selector */}
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-600">
              AI provider
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    provider === p.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API key */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <KeyRound size={14} className="text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                {providerLabel} API key
              </span>
            </div>

            {hasKey && (
              <p className="font-mono text-xs text-slate-400">
                Current key: <span className="text-slate-600">{maskedKey}</span>
              </p>
            )}

            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  hasKey ? "Enter a new key to replace" : `Paste your ${providerLabel} API key`
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 font-mono text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-700"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-6 py-4">
          <button
            onClick={save}
            disabled={saving || saved || !apiKey.trim()}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
              saved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {saved ? <Check size={13} /> : <Save size={13} />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
