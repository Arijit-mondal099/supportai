import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the document parsers out of the server bundle — pdf-parse/pdfjs ship
  // their own workers and don't bundle cleanly.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "mammoth", "@napi-rs/canvas"],
};

export default nextConfig;
