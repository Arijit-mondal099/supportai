import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const SUPPORTED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv"];

export class UnsupportedFileError extends Error {}

// Extract plain text from an uploaded file (PDF, Word .docx, or plain text).
export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const arrayBuffer = await file.arrayBuffer();

  if (ext === "pdf") {
    const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
    const result = await parser.getText();
    return result.text ?? "";
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
    return result.value ?? "";
  }

  if (ext === "txt" || ext === "md" || ext === "csv") {
    return Buffer.from(arrayBuffer).toString("utf-8");
  }

  throw new UnsupportedFileError(ext);
};
