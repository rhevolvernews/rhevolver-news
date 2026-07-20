"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  category: string | null;
  featured_image: string | null;
};

export default function SearchBar() {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const value = search.trim();

    if (value.length < 2) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as { results?: Suggestion[] };
        setResults(payload.results ?? []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function submit(value = search) {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setOpen(false);
    router.push(`/buscar?q=${encodeURIComponent(cleanValue)}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const item = results[activeIndex];
      router.push(`/noticia/${item.slug || item.id}`);
      setOpen(false);
    }

    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        role="search"
        className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-[#0b0e15] p-2 shadow-2xl shadow-black/20 sm:gap-3 sm:p-3"
      >
        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center text-zinc-500">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </span>

        <label htmlFor="rhevolver-search" className="sr-only">
          Buscar noticias en Rhevolver
        </label>
        <input
          id="rhevolver-search"
          type="search"
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);
            if (value.trim().length < 2) {
              setResults([]);
              setOpen(false);
              setLoading(false);
              setActiveIndex(-1);
            }
          }}
          onFocus={() => search.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar noticias, temas, lugares o autores..."
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-zinc-600 sm:text-base"
        />

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setResults([]);
              setOpen(false);
            }}
            className="hidden h-10 w-10 place-items-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-white sm:grid"
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}

        <button
          type="submit"
          className="rounded-xl bg-[var(--rhevolver-pink)] px-4 py-3 text-sm font-black text-white shadow-lg shadow-pink-700/20 transition hover:-translate-y-0.5 hover:bg-[var(--rhevolver-pink-dark)] sm:px-7"
        >
          Buscar
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+0.65rem)] z-40 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e15]/98 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[var(--rhevolver-pink)]">
              Sugerencias
            </p>
            {loading && <span className="text-xs text-zinc-600">Buscando…</span>}
          </div>

          <div id={listboxId} role="listbox" className="max-h-[28rem] overflow-y-auto p-2">
            {!loading && results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-bold text-zinc-300">No encontramos coincidencias rápidas</p>
                <button
                  type="button"
                  onClick={() => submit()}
                  className="mt-2 text-sm font-bold text-[var(--rhevolver-pink)]"
                >
                  Ver búsqueda completa
                </button>
              </div>
            ) : (
              results.map((item, index) => (
                <Link
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  key={item.id}
                  href={`/noticia/${item.slug || item.id}`}
                  onClick={() => setOpen(false)}
                  className={`grid grid-cols-[64px_1fr] gap-3 rounded-xl p-2 transition sm:grid-cols-[78px_1fr] ${
                    activeIndex === index ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="relative h-16 overflow-hidden rounded-lg bg-zinc-900 sm:h-[4.5rem]">
                    {item.featured_image ? (
                      <Image
                        src={item.featured_image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-blue-700/30 to-pink-600/30 font-black">
                        R.
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 py-1">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-[var(--rhevolver-pink)]">
                      {item.category || "Noticias"}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-zinc-100">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>

          {results.length > 0 && (
            <button
              type="button"
              onClick={() => submit()}
              className="block w-full border-t border-white/10 px-4 py-3 text-center text-sm font-black text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Ver todos los resultados →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
