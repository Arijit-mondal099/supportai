import { defaultModel, normalizeProvider, type Provider } from "./options";

/**
 * Resolve the AI provider, API key, and model version for a bot. Each agent
 * carries its own provider/key/model — there is no account-level fallback.
 */
export const resolveProviderKey = (bot: {
  provider?: string;
  apiKeyOverride?: string;
  model?: string;
}): { provider: Provider; apiKey: string; model: string } => {
  const provider = normalizeProvider(bot.provider);
  return {
    provider,
    apiKey: bot.apiKeyOverride?.trim() || "",
    model: bot.model?.trim() || defaultModel(provider),
  };
};
