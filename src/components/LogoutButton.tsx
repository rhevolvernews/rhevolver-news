"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {loading ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
