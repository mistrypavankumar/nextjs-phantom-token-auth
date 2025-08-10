// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

  const onChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

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
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create your account</h1>

      {err && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Name (optional)
          </label>
          <input
            className="w-full rounded border p-2 outline-none focus:ring"
            placeholder="Jane Doe"
            value={form.name}
            onChange={onChange("name")}
            autoComplete="name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
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
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            className="w-full rounded border p-2 outline-none focus:ring"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange("password")}
            autoComplete="new-password"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Min 8 characters.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm Password
          </label>
          <input
            className="w-full rounded border p-2 outline-none focus:ring"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={onChange("confirmPassword")}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
    </main>
  );
}
