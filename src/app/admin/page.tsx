import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSystemStatus } from "@/lib/features";
import LogoutButton from "@/components/LogoutButton";

type NewsItem = {
  id: number;
  title: string;
  category: string | null;
  status: string | null;
  created_at: string;
  published_at: string | null;
  views?: number | null;
};

const menu = [
  { icon: "⌂", label: "Dashboard", href: "/admin", active: true },
  { icon: "▤", label: "Noticias", href: "/noticias" },
  { icon: "+", label: "Nueva noticia", href: "/nueva-noticia" },
  { icon: "▧", label: "Multimedia", href: "/multimedia" },
  { icon: "◫", label: "Categorías", href: "/categorias" },
];

async function getDashboardData() {
  const [recentResult, publishedResult, draftsResult, allResult, topResult] =
    await Promise.all([
      supabase
        .from("news")
        .select("id, title, category, status, created_at, published_at, views")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("news").select("id").in("status", ["published", "featured"]),
      supabase.from("news").select("id").eq("status", "draft"),
      supabase.from("news").select("views"),
      supabase
        .from("news")
        .select("id, title, category, status, created_at, published_at, views")
        .in("status", ["published", "featured"])
        .order("views", { ascending: false })
        .limit(5),
    ]);

  if (recentResult.error) {
    return {
      recent: [] as NewsItem[],
      topViewed: [] as NewsItem[],
      publishedCount: 0,
      draftCount: 0,
      totalViews: 0,
      error: recentResult.error.message,
    };
  }

  return {
    recent: (recentResult.data ?? []) as NewsItem[],
    topViewed: (topResult.data ?? []) as NewsItem[],
    publishedCount: publishedResult.data?.length ?? 0,
    draftCount: draftsResult.data?.length ?? 0,
    totalViews: (allResult.data ?? []).reduce(
      (total, item) => total + Number(item.views || 0),
      0
    ),
    error: "",
  };
}

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value || fallback));
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { recent, topViewed, publishedCount, draftCount, totalViews, error } =
    await getDashboardData();
  const systemStatus = getSystemStatus();

  const categoriesCount = new Set(
    recent.map((item) => item.category).filter(Boolean)
  ).size;

  const statistics = [
    { title: "Noticias publicadas", value: publishedCount, detail: "Activas" },
    { title: "Borradores", value: draftCount, detail: "Pendientes" },
    { title: "Lecturas registradas", value: totalViews, detail: "Acumuladas" },
    { title: "Categorías recientes", value: categoriesCount, detail: "En uso" },
  ];

  return (
    <main className="min-h-screen bg-[#07080d] text-white lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="border-b border-white/10 bg-[#090a10] p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#f3b51b] via-pink-500 to-pink-700 text-2xl font-black shadow-lg shadow-pink-500/20">
            R
          </div>
          <div>
            <p className="text-xl font-black">
              Rhevolver<span className="text-pink-500">.CMS</span>
            </p>
            <p className="text-xs text-zinc-500">Información que revoluciona</p>
          </div>
        </Link>

        <nav className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:block lg:space-y-2">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition lg:px-4 ${
                item.active
                  ? "bg-pink-500/15 text-white shadow-[inset_3px_0_0_#ec4899]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-6 text-center text-pink-500">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:absolute lg:bottom-6 lg:left-5 lg:right-5 lg:flex lg:items-center lg:gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[#f3b51b]/30 bg-[#f3b51b]/10 text-xs font-bold text-[#f3b51b]">
            RV
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Administrador</p>
            <p className="text-xs text-zinc-500">Rhevolver Media</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <section className="mx-auto w-full max-w-7xl p-5 md:p-8">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.22em] text-pink-500">
              RHEVOLVER CMS
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 text-zinc-400">
              Administra noticias, borradores e imágenes desde un solo lugar.
            </p>
          </div>

          <Link
            href="/nueva-noticia"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-bold shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
          >
            + Nueva noticia
          </Link>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200">
            No se pudo consultar Supabase: {error}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/60 via-[#12141d] to-pink-950/40 p-7 shadow-2xl md:p-10">
          <p className="mb-4 text-xs font-black tracking-[0.22em] text-[#f3b51b]">
            CENTRO EDITORIAL
          </p>
          <h2 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            Tu operación editorial, ahora conectada con tus noticias reales.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Consulta lo publicado, recupera borradores, edita y elimina sin salir
            del panel administrativo.
          </p>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#11131c] p-6"
            >
              <p className="text-sm text-zinc-500">{item.title}</p>
              <p className="mt-5 text-4xl font-black">{item.value}</p>
              <p className="mt-2 text-xs font-bold text-pink-500">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-[#11131c] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-pink-500">ESTADO DEL SISTEMA</p>
              <h3 className="mt-2 text-xl font-bold">Preparación para lanzamiento</h3>
            </div>
            <Link href="/api/health" target="_blank" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10">Diagnóstico</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Supabase", systemStatus.supabase],
              ["Acceso CMS", systemStatus.admin],
              ["Analytics", systemStatus.analytics],
              ["Facebook", systemStatus.facebook],
              ["IA", systemStatus.ai],
            ].map(([label, ready]) => (
              <div key={String(label)} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold">{String(label)}</p>
                <p className={`mt-2 text-xs font-black ${ready ? "text-emerald-300" : "text-amber-300"}`}>
                  {ready ? "LISTO" : "PENDIENTE"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
          <article className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black tracking-[0.2em] text-pink-500">
                  ACTIVIDAD
                </p>
                <h3 className="mt-2 text-xl font-bold">Publicaciones recientes</h3>
              </div>
              <Link
                href="/noticias"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold hover:bg-white/10"
              >
                Ver todas
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-500/10 text-2xl text-pink-500">
                    ▤
                  </div>
                  <h4 className="mt-5 text-lg font-bold">Aún no hay noticias</h4>
                  <p className="mt-2 text-zinc-500">
                    La primera nota que guardes aparecerá aquí.
                  </p>
                  <Link
                    href="/nueva-noticia"
                    className="mt-5 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
                  >
                    Crear primera noticia
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-white/10">
                {recent.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{item.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.category || "Sin categoría"} · {formatDate(item.published_at, item.created_at)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "published"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {item.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <aside className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <p className="text-xs font-black tracking-[0.2em] text-pink-500">
              ACCESOS RÁPIDOS
            </p>
            <h3 className="mt-2 text-xl font-bold">Comienza a trabajar</h3>

            {topViewed.length > 0 && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-black tracking-[0.16em] text-emerald-300">MÁS LEÍDAS</p>
                <div className="mt-3 space-y-3">
                  {topViewed.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="line-clamp-2 text-zinc-300">{item.title}</span>
                      <strong className="shrink-0 text-white">{Number(item.views || 0)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 divide-y divide-white/10">
              {[
                ["+", "Nueva noticia", "Redactar y guardar un borrador", "/nueva-noticia"],
                ["▧", "Subir imagen", "Añadir contenido multimedia", "/multimedia"],
                ["◫", "Gestionar categorías", "Revisar secciones en uso", "/categorias"],
              ].map(([icon, title, description, href]) => (
                <Link
                  key={title}
                  href={href}
                  className="flex w-full items-center gap-4 py-5 text-left transition hover:translate-x-1"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-500/10 font-black text-pink-500">
                    {icon}
                  </span>
                  <span>
                    <strong className="block">{title}</strong>
                    <small className="mt-1 block text-zinc-500">{description}</small>
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
