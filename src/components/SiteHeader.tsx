"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PlatformIcon from "@/components/PlatformIcon";
import SearchBar from "@/components/SearchBar";

const categories = [
  { label: "Última Hora", href: "/", icon: "⚡", description: "Las noticias que están ocurriendo ahora" },
  { label: "Local", href: "/categoria/local", icon: "◉", description: "Iguala y municipios cercanos" },
  { label: "Estatal", href: "/categoria/guerrero", icon: "◆", description: "Información de todo Guerrero" },
  { label: "Nacional", href: "/categoria/nacional", icon: "◈", description: "Los temas que mueven a México" },
  { label: "Política", href: "/categoria/politica", icon: "▣", description: "Gobierno, elecciones y poder" },
  { label: "Internacional", href: "/categoria/internacional", icon: "◎", description: "El mundo en contexto" },
  { label: "Deportes", href: "/categoria/deportes", icon: "◇", description: "Resultados, historias y protagonistas" },
  { label: "IA", href: "/categoria/ia", icon: "✦", description: "Tecnología e inteligencia artificial" },
  { label: "Opinión", href: "/categoria/opinion", icon: "✎", description: "Análisis y voces invitadas" },
  { label: "TV Show", href: "/categoria/tv-show", icon: "▶", description: "Videos, cultura y entretenimiento" },
];

