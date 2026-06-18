import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { deleteVectors } from "@/lib/rag";
import { ChatbotModel } from "@/models/chatbot.model";
import { ChunkModel } from "@/models/chunk.model";
import { DocumentModel } from "@/models/document.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ botId: string; docId: string }>;
}

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const notFound = () => NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

export async function DELETE(_request: NextRequest, { params }: Params) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const { botId, docId } = await params;
  if (!isValidObjectId(botId) || !isValidObjectId(docId)) return notFound();

  await db_connection();
  const bot = await ChatbotModel.findOne({ _id: botId, ownerId: owner.ownerId }).select("_id");
  if (!bot) return notFound();

  const doc = await DocumentModel.findOne({ _id: docId, botId });
  if (!doc) return notFound();

  const chunks = await ChunkModel.find({ documentId: docId }).select("pineconeId").lean();
  const ids = chunks.map((c) => c.pineconeId).filter(Boolean);

  // Remove vectors first (best-effort), then the Mongo mirrors.
  try {
    await deleteVectors(ids);
  } catch (error) {
    console.error("Pinecone delete failed", error);
  }
  await ChunkModel.deleteMany({ documentId: docId });
  await DocumentModel.deleteOne({ _id: docId, botId });

  return NextResponse.json({ success: true, message: "Document deleted" });
}
