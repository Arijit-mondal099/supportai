import { isValidObjectId } from "mongoose";
import { Cache } from "./cache";
import { db_connection } from "./db";
import { normalizeProvider, type Provider } from "./options";
import { APPEARANCE_DEFAULTS, ChatbotModel } from "@/models/chatbot.model";

export interface SerializedBot {
  _id: string;
  name: string;
  status: "draft" | "live";
  supportEmail: string;
  businessInfo: { businessName: string; industry: string; description: string };
  botInfo: { botName: string; communicationTone: string; personalityDescription: string };
  appearance: {
    accentColor: string;
    avatarUrl: string;
    displayName: string;
    welcomeMessage: string;
    greeting: string;
    headline: string;
    placeholder: string;
    prompts: { label: string; prompt: string }[];
  };
  provider: Provider;
  model: string;
  hasApiKey: boolean;
  apiKeyMasked: string;
  createdAt: string | null;
  updatedAt: string | null;
}

const maskKey = (key: string): string => {
  if (!key) return "";
  if (key.length <= 4) return "••••";
  return `${"•".repeat(Math.min(key.length - 4, 24))}${key.slice(-4)}`;
};

// Prompt chips stored in Mongo can be partial or legacy-shaped; normalize to
// clean label/prompt pairs, falling back to defaults when nothing usable exists.
const serializePrompts = (value: unknown): { label: string; prompt: string }[] => {
  if (!Array.isArray(value)) return APPEARANCE_DEFAULTS.prompts;
  const clean = value
    .filter(
      (p): p is { label: unknown; prompt: unknown } =>
        !!p && typeof p === "object" && "label" in p && "prompt" in p,
    )
    .map((p) => ({ label: String(p.label), prompt: String(p.prompt) }))
    .filter((p) => p.label.trim() && p.prompt.trim())
    .slice(0, 6);
  return clean.length ? clean : APPEARANCE_DEFAULTS.prompts;
};

// Shape a lean/hydrated Mongo doc into a plain, client-serializable object (no secrets).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeBot = (bot: any): SerializedBot => {
  const business = (bot.businessInfo ?? {}) as Record<string, string>;
  const persona = (bot.botInfo ?? {}) as Record<string, string>;
  const look = (bot.appearance ?? {}) as Record<string, string>;
  return {
    _id: String(bot._id),
    name: (bot.name as string) ?? "Untitled chatbot",
    status: (bot.status as "draft" | "live") ?? "draft",
    supportEmail: (bot.supportEmail as string) ?? "",
    businessInfo: {
      businessName: business.businessName ?? "",
      industry: business.industry ?? "",
      description: business.description ?? "",
    },
    botInfo: {
      botName: persona.botName ?? "",
      communicationTone: persona.communicationTone ?? "",
      personalityDescription: persona.personalityDescription ?? "",
    },
    appearance: {
      accentColor: look.accentColor ?? APPEARANCE_DEFAULTS.accentColor,
      avatarUrl: look.avatarUrl ?? APPEARANCE_DEFAULTS.avatarUrl,
      displayName: look.displayName ?? APPEARANCE_DEFAULTS.displayName,
      welcomeMessage: look.welcomeMessage ?? APPEARANCE_DEFAULTS.welcomeMessage,
      greeting: look.greeting ?? APPEARANCE_DEFAULTS.greeting,
      headline: look.headline ?? APPEARANCE_DEFAULTS.headline,
      placeholder: look.placeholder ?? APPEARANCE_DEFAULTS.placeholder,
      prompts: serializePrompts(look.prompts),
    },
    provider: normalizeProvider(bot.provider as string),
    model: (bot.model as string) ?? "",
    hasApiKey: !!(bot.apiKeyOverride as string),
    apiKeyMasked: maskKey((bot.apiKeyOverride as string) ?? ""),
    createdAt: bot.createdAt ? new Date(bot.createdAt as string).toISOString() : null,
    updatedAt: bot.updatedAt ? new Date(bot.updatedAt as string).toISOString() : null,
  };
};

export const listChatbots = async (ownerId: string): Promise<SerializedBot[]> => {
  return Cache.memoize(`cache:bots:${ownerId}`, 120, async () => {
    await db_connection();
    const bots = await ChatbotModel.find({ ownerId }).sort({ createdAt: 1 }).lean();
    return bots.map(serializeBot);
  });
};

export const getChatbot = async (ownerId: string, botId: string): Promise<SerializedBot | null> => {
  if (!isValidObjectId(botId)) return null;
  return Cache.memoize(`cache:bot:${ownerId}:${botId}`, 120, async () => {
    await db_connection();
    const bot = await ChatbotModel.findOne({ _id: botId, ownerId }).lean();
    return bot ? serializeBot(bot) : null;
  });
};
