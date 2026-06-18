import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings, type Provider } from "./ai";
import { ENV } from "./env";

export const isRagConfigured = (): boolean => !!(ENV.PINECONE_API_KEY && ENV.PINECONE_INDEX);

let pineconeClient: Pinecone | null = null;

const getPineconeIndex = () => {
  if (!ENV.PINECONE_API_KEY || !ENV.PINECONE_INDEX) {
    throw new Error("Pinecone is not configured (set PINECONE_API_KEY and PINECONE_INDEX).");
  }
  if (!pineconeClient) pineconeClient = new Pinecone({ apiKey: ENV.PINECONE_API_KEY });
  return pineconeClient.index(ENV.PINECONE_INDEX);
};

const getStore = (provider: Provider, apiKey: string) =>
  PineconeStore.fromExistingIndex(getEmbeddings(provider, apiKey), {
    pineconeIndex: getPineconeIndex(),
  });

// Split raw text into overlapping chunks for embedding.
export const splitText = async (text: string): Promise<string[]> => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
  return splitter.splitText(clean);
};

// Embed chunks and add them to Pinecone, tagged with botId for filtering.
export const addDocuments = async (
  provider: Provider,
  apiKey: string,
  botId: string,
  documentId: string,
  chunks: { id: string; text: string }[],
): Promise<void> => {
  if (!chunks.length) return;
  const store = await getStore(provider, apiKey);
  const docs = chunks.map(
    (c) => new Document({ pageContent: c.text, metadata: { botId, documentId } }),
  );
  await store.addDocuments(docs, { ids: chunks.map((c) => c.id) });
};

// Retrieve the top-k most relevant chunk texts for a query, scoped to one bot.
export const retrieve = async (
  provider: Provider,
  apiKey: string,
  botId: string,
  query: string,
  k = 5,
): Promise<string[]> => {
  const store = await getStore(provider, apiKey);
  const results = await store.similaritySearch(query, k, { botId });
  return results.map((r) => r.pageContent).filter((t) => t.length > 0);
};

export const deleteVectors = async (ids: string[]): Promise<void> => {
  if (!ids.length) return;
  await getPineconeIndex().deleteMany(ids);
};
