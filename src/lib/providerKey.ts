import { AccountModel } from "@/models/account.model";
import { normalizeProvider, type Provider } from "./ai";

/**
 * Resolve the AI provider + API key for a bot. Each bot carries its own
 * provider and key; if the bot has no key, fall back to the account-level
 * provider + key as a default. Assumes a DB connection is established.
 */
export const resolveProviderKey = async (bot: {
  provider?: string;
  apiKeyOverride?: string;
  ownerId: string;
}): Promise<{ provider: Provider; apiKey: string }> => {
  const botKey = bot.apiKeyOverride?.trim();
  if (botKey) {
    return { provider: normalizeProvider(bot.provider), apiKey: botKey };
  }

  const account = await AccountModel.findOne({ ownerId: bot.ownerId });
  return {
    provider: normalizeProvider(account?.provider),
    apiKey: account?.apiKey?.trim() || "",
  };
};
