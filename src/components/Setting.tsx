"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Bot,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  MessageSquare,
  Save,
  FileText,
  Tag,
  Wand2,
} from "lucide-react";
import { Input } from "./Input";
import { apiClient } from "@/lib/axios";
import { motion } from "motion/react";

type Tab = "business" | "persona" | "api";

export interface BusinessInfo {
  businessName: string;
  industry: string;
  description: string;
}

export interface PersonaInfo {
  botName: string;
  communicationTone: string;
  personalityDescription: string;
}

export const Setting = ({ ownerId, supportEmail }: { ownerId: string; supportEmail: string }) => {
  const [activeTab, setActiveTab] = useState<Tab>("business");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    industry: "",
    description: "",
  });
  const [personaInfo, setPersonaInfo] = useState<PersonaInfo>({
    botName: "",
    communicationTone: "",
    personalityDescription: "",
  });
  const [apiKey, setApiKey] = useState("");

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    const payload = {
      ownerId,
      supportEmail,
      apiKey,
      businessInfo,
      botInfo: personaInfo,
    };

    try {
      const { data } = await apiClient.post("/api/business", payload);
      if (!data.success) {
        throw new Error(data.message || "Failed to save business details");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = [
    { id: "business", label: "Business", icon: <Building2 size={15} /> },
    { id: "persona", label: "Persona", icon: <Bot size={15} /> },
    { id: "api", label: "API Keys", icon: <KeyRound size={15} /> },
  ];

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!ownerId) return;

      try {
        const { data } = await apiClient.get(`/api/business/${ownerId}`);

        if (data.success && data.business) {
          const { businessInfo, botInfo, apiKey } = data.business;
          setBusinessInfo(businessInfo);
          setPersonaInfo(botInfo);
          setApiKey(apiKey || "");
        } else {
          throw new Error(data.message || "Failed to fetch business details");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBusinessDetails();
  }, [ownerId]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-auto">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm">
                <Bot size={19} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                  Chatbot Settings
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure your assistant&apos;s identity &amp; access
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-8 border-b border-slate-100 bg-slate-50/60">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center gap-2 px-4 py-3.5 text-xs font-semibold tracking-wide border-b-2 -mb-px transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-7">
            {/* ── BUSINESS TAB ── */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="Business Name"
                    icon={<Building2 size={14} />}
                    placeholder="Acme Corporation"
                    required
                    value={businessInfo.businessName}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        businessName: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="text"
                    label="Industry"
                    icon={<Tag size={14} />}
                    placeholder="E-commerce, SaaS, Support…"
                    value={businessInfo.industry}
                    required
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        industry: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  type="textarea"
                  label="Business Description"
                  icon={<FileText size={14} />}
                  placeholder="Describe your business — what you offer, who you serve, and what sets you apart. Your bot will use this to stay on-brand."
                  required
                  value={businessInfo.description}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* ── PERSONA TAB ── */}
            {activeTab === "persona" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="Bot Name"
                    icon={<Bot size={14} />}
                    placeholder="Aria, Max, Nova…"
                    required
                    value={personaInfo.botName}
                    onChange={(e) =>
                      setPersonaInfo({
                        ...personaInfo,
                        botName: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="text"
                    label="Communication Tone"
                    icon={<MessageSquare size={14} />}
                    placeholder="Friendly, professional, concise…"
                    required
                    value={personaInfo.communicationTone}
                    onChange={(e) =>
                      setPersonaInfo({
                        ...personaInfo,
                        communicationTone: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  type="textarea"
                  label="Personality Description"
                  icon={<Wand2 size={14} />}
                  placeholder="Describe your bot's character, how it should greet users, what topics to avoid, and any specific instructions for handling edge cases…"
                  required
                  value={personaInfo.personalityDescription}
                  onChange={(e) =>
                    setPersonaInfo({
                      ...personaInfo,
                      personalityDescription: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* ── API TAB ── */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <KeyRound size={14} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">
                        API Key*
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-5 space-y-4 bg-white">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showKey ? "text" : "password"}
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
                          required
                          value={apiKey}
                          placeholder="Gemini Api Key"
                          onChange={(e) => setApiKey(e.target.value)}
                        />

                        <button
                          onClick={() => setShowKey((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-zinc-200 bg-slate-50/60 rounded-b-3xl flex items-center justify-end">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl shadow-sm transition-all duration-300  cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  saved
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                }`}
                disabled={
                  saved ||
                  !businessInfo.businessName ||
                  !businessInfo.industry ||
                  !businessInfo.description ||
                  !personaInfo.botName ||
                  !personaInfo.communicationTone ||
                  !personaInfo.personalityDescription ||
                  !apiKey
                }
              >
                {saved ? <Check size={13} /> : <Save size={13} />}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
