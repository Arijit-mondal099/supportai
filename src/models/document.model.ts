import { model, models, Schema, Types } from "mongoose";

export interface IDocument {
  botId: Types.ObjectId;
  ownerId: string;
  title: string;
  sourceType: "file" | "url" | "text" | "notion";
  status: "processing" | "ready" | "error";
  chunkCount: number;
  notionResourceId?: string;
  notionResourceType?: "page" | "database";
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    botId: { type: Schema.Types.ObjectId, ref: "Chatbot", required: true, index: true },
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    sourceType: { type: String, enum: ["file", "url", "text", "notion"], required: true },
    notionResourceId: { type: String },
    notionResourceType: { type: String, enum: ["page", "database"] },
    status: { type: String, enum: ["processing", "ready", "error"], default: "processing" },
    chunkCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const DocumentModel = models.Document || model<IDocument>("Document", documentSchema);
