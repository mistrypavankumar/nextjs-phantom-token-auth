import crypto from "crypto";

export function generateOpaqueToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashOpaqueToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("base64url");
}

export function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}
