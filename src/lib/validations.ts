import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color (e.g. #e8440a)");

export const chatbotCreateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.enum(["draft", "live"]).optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  provider: z.enum(["gemini", "openai"]).optional(),
  model: z.string().optional(),
  apiKey: z.string().optional(),
  businessInfo: z
    .object({
      businessName: z.string().optional(),
      industry: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  botInfo: z
    .object({
      botName: z.string().optional(),
      communicationTone: z.string().optional(),
      personalityDescription: z.string().optional(),
    })
    .optional(),
});

export const chatbotUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.enum(["draft", "live"]).optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  provider: z.enum(["gemini", "openai"]).optional(),
  model: z.string().optional(),
  apiKey: z.string().optional(),
  businessInfo: z
    .object({
      businessName: z.string().optional(),
      industry: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  botInfo: z
    .object({
      botName: z.string().optional(),
      communicationTone: z.string().optional(),
      personalityDescription: z.string().optional(),
    })
    .optional(),
  appearance: z
    .object({
      accentColor: hexColor.optional(),
      avatarUrl: z.string().optional(),
      displayName: z.string().min(1).max(100).optional(),
      welcomeMessage: z.string().optional(),
    })
    .optional(),
});

export const chatRequestSchema = z
  .object({
    prompt: z.string().min(1, "prompt is required"),
    botId: z.string().optional(),
    ownerId: z.string().optional(),
    sessionId: z.string().optional(),
    preview: z.boolean().optional(),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "model"]),
          text: z.string(),
        }),
      )
      .optional(),
  })
  .refine((data) => data.botId || data.ownerId, {
    message: "Either botId or ownerId is required",
  });

export const documentUrlSchema = z.object({
  sourceType: z.literal("url"),
  title: z.string().optional(),
  url: z.string().url("A valid URL is required"),
});

export const documentTextSchema = z.object({
  sourceType: z.literal("text"),
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
});

export const documentCreateSchema = z.discriminatedUnion("sourceType", [
  documentUrlSchema,
  documentTextSchema,
]);
