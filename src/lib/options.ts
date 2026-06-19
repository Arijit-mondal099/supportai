// Client-safe option lists + provider helpers (no server/LangChain imports),
// so both the API layer and the dashboard forms can use them.

export type Provider = "gemini" | "openai" | "anthropic" | "groq";

export const normalizeProvider = (value?: string): Provider =>
  value === "openai" || value === "anthropic" || value === "groq" ? value : "gemini";

export const PROVIDERS: { value: Provider; label: string }[] = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "groq", label: "Groq" },
];

// Only these providers offer an embeddings API (needed for the RAG knowledge base).
export const supportsEmbeddings = (provider: Provider): boolean =>
  provider === "gemini" || provider === "openai";

export const INDUSTRIES = [
  "E-commerce",
  "SaaS",
  "Fintech",
  "Healthcare",
  "Education",
  "Retail",
  "Travel & Hospitality",
  "Real Estate",
  "Media",
  "Professional Services",
  "Other",
];

export const TONES = [
  "Friendly",
  "Professional",
  "Casual",
  "Formal",
  "Empathetic",
  "Concise",
  "Playful",
  "Technical",
];

export const MODELS: Record<Provider, { value: string; label: string }[]> = {
  gemini: [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  ],
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4o mini" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  ],
  anthropic: [
    { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
    { value: "claude-opus-4-8", label: "Claude Opus 4.8" },
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
  groq: [
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
    { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B" },
    { value: "gemma2-9b-it", label: "Gemma2 9B" },
  ],
};

export const defaultModel = (provider: Provider): string => MODELS[provider][0].value;

// Build a select list that always includes the current value (so existing
// free-text values from older agents stay visible/selectable).
export const withCurrent = (options: string[], current?: string): string[] => {
  const value = current?.trim();
  if (!value || options.includes(value)) return options;
  return [value, ...options];
};
