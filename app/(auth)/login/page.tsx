// app/login/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Log in</h1>

      {err && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            className="w-full rounded border p-2 outline-none focus:ring"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange("email")}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="flex">
            <input
              id="password"
              className="w-full rounded-l border p-2 outline-none focus:ring"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={onChange("password")}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded-r border border-l-0 px-3 text-sm"
              aria-pressed={showPw}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        New here?{" "}
        <a href="/register" className="text-blue-600 underline">
          Create an account
        </a>
      </p>
    </main>
  );
}
