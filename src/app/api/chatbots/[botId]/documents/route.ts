import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { resolveProviderKey } from "@/lib/providerKey";
import { addDocuments, isRagConfigured, splitText } from "@/lib/rag";
import { ChatbotModel } from "@/models/chatbot.model";
import { ChunkModel } from "@/models/chunk.model";
import { DocumentModel } from "@/models/document.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ botId: string }>;
}

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const notFound = () =>
  NextResponse.json({ success: false, message: "Chatbot not found" }, { status: 404 });

const bad = (message: string) => NextResponse.json({ success: false, message }, { status: 400 });

const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function GET(_request: NextRequest, { params }: Params) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const { botId } = await params;
  if (!isValidObjectId(botId)) return notFound();

  await db_connection();
  const bot = await ChatbotModel.findOne({ _id: botId, ownerId: owner.ownerId }).select("_id");
  if (!bot) return notFound();

  const documents = await DocumentModel.find({ botId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    documents: documents.map((d) => ({
      _id: String(d._id),
      title: d.title,
      sourceType: d.sourceType,
      status: d.status,
      chunkCount: d.chunkCount,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    })),
  });
}

export async function POST(request: NextRequest, { params }: Params) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const { botId } = await params;
  if (!isValidObjectId(botId)) return notFound();

  if (!isRagConfigured()) {
    return bad("Knowledge base is not configured on this server (Pinecone).");
  }

  const { sourceType, title, content, url } = (await request.json()) as {
    sourceType?: "text" | "url";
    title?: string;
    content?: string;
    url?: string;
  };

  await db_connection();
  const bot = await ChatbotModel.findOne({ _id: botId, ownerId: owner.ownerId });
  if (!bot) return notFound();

  const { provider, apiKey } = await resolveProviderKey(bot);
  if (!apiKey) return bad("Add an API key in Account settings first.");

  // Resolve the raw text to ingest.
  let text = "";
  let resolvedTitle = title?.trim() || "";
  if (sourceType === "url") {
    if (!url?.trim()) return bad("A URL is required.");
    try {
      const html = await fetch(url).then((r) => r.text());
      text = stripHtml(html);
    } catch {
      return bad("Could not fetch the provided URL.");
    }
    if (!resolvedTitle) resolvedTitle = url;
  } else {
    if (!content?.trim()) return bad("Content is required.");
    text = content;
    if (!resolvedTitle) resolvedTitle = "Pasted text";
  }

  const chunks = await splitText(text);
  if (!chunks.length) return bad("No usable text found to index.");

  const doc = await DocumentModel.create({
    botId: bot._id,
    ownerId: owner.ownerId,
    title: resolvedTitle,
    sourceType: sourceType === "url" ? "url" : "text",
    status: "processing",
  });

  try {
    const records = chunks.map((c, i) => ({ id: `${doc._id}_${i}`, text: c }));
    await addDocuments(provider, apiKey, String(bot._id), String(doc._id), records);
    await ChunkModel.insertMany(
      records.map((r) => ({
        botId: bot._id,
        documentId: doc._id,
        pineconeId: r.id,
        text: r.text,
      })),
    );
    doc.status = "ready";
    doc.chunkCount = records.length;
    await doc.save();
  } catch (error) {
    console.error("Document ingestion failed", error);
    doc.status = "error";
    await doc.save();
    return NextResponse.json(
      { success: false, message: "Failed to index the document." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      document: {
        _id: String(doc._id),
        title: doc.title,
        sourceType: doc.sourceType,
        status: doc.status,
        chunkCount: doc.chunkCount,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
      },
    },
    { status: 201 },
  );
}
