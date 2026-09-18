import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { BOT_ID, makeChain } from "@/tests/helpers";
import { GET, OPTIONS } from "./route";

// ---------------------------------------------------------------------------
// Mocks (hoisted so they are installed before `route` imports its deps)
// ---------------------------------------------------------------------------
const mockDb = vi.hoisted(() => vi.fn().mockResolvedValue({}));
const mockCacheGet = vi.hoisted(() => vi.fn());
const mockCacheSet = vi.hoisted(() => vi.fn());
const mockFindOne = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db", () => ({ db_connection: mockDb }));
vi.mock("@/lib/cache", () => ({
  Cache: { get: mockCacheGet, set: mockCacheSet },
}));
vi.mock("@/models/chatbot.model", () => ({
  ChatbotModel: { findOne: mockFindOne },
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const appearance = {
  greeting: "Hi there,",
  headline: "Welcome back! How can I help?",
  placeholder: "Ask me anything...",
  prompts: [{ label: "FAQs", prompt: "Show me your FAQs" }],
};

const getReq = (query: string) => new NextRequest(`https://example.com/api/chat/config${query}`);

beforeEach(() => {
  vi.clearAllMocks();
  mockDb.mockResolvedValue({});
  mockCacheGet.mockResolvedValue(null);
  mockCacheSet.mockResolvedValue(undefined);
});

describe("GET /api/chat/config", () => {
  it("rejects a missing botId without cache headers", async () => {
    const res = await GET(getReq(""));
    expect(res.status).toBe(400);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("cache-control")).toBeNull();
  });

  it("rejects a malformed botId", async () => {
    const res = await GET(getReq("?botId=not-an-id"));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ success: false });
  });

  it("serves a cached appearance as non-cacheable (no edge caching)", async () => {
    mockCacheGet.mockResolvedValue({ appearance });
    const res = await GET(getReq(`?botId=${BOT_ID}`));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, appearance });
    // Regression guard: appearance edits must reach embeds on the next load,
    // so the endpoint must never become edge-cacheable again.
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("falls through to Mongo on a cache miss and repopulates the cache", async () => {
    mockFindOne.mockReturnValue(makeChain({ _id: BOT_ID, appearance }));
    const res = await GET(getReq(`?botId=${BOT_ID}`));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, appearance });
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(mockCacheSet).toHaveBeenCalledWith(`cache:bot_config:${BOT_ID}`, { appearance }, 300);
  });

  it("reports an unpublished bot distinctly", async () => {
    mockFindOne
      .mockReturnValueOnce(makeChain(null))
      .mockReturnValueOnce(makeChain({ _id: BOT_ID }));
    const res = await GET(getReq(`?botId=${BOT_ID}`));

    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({
      success: false,
      message: "This chatbot is not published yet.",
    });
  });

  it("reports an unknown bot distinctly", async () => {
    mockFindOne.mockReturnValueOnce(makeChain(null)).mockReturnValueOnce(makeChain(null));
    const res = await GET(getReq(`?botId=${BOT_ID}`));

    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({
      success: false,
      message: "Chatbot not found.",
    });
  });
});

describe("OPTIONS /api/chat/config", () => {
  it("answers the CORS preflight", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});
