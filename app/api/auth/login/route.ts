// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import AccessToken from "@/models/AccessToken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateOpaqueToken, hashOpaqueToken, addSeconds } from "@/lib/opaque";

export const runtime = "nodejs";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const ACCESS_TTL_SEC = 60 * 30; // 30 minutes

// cap concurrent sessions per user
const MAX_ACTIVE_TOKENS = Number(process.env.MAX_ACTIVE_TOKENS ?? "5");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = LoginSchema.parse(body);

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Cap active sessions: revoke oldest if exceeding MAX_ACTIVE_TOKENS
    const active = await AccessToken.find({
      userId: user._id,
      revoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ expiresAt: 1 }) // oldest first
      .select("_id");

    if (active.length >= MAX_ACTIVE_TOKENS) {
      const toRevoke = active.slice(0, active.length - (MAX_ACTIVE_TOKENS - 1));
      if (toRevoke.length) {
        await AccessToken.updateMany(
          { _id: { $in: toRevoke.map((d) => d._id) } },
          { $set: { revoked: true } }
        );
      }
    }

    // Issue opaque token & store only its hash
    const opaque = generateOpaqueToken();
    const tokenHash = hashOpaqueToken(opaque);
    const expiresAt = addSeconds(new Date(), ACCESS_TTL_SEC);

    await AccessToken.create({
      tokenHash,
      userId: user._id,
      scope: ["read"],
      expiresAt,
      revoked: false,
    });

    const res = NextResponse.json({ message: "Logged in" }, { status: 200 });
    res.cookies.set("phantom_token", opaque, {
      ...cookieBase,
      maxAge: ACCESS_TTL_SEC,
    });

    return res;
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
