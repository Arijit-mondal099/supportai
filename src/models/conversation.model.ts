import { model, models, Schema, Types } from "mongoose";

export interface IConversation {
  botId: Types.ObjectId;
  ownerId: string;
  sessionId: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    botId: { type: Schema.Types.ObjectId, ref: "Chatbot", required: true, index: true },
    ownerId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// One conversation per visitor session per bot.
conversationSchema.index({ botId: 1, sessionId: 1 }, { unique: true });

export const ConversationModel =
  models.Conversation || model<IConversation>("Conversation", conversationSchema);
