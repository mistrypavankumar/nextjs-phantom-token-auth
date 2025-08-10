import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name } = RegisterSchema.parse(body);

    await connectToDatabase();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
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
