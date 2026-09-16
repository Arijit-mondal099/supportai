import type { Embeddings } from "@langchain/core/embeddings";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { defaultModel, type Provider } from "./options";

const GEMINI_EMBED_MODEL = "gemini-embedding-2";
const OPENAI_EMBED_MODEL = "text-embedding-3-small";

// Pin embedding output to one dimension so a single Pinecone index works across
// providers. Gemini text-embedding-004 is natively 768; OpenAI is reduced to 768.
export const EMBED_DIMENSIONS = 768;

export const getChatModel = (provider: Provider, apiKey: string, model?: string): BaseChatModel => {
  const resolved = model?.trim() || defaultModel(provider);
  const temperature = 0.3;
  if (provider === "openai") {
    return new ChatOpenAI({ apiKey, model: resolved, temperature });
  }
  return new ChatGoogleGenerativeAI({ apiKey, model: resolved, temperature });
};

// Only Gemini and OpenAI provide embeddings.
export const getEmbeddings = (provider: Provider, apiKey: string): Embeddings => {
  if (provider === "openai") {
    return new OpenAIEmbeddings({
      apiKey,
      model: OPENAI_EMBED_MODEL,
      dimensions: EMBED_DIMENSIONS,
    });
  }
  if (provider === "gemini") {
    return new GoogleGenerativeAIEmbeddings({ apiKey, model: GEMINI_EMBED_MODEL });
  }
  throw new Error(`Embeddings are not supported for provider "${provider}".`);
};
