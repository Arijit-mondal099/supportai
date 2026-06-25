import { ENV } from "@/lib/env";
import { getScalekit } from "@/lib/scalekit";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Faild to login try again" },
        { status: 400 },
      );
    }

    const session = await getScalekit().authenticateWithCode(
      code,
      `${ENV.API_URI}/api/auth/verify`,
    );

    const cookieStore = await cookies();

    cookieStore.set("access_token", session.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.redirect(`${ENV.API_URI}/dashboard`);
  } catch (error) {
    console.log("Error validation", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
