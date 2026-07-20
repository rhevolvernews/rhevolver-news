"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    router.push(`/buscar?q=${encodeURIComponent(value)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl items-center gap-3"
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar noticias..."
        className="flex-1 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-black outline-none focus:border-pink-500"
      />

      <button
        type="submit"
        className="rounded-xl bg-pink-600 px-6 py-3 font-bold text-white transition hover:bg-pink-700"
      >
        Buscar
      </button>
    </form>
  );
}