const networks = [
  { label: "Facebook", href: "https://www.facebook.com/rhevolvermx", icon: "facebook" as const },
  { label: "Instagram", href: "https://www.instagram.com/rhevolvermx", icon: "instagram" as const },
  { label: "TikTok", href: "https://www.tiktok.com/@rhevolvercdmx", icon: "tiktok" as const },
  { label: "X", href: "https://x.com/rhevolvercdmx", icon: "x" as const },
  { label: "YouTube", href: "https://www.youtube.com/@RhevolverMx", icon: "youtube" as const },
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb8o6fODzgTKUBkxkH2o", icon: "whatsapp" as const },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => {
    setMegaOpen(false);
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const toggleMobileMenu = () => {
    setMegaOpen(false);
    setSearchOpen(false);
    setMobileOpen((value) => !value);
  };
  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, searchOpen]);

  const searchPanel = searchOpen && typeof document !== "undefined"
    ? createPortal(
        <div className="rhevolver-overlay fixed inset-0 z-[2147483647] grid place-items-start overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(.75rem,env(safe-area-inset-top))] sm:place-items-center sm:px-6 sm:py-16" role="dialog" aria-modal="true" aria-label="Buscar en Rhevolver.news">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-[#03040a]/82 backdrop-blur-xl"
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar buscador"
          />
          <div className="rhevolver-search-modal relative z-10 mx-auto w-full max-w-[58rem] overflow-visible rounded-[1.5rem] border border-white/15 bg-[#090b13]/96 p-4 shadow-[0_35px_120px_rgba(0,0,0,.72)] backdrop-blur-2xl sm:rounded-[1.75rem] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.64rem] font-black uppercase tracking-[0.24em] text-[#f6c944]">Buscar en Rhevolver</p>
                <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Noticias, temas, lugares y autores</h2>
              </div>
              <button type="button" onClick={() => setSearchOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-2xl text-zinc-300 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 hover:text-white" aria-label="Cerrar buscador">×</button>
            </div>
            <SearchBar />
            <p className="mt-4 text-center text-[0.67rem] text-zinc-600">Escribe al menos dos letras para ver resultados instantáneos.</p>
          </div>
        </div>,
        document.body
      )
    : null;

  const mobileMenu = mobileOpen && typeof document !== "undefined"
    ? createPortal(
        <div className="rhevolver-overlay fixed inset-0 z-[2147483647] lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside className="rhevolver-mobile-drawer absolute right-0 top-0 flex h-[100dvh] w-[min(90vw,25rem)] flex-col overflow-hidden border-l border-white/10 bg-[#07090f] shadow-[-24px_0_80px_rgba(0,0,0,.75)]">
            <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-[#07090f]/98 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-xl">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-2xl font-black tracking-[-0.05em]">
                Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span>
              </Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 transition active:scale-95" aria-label="Cerrar menú">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [-webkit-overflow-scrolling:touch]">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-fuchsia-400">Secciones</p>
              <nav className="mt-4 grid grid-cols-2 gap-2" aria-label="Menú móvil">
                {categories.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 py-3 transition active:scale-[.98] ${pathname === item.href ? "border-fuchsia-400/40 bg-fuchsia-500/10 text-white" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-sm text-fuchsia-300">{item.icon}</span>
                    <span className="text-sm font-black">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/10 pt-5">
                <Link href="/sobre-rhevolver" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-3 py-3 text-center text-sm font-black">Sobre nosotros</Link>
                <Link href="/contacto" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-3 py-3 text-center text-sm font-black">Contacto</Link>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {networks.map((network) => (
                  <a key={network.label} href={network.href} target="_blank" rel="noreferrer" aria-label={network.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400"><PlatformIcon name={network.icon} /></a>
                ))}
              </div>
            </div>
            <div className="shrink-0 border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-center text-[0.68rem] text-zinc-600">Información que revoluciona.</div>
          </aside>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <header className="rhevolver-header sticky top-0 z-50">
        <div className="hidden border-b border-white/[0.07] sm:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-2 text-[0.68rem] text-zinc-500 lg:px-8">
            <p>Periodismo digital desde Guerrero para México</p>
            <div className="ml-auto flex items-center gap-4">
              <Link href="/sobre-rhevolver" className="font-bold transition hover:text-white">Quiénes somos</Link>
              <Link href="/contacto" className="font-bold transition hover:text-white">Contacto</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Rhevolver.news, inicio">
            <div className="rhevolver-logo-mark relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden transition duration-300 group-hover:-rotate-2 group-hover:scale-105 sm:h-12 sm:w-12">
              <span className="text-2xl font-black tracking-[-0.12em] text-[#111827]">R<span className="text-[var(--rhevolver-pink)]">.</span></span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" />
            </div>
            <div className="min-w-0">
              <p className="rhevolver-wordmark truncate text-[1.48rem] font-black leading-none tracking-[-0.065em] sm:text-3xl">Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span></p>
              <p className="mt-1 truncate text-[0.56rem] font-bold uppercase tracking-[0.19em] text-zinc-500 sm:text-[0.62rem] sm:tracking-[0.22em]">Casa editorial digital</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-extrabold text-zinc-300 lg:flex" aria-label="Navegación principal">
            <Link href="/" className={pathname === "/" ? "text-white" : "transition hover:text-fuchsia-400"}>Inicio</Link>
            {categories.slice(1, 5).map((item) => (
              <Link key={item.label} href={item.href} className={pathname === item.href ? "text-fuchsia-400" : "transition hover:text-fuchsia-400"}>{item.label}</Link>
            ))}
            <button type="button" onClick={() => setMegaOpen((value) => !value)} className="inline-flex items-center gap-2 transition hover:text-fuchsia-400" aria-expanded={megaOpen} aria-controls="rhevolver-mega-menu">
              Más <span className={`text-xs transition ${megaOpen ? "rotate-180" : ""}`}>⌄</span>
            </button>
          </nav>

          <div className="hidden items-center gap-2 2xl:flex">
            {networks.map((network) => (
              <a key={network.label} href={network.href} target="_blank" rel="noreferrer" aria-label={network.label} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:text-white"><PlatformIcon name={network.icon} /></a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerUp={(event) => {
                if (event.pointerType !== "mouse") {
                  event.preventDefault();
                  openSearch();
                }
              }}
              onClick={(event) => {
                if (event.detail === 0 || (event.nativeEvent as PointerEvent).pointerType === "mouse") openSearch();
              }}
              className="rhevolver-header-icon rhevolver-touch-target relative z-[70] grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition active:scale-95"
              aria-label="Buscar noticias"
              aria-expanded={searchOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4.2-4.2" />
              </svg>
            </button>
            <button
              type="button"
              onPointerUp={(event) => {
                if (event.pointerType !== "mouse") {
                  event.preventDefault();
                  toggleMobileMenu();
                }
              }}
              onClick={(event) => {
                if (event.detail === 0 || (event.nativeEvent as PointerEvent).pointerType === "mouse") toggleMobileMenu();
              }}
              className="rhevolver-header-icon rhevolver-touch-target relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] transition active:scale-95 lg:hidden"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              <span className="h-0.5 w-5 bg-white" />
              <span className="h-0.5 w-5 bg-white" />
              <span className="h-0.5 w-5 bg-white" />
            </button>
          </div>
        </div>

        {megaOpen && (
          <div id="rhevolver-mega-menu" className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-[#090b11]/98 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:block">
            <div className="mx-auto grid max-w-[1440px] gap-8 px-8 py-8 lg:grid-cols-[1fr_280px]">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {categories.slice(5).map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMegaOpen(false)} className="group flex gap-4 rounded-2xl border border-transparent p-4 transition hover:border-white/10 hover:bg-white/[0.04]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600/20 to-fuchsia-600/20 text-lg text-fuchsia-300">{item.icon}</span>
                    <span><strong className="block text-sm text-white group-hover:text-fuchsia-300">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-zinc-500">{item.description}</span></span>
                  </Link>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-700/15 to-fuchsia-700/15 p-5">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-fuchsia-400">Rhevolver</p>
                <h2 className="mt-2 text-xl font-black">Información con identidad propia</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">Conoce nuestra visión, principios editoriales y compromiso con las audiencias.</p>
                <Link href="/sobre-rhevolver" onClick={() => setMegaOpen(false)} className="mt-5 inline-flex text-sm font-black text-white">Conocer Rhevolver →</Link>
              </div>
            </div>
          </div>
        )}

        <div className="rhevolver-nav-strip border-t border-white/[0.07]">
          <div className="rhevolver-category-strip mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {categories.map((item) => (
              <Link key={item.label} href={item.href} className={`whitespace-nowrap text-[0.68rem] font-black uppercase tracking-[0.14em] transition ${pathname === item.href ? "text-fuchsia-400" : "text-zinc-500 hover:text-fuchsia-400"}`}>{item.label}</Link>
            ))}
          </div>
        </div>
      </header>
      {mobileMenu}
      {searchPanel}
    </>
  );
}
