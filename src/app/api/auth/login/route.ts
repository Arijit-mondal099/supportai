import { ENV } from "@/lib/env";
import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const URL = scalekit.getAuthorizationUrl(`${ENV.API_URI}/api/auth/verify`);

    if (!URL) {
      return NextResponse.json(
        { success: false, message: "faild to login try again" },
        { status: 400 },
      );
    }

    return NextResponse.redirect(URL);
  } catch (error) {
    console.error("Error for login", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
