import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

type NewsItem = {
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

type BuscarPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
  }>;
};

function cleanQuery(value: string) {
  return value
    .trim()
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 100);
}

async function searchNews(query: string, category: string): Promise<NewsItem[]> {
  if (!query) return [];

  let request = supabase
    .from("news")
    .select(
      "id,title,slug,summary,featured_image,category,author,published_at,created_at"
    )
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .or(
      `title.ilike.%${query}%,summary.ilike.%${query}%,category.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`
    )
    .order("published_at", { ascending: false })
    .limit(60);

  if (category) {
    request = request.ilike("category", category);
  }

  const { data, error } = await request;

  if (error) {
    console.error("Search page error:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value || fallback));
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pieces = text.split(new RegExp(`(${safe})`, "ig"));

  return pieces.map((piece, index) =>
    piece.toLocaleLowerCase("es-MX") === query.toLocaleLowerCase("es-MX") ? (
      <mark
        key={`${piece}-${index}`}
        className="rounded bg-pink-500/20 px-0.5 text-inherit"
      >
        {piece}
      </mark>
    ) : (
      piece
    )
  );
}

const categoryOptions = [
  "Local",
  "Guerrero",
  "Nacional",
  "Política",
  "Internacional",
  "Deportes",
  "IA",
  "Opinión",
  "TV Show",
];

export const dynamic = "force-dynamic";

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const params = await searchParams;
  const q = cleanQuery(params.q || "");
  const category = cleanQuery(params.categoria || "");
  const news = await searchNews(q, category);

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <SiteHeader />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(219,39,119,.16),transparent_34%),#080a10]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.24em] text-[var(--rhevolver-pink)]">
            Archivo informativo
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
            Buscar en Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span>
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Encuentra noticias por tema, lugar, categoría, autor o palabras clave.
          </p>
          <div className="mt-7">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              {q ? (
                <>
                  Resultados para <strong className="text-white">“{q}”</strong>
                </>
              ) : (
                "Escribe una palabra para comenzar"
              )}
            </p>
            {q && (
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {news.length} {news.length === 1 ? "resultado" : "resultados"}
              </h2>
            )}
          </div>

          {q && (
            <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
              <Link
                href={`/buscar?q=${encodeURIComponent(q)}`}
                className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                  !category
                    ? "border-pink-500 bg-pink-500/15 text-pink-300"
                    : "border-white/10 text-zinc-500 hover:text-white"
                }`}
              >
                Todas
              </Link>
              {categoryOptions.map((item) => (
                <Link
                  key={item}
                  href={`/buscar?q=${encodeURIComponent(q)}&categoria=${encodeURIComponent(item)}`}
                  className={`rounded-full border px-3 py-2 text-xs font-black transition ${
                    category.toLowerCase() === item.toLowerCase()
                      ? "border-pink-500 bg-pink-500/15 text-pink-300"
                      : "border-white/10 text-zinc-500 hover:text-white"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>

        {news.length > 0 ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/noticia/${item.slug || item.id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1018] shadow-xl transition hover:-translate-y-1 hover:border-pink-500/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                  {item.featured_image ? (
                    <Image
                      src={item.featured_image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-gradient-to-br from-blue-700/25 to-pink-600/25 text-3xl font-black">
                      R.
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.15em] backdrop-blur">
                    {item.category || "Noticias"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-3 text-lg font-black leading-snug tracking-[-0.02em] transition group-hover:text-pink-300">
                    {highlightText(item.title, q)}
                  </h3>
                  {item.summary && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                      {highlightText(item.summary, q)}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[0.68rem] text-zinc-600">
                    <span>{item.author || "Rhevolver Media"}</span>
                    <span>{formatDate(item.published_at, item.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : q ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.025] px-6 py-14 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-500/10 text-2xl">⌕</div>
            <h2 className="mt-5 text-2xl font-black">No encontramos resultados</h2>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-zinc-500">
              Prueba con una palabra más general, revisa la ortografía o elimina el filtro de categoría.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-[var(--rhevolver-pink)] px-5 py-3 text-sm font-black transition hover:bg-[var(--rhevolver-pink-dark)]"
            >
              Volver a la portada
            </Link>
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-14 text-center text-zinc-500">
            Usa el buscador para consultar el archivo de noticias de Rhevolver.
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
