export const SUPPORTED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv"];

export class UnsupportedFileError extends Error {}

export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const arrayBuffer = await file.arrayBuffer();

  if (ext === "pdf") {
    const { extractText } = await import("unpdf");
    const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
    return text;
  }

  if (ext === "docx") {
    const { extractRawText } = await import("mammoth");
    const result = await extractRawText({ buffer: Buffer.from(arrayBuffer) });
    return result.value ?? "";
  }

  if (ext === "txt" || ext === "md" || ext === "csv") {
    return Buffer.from(arrayBuffer).toString("utf-8");
  }

  throw new UnsupportedFileError(ext);
};

export const parseNotionId = (input: string): string => {
  const clean = input.trim();
  if (clean.includes("notion.so") || clean.includes("notion.com")) {
    const match = clean.match(/([0-9a-fA-F]{32})/);
    if (match) return match[1].toLowerCase();
    throw new Error("Could not extract a valid Notion ID from the provided URL or ID.");
  }
  const stripped = clean.replace(/-/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(stripped)) return stripped.toLowerCase();
  throw new Error("Could not extract a valid Notion ID from the provided URL or ID.");
};

export const extractTextFromNotion = async (
  resourceId: string,
  resourceType: "page" | "database",
  notionToken: string,
): Promise<string> => {
  const { NotionAPILoader } = await import("@langchain/community/document_loaders/web/notionapi");
  const loader = new NotionAPILoader({
    clientOptions: { auth: notionToken },
    id: parseNotionId(resourceId),
    propertiesAsHeader: resourceType === "database",
  });
  const docs = await loader.load();
  return docs
    .map((d) => d.pageContent)
    .filter(Boolean)
    .join("\n\n");
};
