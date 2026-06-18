import { model, models, Schema, Types } from "mongoose";

export interface IMessage {
  conversationId: Types.ObjectId;
  botId: Types.ObjectId;
  role: "user" | "model";
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    botId: { type: Schema.Types.ObjectId, ref: "Chatbot", required: true, index: true },
    role: { type: String, enum: ["user", "model"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const MessageModel = models.Message || model<IMessage>("Message", messageSchema);
