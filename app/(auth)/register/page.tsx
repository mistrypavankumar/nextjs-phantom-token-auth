// app/register/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  // Simple strength calc (0-4)
  const strength = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d|[^\w\s]/.test(p)) s++;
    return s;
  }, [form.password]);

  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
    strength
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!form.email || !form.password) {
      setErr("Email and password are required.");
      return;
    }
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/login");
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

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur">
          {/* Header */}
          <div className="mb-6 text-center">
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-slate-900"
            >
              SecAuth
            </Link>
            <h1 className="mt-2 text-xl font-semibold">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">
              Start secure authentication in minutes
            </p>
          </div>

          {/* Error */}
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
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">
                Name (optional)
              </label>
              <div className="relative">
                <input
                  id="name"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={onChange("name")}
                  autoComplete="name"
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 peer-focus:text-slate-500"
                  fill="currentColor"
                >
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pl-10 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="email"
                  required
                />
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 peer-focus:text-slate-500"
                  fill="currentColor"
                >
                  <path d="M12 12.713 1.2 6h21.6L12 12.713zM12 14.887 22.8 8v10.8H1.2V8L12 14.887z" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="pw">
                Password
              </label>
              <div className="relative">
                <input
                  id="pw"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-11 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="new-password"
                  required
                  aria-describedby="pw-hint"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-pressed={showPw}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M2.1 3.51 3.51 2.1l18.38 18.38-1.41 1.41-2.34-2.34A11.5 11.5 0 0 1 12 20C6 20 1.73 15.64.46 12.82a2.4 2.4 0 0 1 0-1.64A13.59 13.59 0 0 1 6.1 5.62L2.1 3.51zM7.9 9.3l1.56 1.56a3 3 0 0 0 3.68 3.68l1.56 1.56A5 5 0 0 1 7.9 9.3zM12 6a5 5 0 0 1 5 5 5 5 0 0 1-.25 1.58l3.36 3.36A13.64 13.64 0 0 0 23.54 11a2.4 2.4 0 0 0 0-1.64C22.27 6.36 18 2 12 2a11.52 11.52 0 0 0-4.39.86l2.16 2.16A5 5 0 0 1 12 6z" />
                    </svg>
                  ) : (
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
              {/* Strength meter */}
              <div className="mt-2">
                <div className="flex h-1.5 overflow-hidden rounded bg-slate-200">
                  <span
                    className={`w-1/4 ${strength >= 1 ? "bg-red-500" : ""}`}
                  />
                  <span
                    className={`w-1/4 ${strength >= 2 ? "bg-orange-500" : ""}`}
                  />
                  <span
                    className={`w-1/4 ${strength >= 3 ? "bg-amber-500" : ""}`}
                  />
                  <span
                    className={`w-1/4 ${strength >= 4 ? "bg-emerald-500" : ""}`}
                  />
                </div>
                <p id="pw-hint" className="mt-1 text-xs text-slate-500">
                  {strengthLabel} • Use at least 8 characters with a mix of
                  upper/lowercase and numbers/symbols.
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="cpw">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="cpw"
                  className="peer w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-11 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  type={showPw2 ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={onChange("confirmPassword")}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-pressed={showPw2}
                  aria-label={
                    showPw2 ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {showPw2 ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M2.1 3.51 3.51 2.1l18.38 18.38-1.41 1.41-2.34-2.34A11.5 11.5 0 0 1 12 20C6 20 1.73 15.64.46 12.82a2.4 2.4 0 0 1 0-1.64A13.59 13.59 0 0 1 6.1 5.62L2.1 3.51z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M12 4.5c6 0 10.27 4.36 11.54 7.18.23.53.23 1.11 0 1.64C22.27 16.14 18 20.5 12 20.5S1.73 16.14.46 13.32a2.4 2.4 0 0 1 0-1.64C1.73 8.86 6 4.5 12 4.5z" />
                    </svg>
                  )}
                </button>
              </div>
              {form.confirmPassword &&
                form.confirmPassword !== form.password && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords don’t match.
                  </p>
                )}
            </div>

            {/* TOS Row (optional) */}
            <div className="flex items-center gap-2">
              <input
                id="tos"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                required
              />
              <label htmlFor="tos" className="text-sm text-slate-700">
                I agree to the{" "}
                <a href="/terms" className="underline hover:opacity-80">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:opacity-80">
                  Privacy Policy
                </a>
                .
              </label>
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
              {loading ? "Creating..." : "Register"}
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

          {/* Login */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-slate-900 underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
