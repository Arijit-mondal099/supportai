// Client-safe option lists + provider helpers (no server/LangChain imports),
// so both the API layer and the dashboard forms can use them.

export type Provider = "gemini" | "openai";

export const normalizeProvider = (value?: string): Provider =>
  value === "openai" ? value : "gemini";

export const PROVIDERS: { value: Provider; label: string }[] = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
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
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
    { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite" },
    { value: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite" },
  ],
  openai: [
    { value: "gpt-4o-mini", label: "GPT-4o mini" },
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
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
