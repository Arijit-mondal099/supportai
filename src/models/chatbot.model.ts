import { model, models, Schema } from "mongoose";

export interface IChatbot {
  ownerId: string;
  name: string;
  status: "draft" | "live";
  supportEmail: string;
  /** AI provider used by this bot. */
  provider: "gemini" | "openai" | "anthropic" | "groq";
  /** Specific model/version for the provider (empty = provider default). */
  model: string;
  /** This bot's own API key. */
  apiKeyOverride?: string;
  businessInfo: {
    businessName: string;
    industry: string;
    description: string;
  };
  botInfo: {
    botName: string;
    communicationTone: string;
    personalityDescription: string;
  };
  appearance: {
    accentColor: string;
    avatarUrl: string;
    displayName: string;
    welcomeMessage: string;
  };
  knowledge: string;
  createdAt: Date;
  updatedAt: Date;
}

export const APPEARANCE_DEFAULTS = {
  accentColor: "#e8440a",
  avatarUrl: "",
  displayName: "Support Agent",
  welcomeMessage: "Hello! How can I assist you today?",
};

const chatbotSchema = new Schema<IChatbot>(
  {
    ownerId: { type: String, required: true, index: true },
    name: { type: String, required: true, default: "Untitled chatbot", trim: true },
    status: { type: String, enum: ["draft", "live"], default: "draft" },
    supportEmail: { type: String, lowercase: true, trim: true, default: "" },
    provider: {
      type: String,
      enum: ["gemini", "openai", "anthropic", "groq"],
      default: "gemini",
    },
    model: { type: String, default: "" },
    apiKeyOverride: { type: String, default: "" },
    businessInfo: {
      businessName: { type: String, default: "" },
      industry: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    botInfo: {
      botName: { type: String, default: "" },
      communicationTone: { type: String, default: "" },
      personalityDescription: { type: String, default: "" },
    },
    appearance: {
      accentColor: { type: String, default: APPEARANCE_DEFAULTS.accentColor },
      avatarUrl: { type: String, default: APPEARANCE_DEFAULTS.avatarUrl },
      displayName: { type: String, default: APPEARANCE_DEFAULTS.displayName },
      welcomeMessage: { type: String, default: APPEARANCE_DEFAULTS.welcomeMessage },
    },
    knowledge: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ChatbotModel = models.Chatbot || model<IChatbot>("Chatbot", chatbotSchema);
