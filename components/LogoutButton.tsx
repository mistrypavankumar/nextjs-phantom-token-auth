// app/dashboard/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });

      // Regardless of response body, go to login
      if (res.ok) router.replace("/login");
      else router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-r-transparent" />
      )}
      {loading ? "Logging out..." : "Logout"}
      {!loading && (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-slate-500"
          fill="currentColor"
        >
          <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z" />
          <path d="M20 3H10v2h10v14H10v2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      )}
    </button>
  );
}
