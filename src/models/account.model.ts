import { model, models, Schema } from "mongoose";

export interface IAccount {
  ownerId: string;
  email: string;
  provider: "gemini" | "openai";
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    ownerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    provider: { type: String, enum: ["gemini", "openai"], default: "gemini" },
    apiKey: { type: String, default: "" },
  },
  { timestamps: true },
);

export const AccountModel = models.Account || model<IAccount>("Account", accountSchema);
