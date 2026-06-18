import { AccountModel } from "@/models/account.model";
import { normalizeProvider, type Provider } from "./ai";

/**
 * Resolve the AI provider and API key for a bot: the account picks the provider
 * and holds the shared key; a bot may override the key (same provider).
 * Assumes a DB connection is already established.
 */
export const resolveProviderKey = async (bot: {
  apiKeyOverride?: string;
  ownerId: string;
}): Promise<{ provider: Provider; apiKey: string }> => {
  const account = await AccountModel.findOne({ ownerId: bot.ownerId });
  return {
    provider: normalizeProvider(account?.provider),
    apiKey: bot.apiKeyOverride?.trim() || account?.apiKey?.trim() || "",
  };
};
