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
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute inset-x-0 top-[-8rem] -z-10 overflow-hidden blur-3xl">
        <div
          className="mx-auto aspect-[1150/400] w-[68rem] bg-gradient-to-tr from-blue-200 via-indigo-200 to-cyan-200 opacity-60"
          style={{
            clipPath:
              "polygon(8% 20%, 22% 6%, 44% 11%, 66% 4%, 84% 14%, 91% 34%, 86% 56%, 69% 71%, 48% 76%, 26% 72%, 12% 56%)",
          }}
        />
      </div>

      <div className="mx-auto w-[92%] max-w-6xl py-10">
        {/* Heading */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-600">
            Welcome back. Here’s your current session and quick actions.
          </p>
        </header>

        {/* Identity Card */}
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Signed in as
              </h2>
              <p className="mt-1 font-mono text-sm text-slate-800">
                {sub || "unknown"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Scope:{" "}
                {scope.length ? (
                  <span className="sr-only">Has scopes</span>
                ) : (
                  "none"
                )}
              </p>

              {scope.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {scope.map((s: string) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <LogoutButton />
            </div>
          </div>

          {/* Session status */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Session status"
              value={sub ? "Active" : "Unknown"}
              ok={!!sub}
            />
            <Stat
              label="Scopes"
              value={scope.length ? `${scope.length} granted` : "None"}
              ok={scope.length > 0}
            />
            <Stat label="Cookie" value="HttpOnly • Secure" ok />
          </div>
        </section>

        {/* Grid: Quick actions + Security tips */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Quick actions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Quick actions
            </h3>
            <ul className="mt-4 grid gap-3">
              <li>
                <a
                  href="/profile"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">
                    View profile
                  </span>
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <a
                  href="/sessions"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">
                    Manage sessions
                  </span>
                  <ArrowIcon />
                </a>
              </li>
              <li>
                <a
                  href="/settings/security"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">
                    Security settings
                  </span>
                  <ArrowIcon />
                </a>
              </li>
            </ul>
          </section>

          {/* Security tips */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Security tips
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Dot ok />
                Use strong, unique passwords (12+ chars) and a manager.
              </li>
              <li className="flex items-start gap-2">
                <Dot ok />
                Revoke unused sessions regularly.
              </li>
              <li className="flex items-start gap-2">
                <Dot ok />
                Keep your browser up to date for latest security fixes.
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SecAuth. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

/* --- Tiny presentational bits --- */
function Stat({
  label,
  value,
  ok = false,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{label}</p>
        <span
          className={`h-2 w-2 rounded-full ${
            ok ? "bg-emerald-500" : "bg-slate-300"
          }`}
          aria-hidden
        />
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
    </svg>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
        ok ? "bg-emerald-500" : "bg-slate-300"
      }`}
      aria-hidden
    />
  );
}
