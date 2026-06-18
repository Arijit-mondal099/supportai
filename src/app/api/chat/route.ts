import { db_connection } from "@/lib/db";
import { AccountModel } from "@/models/account.model";
import { ChatbotModel } from "@/models/chatbot.model";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, botId, ownerId } = (await request.json()) as {
      prompt?: string;
      botId?: string;
      ownerId?: string;
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

    const ai = new GoogleGenAI({ apiKey });

    const LLM = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: [],
      config: {
        systemInstruction: bot.knowledge,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const res = await LLM.sendMessage({ message: prompt });

    return NextResponse.json(
      {
        success: true,
        data: { role: "model", text: res.text! },
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
