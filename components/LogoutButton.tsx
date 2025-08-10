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
      className="rounded border px-3 py-2 disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
