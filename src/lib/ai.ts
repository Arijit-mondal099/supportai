import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import type { Embeddings } from "@langchain/core/embeddings";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type Provider = "gemini" | "openai";

// Chat + embedding models per provider (centralised so they're easy to tune).
const CHAT_MODELS: Record<Provider, string> = {
  gemini: "gemini-2.0-flash",
  openai: "gpt-4o-mini",
};

const EMBED_MODELS: Record<Provider, string> = {
  gemini: "text-embedding-004",
  openai: "text-embedding-3-small",
};

// Pin every provider to the same embedding dimension so a single Pinecone
// index works for both. Gemini text-embedding-004 is natively 768; OpenAI
// text-embedding-3-small is reduced to 768 via the `dimensions` option.
export const EMBED_DIMENSIONS = 768;

export const normalizeProvider = (value?: string): Provider =>
  value === "openai" ? "openai" : "gemini";

export const getChatModel = (provider: Provider, apiKey: string): BaseChatModel => {
  if (provider === "openai") {
    return new ChatOpenAI({ apiKey, model: CHAT_MODELS.openai, temperature: 0.3 });
  }
  return new ChatGoogleGenerativeAI({ apiKey, model: CHAT_MODELS.gemini, temperature: 0.3 });
};

export const getEmbeddings = (provider: Provider, apiKey: string): Embeddings => {
  if (provider === "openai") {
    return new OpenAIEmbeddings({
      apiKey,
      model: EMBED_MODELS.openai,
      dimensions: EMBED_DIMENSIONS,
    });
  }
  return new GoogleGenerativeAIEmbeddings({ apiKey, model: EMBED_MODELS.gemini });
};
