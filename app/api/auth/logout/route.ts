// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import AccessToken from "@/models/AccessToken";
import { hashOpaqueToken } from "@/lib/opaque";
import { connectToDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await connectToDatabase();

  const cookie = req.headers.get("cookie") || "";
  const opaque = /phantom_token=([^;]+)/.exec(cookie)?.[1];

  if (opaque) {
    const tokenHash = hashOpaqueToken(opaque);
    await AccessToken.updateOne({ tokenHash }, { $set: { revoked: true } });
  }

  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.cookies.set("phantom_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
