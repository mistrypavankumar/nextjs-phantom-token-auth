// /middleware.ts
import { NextResponse, NextRequest } from "next/server";

const AUTH_PUBLIC = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/introspect",
  "/api/auth/authorize",
]);

function isAsset(path: string) {
  return (
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    path === "/favicon.ico" ||
    path.startsWith("/assets/")
  );
}

async function introspect(req: NextRequest, token: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
  const r = await fetch(`${base}/api/auth/introspect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  return r.json();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always let static assets and auth APIs through
  if (isAsset(pathname) || AUTH_PUBLIC.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("phantom_token")?.value || "";

  // Redirect authenticated users away from "/", "/login", "/register"
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const data = await introspect(req, token);
        if (data?.active) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch {}
    }
    return NextResponse.next();
  }

  // Protect everything else (your protected routes)
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const data = await introspect(req, token);
    if (!data?.active) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Forward minimal claims to downstream handlers/pages
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-sub", String(data.sub || ""));
    requestHeaders.set(
      "x-scope",
      Array.isArray(data.scope) ? data.scope.join(" ") : data.scope || ""
    );

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // include "/" so home is handled; add other protected prefixes
  matcher: [
    "/",
    "/dashboard",
    "/settings/:path*",
    "/api/private/:path*",
    "/login",
    "/register",
  ],
};
