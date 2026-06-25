import { z } from "zod";

const envSchema = z.object({
  API_URI: z.string().url(),
  SCALEKIT_ENVIRONMENT_URL: z.string().min(1, "SCALEKIT_ENVIRONMENT_URL is required"),
  SCALEKIT_CLIENT_ID: z.string().min(1, "SCALEKIT_CLIENT_ID is required"),
  SCALEKIT_CLIENT_SECRET: z.string().min(1, "SCALEKIT_CLIENT_SECRET is required"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX: z.string().optional(),
});

export const ENV = envSchema.parse({
  API_URI: process.env.NEXT_PUBLIC_API_URI,
  SCALEKIT_ENVIRONMENT_URL: process.env.SCALEKIT_ENVIRONMENT_URL,
  SCALEKIT_CLIENT_ID: process.env.SCALEKIT_CLIENT_ID,
  SCALEKIT_CLIENT_SECRET: process.env.SCALEKIT_CLIENT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
});
