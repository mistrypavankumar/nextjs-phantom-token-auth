import { connectToDatabase } from "@/lib/db";
import { hashOpaqueToken } from "@/lib/opaque";
import AccessToken from "@/models/AccessToken";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    await connectToDatabase();

    const tokenHash = hashOpaqueToken(token);

    const t = await AccessToken.findOne({ tokenHash }).lean<{
      revoked?: boolean;
      expiresAt?: Date;
      userId?: string;
      scope?: string[];
    } | null>();

    // NOTE: use expiresAt + scope (not expires/scopes)
    if (
      !t ||
      t.revoked ||
      !t.expiresAt ||
      t.expiresAt.getTime() <= Date.now()
    ) {
      return NextResponse.json({ active: false }, { status: 200 });
    }

    return NextResponse.json({
      active: true,
      sub: String(t.userId),
      scope: t.scope ?? [],
      exp: Math.floor(t.expiresAt.getTime() / 1000),
    });
  } catch (error) {
    let msg = "Invalid input";
    if (
      error &&
      typeof error === "object" &&
      "issues" in error &&
      Array.isArray((error as { issues?: unknown }).issues)
    ) {
      msg =
        (error as { issues: { message?: string }[] }).issues[0]?.message || msg;
    } else if (error instanceof Error) {
      msg = error.message;
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
