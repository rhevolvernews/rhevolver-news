"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import VideoIndicator from "@/components/VideoIndicator";

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
  content?: string | null;
};

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value || fallback));
}

function hasVideo(item: HeroNewsItem) {
  return /<video[\s>]|data-video-embed=["\']true["\']|<!--RHEVOLVER_VIDEO:/i.test(item.content || "");
}

function href(item: HeroNewsItem) {
  return `/noticia/${item.slug || item.id}`;
}

export default function HomeHeroCarousel({ items }: { items: HeroNewsItem[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % items.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const goTo = (index: number) => {
    const next = (index + items.length) % items.length;
    if (next === active) return;
    const forwardDistance = (next - active + items.length) % items.length;
    const backwardDistance = (active - next + items.length) % items.length;
    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setActive(next);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    touchStartX.current = event.clientX;
    touchDeltaX.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (touchStartX.current === null || event.pointerType === "mouse") return;
    touchDeltaX.current = event.clientX - touchStartX.current;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (touchStartX.current === null || event.pointerType === "mouse") return;
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (Math.abs(delta) < 44) return;
    goTo(active + (delta < 0 ? 1 : -1));
  };

  return (
    <section
      aria-label="Noticias principales"
      className="rhevolver-hero rhevolver-hero-ultimate relative min-h-[560px] overflow-hidden sm:min-h-[650px]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { touchStartX.current = null; touchDeltaX.current = 0; }}
    >
      <div className="rhevolver-hero__grain" aria-hidden="true" />
      <div className="rhevolver-hero__edge" aria-hidden="true" />
      {items.map((item, index) => (
        <Link
          key={item.id}
          href={href(item)}
          className={`rhevolver-hero-slide absolute inset-0 ${index === active ? `is-active ${direction === 1 ? "from-next" : "from-prev"}` : "is-inactive"}`}
          aria-hidden={index !== active}
          tabIndex={index === active ? 0 : -1}
        >
          {item.featured_image ? (
            <Image
              src={item.featured_image}
              alt={item.title}
              fill
              priority={index === 0}
              quality={100}
              unoptimized
              sizes="(max-width: 1280px) 100vw, 68vw"
              className={`rhevolver-hero-slide__image hero-image-pristine absolute inset-0 h-full w-full object-cover ${index === active ? "is-active" : ""}`}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.65),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(219,39,119,0.52),_transparent_40%),#10131d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050a]/70 via-black/16 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(15,8,28,.42)_0%,rgba(12,8,20,.10)_48%,rgba(80,12,54,.07)_100%)]" />
          <div className="rhevolver-hero__light-sweep" aria-hidden="true" />

          <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2 sm:left-7 sm:top-7">
            <span className="rhevolver-hero__portada rounded-full px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em]">Portada</span>
            <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] backdrop-blur">{item.category || "Noticias"}</span>
          </div>

          {hasVideo(item) && <VideoIndicator className="absolute right-5 top-5 z-10 sm:right-7 sm:top-7" />}

          <div className="rhevolver-hero__content absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#f6c944]" aria-hidden="true" />
              <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#f6c944]">Rhevolver informa</p>
            </div>
            <h1 className="rhevolver-hero__title mt-3 max-w-5xl text-3xl font-black leading-[1.01] tracking-[-0.055em] text-white sm:text-[2.85rem] lg:text-[4.15rem]">{item.title}</h1>
            {item.summary && <p className="rhevolver-hero__summary mt-4 max-w-3xl line-clamp-3 text-sm leading-6 text-white/88 sm:text-lg sm:leading-8">{item.summary}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-zinc-300">
              <span>{item.author || "Rhevolver Media"}</span>
              <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
              <span>{formatDate(item.published_at, item.created_at)}</span>
              <span className="rhevolver-hero__read ml-auto hidden rounded-full px-4 py-2 font-black sm:inline-flex">Leer noticia →</span>
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
