import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { OWNER } from "@/tests/helpers";

const mockRequireOwner = vi.hoisted(() => vi.fn());
const mockGetActivitySeries = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth", () => ({ requireOwner: mockRequireOwner }));
vi.mock("@/lib/analytics", () => ({
  getActivitySeries: mockGetActivitySeries,
  isActivityRange: (v: unknown) =>
    typeof v === "string" && ["today", "7d", "14d", "12m", "yearly"].includes(v),
}));

const getReq = (query = "") => new NextRequest(`https://example.com/api/analytics${query}`);

beforeEach(() => {
  vi.clearAllMocks();
  mockRequireOwner.mockReset().mockResolvedValue(OWNER);
  mockGetActivitySeries.mockReset().mockResolvedValue([{ label: "9/18", messages: 4 }]);
});

describe("GET /api/analytics", () => {
  it("returns 401 when not authenticated", async () => {
    mockRequireOwner.mockResolvedValue(null);

    const res = await GET(getReq("?range=7d"));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(mockGetActivitySeries).not.toHaveBeenCalled();
  });

  it("returns 400 for an unknown range", async () => {
    const res = await GET(getReq("?range=decade"));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(mockGetActivitySeries).not.toHaveBeenCalled();
  });

  it("defaults to the 14-day range when no range is given", async () => {
    const res = await GET(getReq());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: { range: "14d", points: [{ label: "9/18", messages: 4 }] },
    });
    expect(mockGetActivitySeries).toHaveBeenCalledWith("owner_1", "14d");
  });

  it("resolves each supported range for the session owner", async () => {
    for (const range of ["today", "7d", "14d", "12m", "yearly"]) {
      const res = await GET(getReq(`?range=${range}`));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.data.range).toBe(range);
      expect(mockGetActivitySeries).toHaveBeenCalledWith("owner_1", range);
    }
  });
});
