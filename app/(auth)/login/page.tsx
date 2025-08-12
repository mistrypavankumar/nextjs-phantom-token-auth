// app/login/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!form.email || !form.password) {
      setErr("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Login failed. Please check your credentials.");
        return;
      }

      router.replace(next);
    } catch (e) {
      const error = e as Error;
      setErr(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute inset-x-0 top-[-8rem] -z-10 overflow-hidden blur-3xl">
        <div
          className="mx-auto aspect-[1150/400] w-[68rem] bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 opacity-60"
          style={{
            clipPath:
              "polygon(8% 20%, 22% 6%, 44% 11%, 66% 4%, 84% 14%, 91% 34%, 86% 56%, 69% 71%, 48% 76%, 26% 72%, 12% 56%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur">
          {/* Header */}
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-slate-900"
            >
              SecAuth
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back — log in to continue
            </p>
          </div>

          {/* Alert */}
          {err && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5"
                fill="currentColor"
              >
                <path d="M11 15h2v2h-2zm0-8h2v6h-2z" />
                <path d="M1 21h22L12 2 1 21z" />
              </svg>
              <span>{err}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <input
                  ref={emailRef}
                  id="email"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="email"
                  required
                  aria-invalid={!!err && !form.email ? "true" : "false"}
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 peer-focus:text-slate-500"
                  fill="currentColor"
                >
                  <path d="M12 12.713 1.2 6h21.6L12 12.713zM12 14.887 22.8 8v10.8H1.2V8L12 14.887z" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-11 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="current-password"
                  required
                  aria-invalid={!!err && !form.password ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-pressed={showPw}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    // Eye-off
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M2.1 3.51 3.51 2.1l18.38 18.38-1.41 1.41-2.34-2.34A11.5 11.5 0 0 1 12 20C6 20 1.73 15.64.46 12.82a2.4 2.4 0 0 1 0-1.64A13.59 13.59 0 0 1 6.1 5.62L2.1 3.51zM7.9 9.3l1.56 1.56a3 3 0 0 0 3.68 3.68l1.56 1.56A5 5 0 0 1 7.9 9.3zM12 6a5 5 0 0 1 5 5 5 5 0 0 1-.25 1.58l3.36 3.36A13.64 13.64 0 0 0 23.54 11a2.4 2.4 0 0 0 0-1.64C22.27 6.36 18 2 12 2a11.52 11.52 0 0 0-4.39.86l2.16 2.16A5 5 0 0 1 12 6z" />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M12 4.5c6 0 10.27 4.36 11.54 7.18.23.53.23 1.11 0 1.64C22.27 16.14 18 20.5 12 20.5S1.73 16.14.46 13.32a2.4 2.4 0 0 1 0-1.64C1.73 8.86 6 4.5 12 4.5zm0 2C7.52 6.5 3.9 9.79 2.62 12 3.9 14.21 7.52 17.5 12 17.5S20.1 14.21 21.38 12C20.1 9.79 16.48 6.5 12 6.5zm0 2.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 .001 3.999A2 2 0 0 0 12 11z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Row: Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
              aria-busy={loading}
            >
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px w-full bg-slate-200" />
            <span className="text-xs uppercase tracking-wider text-slate-400">
              or
            </span>
            <span className="h-px w-full bg-slate-200" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-slate-600">
            New here?{" "}
            <a
              href="/register"
              className="font-semibold text-slate-900 underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
