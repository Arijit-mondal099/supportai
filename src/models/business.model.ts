import { model, models, Schema } from "mongoose";

export interface IBusiness {
  ownerId: string;
  supportEmail: string;
  apiKey: string;
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
  knowledge: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: String, required: true, unique: true },
    supportEmail: { type: String, required: true, lowercase: true, trim: true, unique: true },
    apiKey: { type: String, required: true },
    businessInfo: {
      businessName: { type: String, required: true },
      industry: { type: String, required: true },
      description: { type: String, required: true },
    },
    botInfo: {
      botName: { type: String, required: true },
      communicationTone: { type: String, required: true },
      personalityDescription: { type: String, required: true },
    },
    knowledge: { type: String, required: true },
  },
  { timestamps: true },
);

export const BusinessModel = models.Business || model<IBusiness>("Business", businessSchema);
