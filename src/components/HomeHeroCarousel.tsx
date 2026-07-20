"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroNewsItem = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
};

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value || fallback));
}

function href(item: HeroNewsItem) {
  return `/noticia/${item.slug || item.id}`;
}

export default function HomeHeroCarousel({ items }: { items: HeroNewsItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const goTo = (index: number) => setActive((index + items.length) % items.length);

  return (
    <section aria-label="Noticias principales" className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#10131b] shadow-2xl shadow-black/35 sm:min-h-[650px]">
      {items.map((item, index) => (
        <Link
          key={item.id}
          href={href(item)}
          className={`absolute inset-0 transition duration-700 ${index === active ? "visible opacity-100" : "invisible opacity-0"}`}
          aria-hidden={index !== active}
          tabIndex={index === active ? 0 : -1}
        >
          {item.featured_image ? (
            <Image
              src={item.featured_image}
              alt={item.title}
              fill
              priority={index === 0}
              sizes="(max-width: 1280px) 100vw, 68vw"
              className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.65),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(219,39,119,0.52),_transparent_40%),#10131d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/48 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-fuchsia-950/20" />

          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2 sm:left-7 sm:top-7">
            <span className="rounded-full bg-fuchsia-600 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] shadow-lg shadow-fuchsia-600/20">Portada</span>
            <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] backdrop-blur">{item.category || "Noticias"}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-fuchsia-300">Rhevolver informa</p>
            <h1 className="mt-3 max-w-5xl text-3xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">{item.title}</h1>
            {item.summary && <p className="mt-4 max-w-3xl line-clamp-3 text-sm leading-6 text-zinc-200 sm:text-lg sm:leading-8">{item.summary}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-zinc-300">
              <span>{item.author || "Rhevolver Media"}</span>
              <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
              <span>{formatDate(item.published_at, item.created_at)}</span>
              <span className="ml-auto hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 font-black backdrop-blur sm:inline-flex">Leer noticia →</span>
            </div>
          </div>
        </Link>
      ))}

      {items.length > 1 && (
        <>
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Noticia anterior" className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/35 text-xl backdrop-blur transition hover:bg-black/70 sm:grid">‹</button>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Noticia siguiente" className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/35 text-xl backdrop-blur transition hover:bg-black/70 sm:grid">›</button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">
            {items.map((item, index) => (
              <button key={item.id} type="button" onClick={() => goTo(index)} aria-label={`Mostrar noticia ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-fuchsia-400" : "w-4 bg-white/30 hover:bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
