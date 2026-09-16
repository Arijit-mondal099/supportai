import type { Embeddings } from "@langchain/core/embeddings";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { defaultModel, type Provider } from "./options";

const GEMINI_EMBED_MODEL = "gemini-embedding-001";
const OPENAI_EMBED_MODEL = "text-embedding-3-small";

// Pin embedding output to one dimension so a single Pinecone index works across
// providers. gemini-embedding-001 defaults to 3072 dims and is truncated via
// MRL to 768; OpenAI text-embedding-3-small is reduced to 768.
// NOTE: switching the Gemini embedding model changes the embedding space.
// Existing vectors indexed with a previous model (e.g. text-embedding-004)
// must be re-ingested (delete + addDocuments) before the new model returns
// valid similarity results - mixing spaces in one index gives bogus scores.
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
    return new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: GEMINI_EMBED_MODEL,
      outputDimensionality: EMBED_DIMENSIONS,
    });
  }
  throw new Error(`Embeddings are not supported for provider "${provider}".`);
};
