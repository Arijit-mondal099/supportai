import { model, models, Schema, Types } from "mongoose";

export interface IChunk {
  botId: Types.ObjectId;
  documentId: Types.ObjectId;
  pineconeId: string;
  text: string;
  createdAt: Date;
}

const chunkSchema = new Schema<IChunk>(
  {
    botId: { type: Schema.Types.ObjectId, ref: "Chatbot", required: true, index: true },
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true, index: true },
    pineconeId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ChunkModel = models.Chunk || model<IChunk>("Chunk", chunkSchema);
