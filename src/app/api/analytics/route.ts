import { getActivitySeries, isActivityRange } from "@/lib/analytics";
import { requireOwner } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const owner = await requireOwner();
  if (!owner) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const raw = request.nextUrl.searchParams.get("range") ?? "14d";
  if (!isActivityRange(raw)) {
    return NextResponse.json({ success: false, message: "Invalid range" }, { status: 400 });
  }

  const points = await getActivitySeries(owner.ownerId, raw);
  return NextResponse.json({ success: true, data: { range: raw, points } });
}
