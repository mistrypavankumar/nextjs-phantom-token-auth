// app/dashboard/page.tsx
import { headers, cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

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

export default async function DashboardPage() {
  const { sub, scope } = await getIdentity();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Signed in as <span className="font-mono">{sub || "unknown"}</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Scope: {scope.length ? scope.join(" ") : "none"}
      </p>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}
