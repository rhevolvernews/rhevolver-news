"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "No fue posible iniciar sesión.");
        return;
      }

      const nextPath = searchParams.get("next") || "/admin";
      router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("No fue posible conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-zinc-300">Usuario</span>
        <input
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/20"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-zinc-300">Contraseña</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/20"
          required
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-black shadow-lg shadow-pink-500/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Verificando…" : "Entrar al Dashboard"}
      </button>
    </form>
  );
}
