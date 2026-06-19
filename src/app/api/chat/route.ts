import { getChatModel } from "@/lib/ai";
import { db_connection } from "@/lib/db";
import { supportsEmbeddings } from "@/lib/options";
import { resolveProviderKey } from "@/lib/providerKey";
import { isRagConfigured, retrieve } from "@/lib/rag";
import { ChatbotModel } from "@/models/chatbot.model";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// How many prior messages to replay as context for multi-turn conversations.
const HISTORY_LIMIT = 20;

export async function POST(request: NextRequest) {
  try {
    const { prompt, botId, ownerId, sessionId } = (await request.json()) as {
      prompt?: string;
      botId?: string;
      ownerId?: string;
      sessionId?: string;
    };

    if (!prompt?.trim() || (!botId?.trim() && !ownerId?.trim())) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: prompt and botId." },
        { status: 400, headers: corsHeaders },
      );
    }

    await db_connection();

    // Resolve the chatbot by its id (preferred) or, for legacy data-owner-id
    // embeds, fall back to that owner's first live (else first) bot.
    let bot = botId && isValidObjectId(botId) ? await ChatbotModel.findById(botId) : null;
    if (!bot && ownerId) {
      bot = await ChatbotModel.findOne({ ownerId, status: "live" }).sort({ createdAt: 1 });
      if (!bot) bot = await ChatbotModel.findOne({ ownerId }).sort({ createdAt: 1 });
    }

    if (!bot) {
      return NextResponse.json(
        { success: false, message: "Chatbot not found." },
        { status: 404, headers: corsHeaders },
      );
    }

    const { provider, apiKey, model } = resolveProviderKey(bot);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "No API key configured for this chatbot." },
        { status: 400, headers: corsHeaders },
      );
    }

    // Replay prior messages of this session for multi-turn context.
    const conversation = sessionId?.trim()
      ? await ConversationModel.findOne({ botId: bot._id, sessionId })
      : null;

    const priorMessages = [];
    if (conversation) {
      const prev = await MessageModel.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 })
        .limit(HISTORY_LIMIT)
        .lean();
      for (const m of prev) {
        priorMessages.push(m.role === "model" ? new AIMessage(m.text) : new HumanMessage(m.text));
      }
    }

    // Ground the answer in the bot's knowledge base (best-effort).
    // Only providers with an embeddings API can run retrieval.
    let systemText = bot.knowledge;
    if (isRagConfigured() && supportsEmbeddings(provider)) {
      try {
        const snippets = await retrieve(provider, apiKey, String(bot._id), prompt, 5);
        if (snippets.length) {
          const block = snippets.map((s, i) => `[${i + 1}] ${s}`).join("\n\n");
          systemText = `Relevant knowledge (use this to answer accurately):\n${block}\n\n---\n\n${bot.knowledge}`;
        }
      } catch (ragErr) {
        console.error("RAG retrieve failed", ragErr);
      }
    }

    const chatModel = getChatModel(provider, apiKey, model);
    const result = await chatModel.invoke([
      new SystemMessage(systemText),
      ...priorMessages,
      new HumanMessage(prompt),
    ]);

    const content = result.content;
    const reply =
      typeof content === "string"
        ? content
        : content
            .map((part) =>
              typeof part === "string" ? part : "text" in part ? String(part.text ?? "") : "",
            )
            .join("");

    // Persist the exchange (best-effort; never fail the reply on a logging error).
    if (sessionId?.trim()) {
      try {
        const now = new Date();
        const convo = await ConversationModel.findOneAndUpdate(
          { botId: bot._id, sessionId },
          {
            $setOnInsert: { botId: bot._id, ownerId: bot.ownerId, sessionId, startedAt: now },
            $set: { lastMessageAt: now },
            $inc: { messageCount: 2 },
          },
          { new: true, upsert: true },
        );
        await MessageModel.insertMany([
          { conversationId: convo._id, botId: bot._id, role: "user", text: prompt },
          { conversationId: convo._id, botId: bot._id, role: "model", text: reply },
        ]);
      } catch (logErr) {
        console.error("Failed to log conversation", logErr);
      }
    }

    return NextResponse.json(
      { success: true, data: { role: "model", text: reply } },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error From AI Gen", error);

    return NextResponse.json(
      { success: false, message: "An error occurred while processing the request.", error },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
