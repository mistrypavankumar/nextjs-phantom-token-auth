import { cookies, headers } from "next/headers";
import Link from "next/link";

async function getIdentity() {
  // Prefer claims forwarded by middleware
  const h = await headers();
  const sub = h.get("x-sub");
  const scopeStr = h.get("x-scope") || "";
  if (sub) {
    return { sub, scope: scopeStr.split(" ").filter(Boolean) };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("phantom_token")?.value;
  if (!token) return { sub: "", scope: [] };

  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const r = await fetch(`${base}/api/auth/introspect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    const data = await r.json();
    if (data?.active) {
      return { sub: String(data.sub || ""), scope: data.scope || [] };
    }
  } catch {
    console.error("Failed to introspect token");
  }
  return { sub: "", scope: [] };
}

export default async function Navbar() {
  const { sub } = await getIdentity();

  return (
    <div className="w-full">
      <nav className="mx-auto w-full md:w-[90%] px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-gray-900 font-extrabold text-3xl tracking-tight transition-colors duration-300"
          aria-label="SecAuth home"
        >
          SecAuth
        </Link>

        {!sub ? (
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-gray-800 font-semibold text-lg relative group"
            >
              Login
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full font-semibold text-white bg-black/80 hover:bg-black shadow-md transition-all duration-300"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href="/profile"
              className="text-gray-800 font-semibold text-lg relative group"
            >
              Profile
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
