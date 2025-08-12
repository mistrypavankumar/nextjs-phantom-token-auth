import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute inset-x-0 top-[-6rem] -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-1/2 aspect-[1100/400] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 via-indigo-200 to-cyan-200 opacity-60"
          style={{
            clipPath:
              "polygon(8% 20%, 22% 6%, 44% 11%, 66% 4%, 84% 14%, 91% 34%, 86% 56%, 69% 71%, 48% 76%, 26% 72%, 12% 56%)",
          }}
        />
      </div>

      {/* Container */}
      <div className="mx-auto w-[92%] max-w-6xl">
        {/* Hero */}
        <section className="grid items-center gap-8 py-10 grid-cols-1 md:grid-cols-2 md:py-16">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Secure auth for modern apps
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Ship fast without compromising security. SecAuth gives you session
              management, opaque tokens, and safe-by-default cookies—ready for
              production.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-white shadow-md transition hover:shadow-lg"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="group relative inline-flex items-center font-semibold text-slate-800"
              >
                Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-slate-900 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No credit card required • Works with Next.js App Router
            </p>
          </div>

          {/* Hero Card */}
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-lg backdrop-blur">
            <div className="rounded-xl bg-slate-900 p-4 text-slate-100">
              <div className="text-xs text-slate-400">/api/auth/session</div>
              <pre className="mt-2 overflow-x-auto text-sm leading-relaxed">
                {`Set-Cookie: access_token=opaque:3f2d...; HttpOnly; Secure; SameSite=Strict
200 OK
{
  "sub": "user_123",
  "scope": ["read:profile", "write:session"],
  "exp": 1723507200
}`}
              </pre>
            </div>
            <ul className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Opaque (phantom) tokens, no PII inside
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                HttpOnly + Secure cookies by default
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Introspection endpoint for minimal claims
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Drop-in Next.js middleware support
              </li>
            </ul>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 md:py-12">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Why SecAuth?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Production-grade sessions"
              desc="Cap concurrent sessions, rotate tokens, revoke instantly—without storing raw tokens."
            />
            <Feature
              title="Defense-in-depth"
              desc="SameSite=Strict cookies, CSRF-safe patterns, and strict schema validation."
            />
            <Feature
              title="Developer-friendly"
              desc="Simple APIs, clear examples, and patterns that fit your Next.js App Router."
            />
          </div>
        </section>

        {/* How it works */}
        <section className="py-10 md:py-14">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Get secure in 3 steps
          </h2>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-3">
            <Step index={1} title="Register">
              Create an account and set your app secrets.
            </Step>
            <Step index={2} title="Integrate">
              Add our auth routes & middleware to your Next.js app.
            </Step>
            <Step index={3} title="Ship">
              Deploy with confidence—tokens and cookies handled.
            </Step>
          </ol>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 shadow-sm transition hover:shadow-md"
            >
              Start free
            </Link>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mb-16 rounded-2xl bg-gradient-to-r from-slate-900 to-black px-6 py-10 text-white shadow-xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold">
                Ready to lock down your app?
              </h3>
              <p className="mt-1 text-slate-300">
                Join developers who ship authentication safely—without the yak
                shaving.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:opacity-90"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mb-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} SecAuth. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-700">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-slate-700">
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* --- Small presentational components --- */

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          {index}
        </span>
        <h4 className="text-base font-semibold">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </li>
  );
}
