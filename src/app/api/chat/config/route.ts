import { db_connection } from "@/lib/db";
import { ChatbotModel } from "@/models/chatbot.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Public endpoint the embedded widget calls on load to theme itself.
// Returns appearance only — never any keys or business config.
export async function GET(request: NextRequest) {
  const botId = request.nextUrl.searchParams.get("botId");

  if (!botId || !isValidObjectId(botId)) {
    return NextResponse.json(
      { success: false, message: "Invalid botId" },
      { status: 400, headers: corsHeaders },
    );
  }

  await db_connection();
  const bot = await ChatbotModel.findOne({ _id: botId, status: "live" }).select("appearance").lean();

  if (!bot) {
    return NextResponse.json(
      { success: false, message: "Chatbot not found" },
      { status: 404, headers: corsHeaders },
    );
  }

  return NextResponse.json(
    { success: true, appearance: bot.appearance },
    { status: 200, headers: corsHeaders },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
