import { db_connection } from "@/lib/db";
import { AccountModel } from "@/models/account.model";
import { ChatbotModel } from "@/models/chatbot.model";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
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

    // Resolve the API key: per-bot override first, then the account-level key.
    let apiKey = bot.apiKeyOverride?.trim();
    if (!apiKey) {
      const account = await AccountModel.findOne({ ownerId: bot.ownerId });
      apiKey = account?.apiKey?.trim() || "";
    }
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "No API key configured for this chatbot." },
        { status: 400, headers: corsHeaders },
      );
    }

    // Load the existing conversation (if any) so the bot has multi-turn context.
    const conversation = sessionId?.trim()
      ? await ConversationModel.findOne({ botId: bot._id, sessionId })
      : null;

    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    if (conversation) {
      const prev = await MessageModel.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 })
        .limit(HISTORY_LIMIT)
        .lean();
      for (const m of prev) {
        history.push({ role: m.role === "model" ? "model" : "user", parts: [{ text: m.text }] });
      }
    }

    const ai = new GoogleGenAI({ apiKey });

    const LLM = ai.chats.create({
      model: "gemini-3-flash-preview",
      history,
      config: {
        systemInstruction: bot.knowledge,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const res = await LLM.sendMessage({ message: prompt });
    const reply = res.text ?? "";

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
      {
        success: true,
        data: { role: "model", text: reply },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error From AI Gen", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request.",
        error,
      },
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
