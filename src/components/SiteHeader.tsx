"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PlatformIcon from "@/components/PlatformIcon";

const categories = [
  { label: "Última Hora", href: "/", icon: "⚡", description: "Las noticias que están ocurriendo ahora" },
  { label: "Local", href: "/categoria/local", icon: "◉", description: "Iguala y municipios cercanos" },
  { label: "Guerrero", href: "/categoria/guerrero", icon: "◆", description: "Información de todo el estado" },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/92 backdrop-blur-2xl">
      <div className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 text-[0.68rem] text-zinc-500 sm:px-6 lg:px-8">
          <p className="hidden sm:block">Periodismo digital desde Guerrero para México</p>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/sobre-rhevolver" className="font-bold transition hover:text-white">Quiénes somos</Link>
            <Link href="/contacto" className="font-bold transition hover:text-white">Contacto</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Rhevolver.news, inicio">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#ffd400] shadow-[0_10px_35px_rgba(236,72,153,0.2)] transition duration-300 group-hover:-rotate-2 group-hover:scale-105">
            <span className="text-2xl font-black tracking-[-0.12em] text-[#111827]">R<span className="text-[var(--rhevolver-pink)]">.</span></span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[1.65rem] font-black leading-none tracking-[-0.055em] sm:text-3xl">Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span></p>
            <p className="mt-1 truncate text-[0.62rem] font-bold uppercase tracking-[0.22em] text-zinc-500">Casa editorial digital</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-extrabold text-zinc-300 lg:flex" aria-label="Navegación principal">
          <Link href="/" className={pathname === "/" ? "text-white" : "transition hover:text-fuchsia-400"}>Inicio</Link>
          {categories.slice(1, 5).map((item) => (
            <Link key={item.label} href={item.href} className={pathname === item.href ? "text-fuchsia-400" : "transition hover:text-fuchsia-400"}>{item.label}</Link>
          ))}
          <button type="button" onClick={() => setMegaOpen((value) => !value)} className="inline-flex items-center gap-2 transition hover:text-fuchsia-400" aria-expanded={megaOpen}>
            Más <span className={`text-xs transition ${megaOpen ? "rotate-180" : ""}`}>⌄</span>
          </button>
        </nav>

        <div className="hidden items-center gap-2 2xl:flex">
          {networks.map((network) => (
            <a key={network.label} href={network.href} target="_blank" rel="noreferrer" aria-label={network.label} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:text-white"><PlatformIcon name={network.icon} /></a>
          ))}
        </div>

        <button type="button" onClick={() => setMobileOpen(true)} className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] lg:hidden" aria-label="Abrir menú">
          <span className="h-0.5 w-5 bg-white" /><span className="h-0.5 w-5 bg-white" /><span className="h-0.5 w-5 bg-white" />
        </button>
      </div>

      {megaOpen && (
        <div className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-[#090b11]/98 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:block">
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

      <div className="border-t border-white/[0.07] bg-[#090b11]/90">
        <div className="mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {categories.map((item) => (
            <Link key={item.label} href={item.href} className={`whitespace-nowrap text-[0.68rem] font-black uppercase tracking-[0.14em] transition ${pathname === item.href ? "text-fuchsia-400" : "text-zinc-500 hover:text-fuchsia-400"}`}>{item.label}</Link>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#05060a] lg:hidden">
          <div className="mx-auto min-h-screen max-w-xl px-5 py-5">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-black tracking-[-0.05em]">Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span></Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-xl" aria-label="Cerrar menú">×</button>
            </div>
            <p className="mt-8 text-[0.65rem] font-black uppercase tracking-[0.22em] text-fuchsia-400">Explorar secciones</p>
            <nav className="mt-4 grid gap-2" aria-label="Menú móvil">
              {categories.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.07]">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-fuchsia-300">{item.icon}</span><span className="font-black">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link href="/sobre-rhevolver" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-black">Sobre nosotros</Link>
              <Link href="/contacto" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-black">Contacto</Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-6">
              {networks.map((network) => <a key={network.label} href={network.href} target="_blank" rel="noreferrer" aria-label={network.label} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400"><PlatformIcon name={network.icon} /></a>)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
