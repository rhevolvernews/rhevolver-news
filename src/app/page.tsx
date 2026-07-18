import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";

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

const categories = [
  { label: "Última Hora", href: "/" },
  { label: "Local", href: "/categoria/local" },
  { label: "Nacional", href: "/categoria/nacional" },
  { label: "Política", href: "/categoria/politica" },
  { label: "Internacional", href: "/categoria/internacional" },
  { label: "Deportes", href: "/categoria/deportes" },
  { label: "IA", href: "/categoria/ia" },
  { label: "Opinión", href: "/categoria/opinion" },
  { label: "TV Show", href: "/categoria/tv-show" },
];

async function getPublishedNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, summary, featured_image, category, author, published_at, created_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error al cargar noticias:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value || fallback));
}

function articleHref(item: NewsItem) {
  return `/noticia/${item.slug || item.id}`;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await getPublishedNews();
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 5);
  const latestNews = news.slice(5);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-blue-700/20 blur-[130px]" />
        <div className="absolute right-[-14rem] top-[18rem] h-[36rem] w-[36rem] rounded-full bg-pink-600/15 blur-[140px]" />
      </div>

      <header className="border-b border-white/10 bg-[#07080d]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-blue-600 via-violet-600 to-pink-600 text-xl font-black shadow-lg shadow-pink-500/20 transition group-hover:scale-105">
              R
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight">
                Rhevolver<span className="text-pink-500">.news</span>
              </p>

              <p className="text-xs text-zinc-500">
                Información que revoluciona
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-bold text-zinc-300">
            <Link href="/" className="transition hover:text-pink-400">
              Inicio
            </Link>

            <Link
              href="/categoria/local"
              className="transition hover:text-pink-400"
            >
              Local
            </Link>

            <Link
              href="/categoria/nacional"
              className="transition hover:text-pink-400"
            >
              Nacional
            </Link>

            <Link
              href="/categoria/politica"
              className="transition hover:text-pink-400"
            >
              Política
            </Link>

            
          </nav>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[#0b0d14]">
        <div className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-5 py-3 md:px-8">
          {categories.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-sm font-bold text-zinc-400 transition hover:text-pink-400"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-r from-blue-950/80 via-[#11131c] to-pink-950/70">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden px-5 py-3 md:px-8">
          <strong className="shrink-0 rounded-md bg-pink-600 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-600/20">
            Última hora
          </strong>

          <p className="truncate text-sm text-zinc-300">
            {featuredNews
              ? featuredNews.title
              : "Muy pronto encontrarás aquí las noticias más relevantes."}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-5 pt-8 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur md:p-5">
          <SearchBar />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-14 md:px-8">
        {news.length === 0 ? (
          <section className="grid min-h-[58vh] place-items-center rounded-3xl border border-white/10 bg-[#10121a] p-8 text-center shadow-2xl">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-pink-500/10 text-3xl">
                📰
              </div>

              <h1 className="mt-6 text-3xl font-black">
                Aún no hay noticias publicadas
              </h1>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-400">
                Las noticias que cambies al estado “Publicada” desde Rhevolver
                CMS aparecerán automáticamente en esta portada.
              </p>

              <Link
                href="/admin"
                className="mt-6 inline-block rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-3 font-bold shadow-lg shadow-pink-500/20"
              >
                Ir al Dashboard
              </Link>
            </div>
          </section>
        ) : (
          <>
            {featuredNews && (
              <section className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
                <Link
                  href={articleHref(featuredNews)}
                  className="group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#11131c] shadow-2xl shadow-black/30"
                >
                  {featuredNews.featured_image ? (
                    <img
                      src={featuredNews.featured_image}
                      alt={featuredNews.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#141621] to-pink-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-950/25 to-pink-950/15" />

                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                    <span className="inline-block rounded-full bg-pink-600 px-4 py-2 text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-600/20">
                      {featuredNews.category || "Noticias"}
                    </span>

                    <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
                      {featuredNews.title}
                    </h1>

                    {featuredNews.summary && (
                      <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-200 md:text-lg">
                        {featuredNews.summary}
                      </p>
                    )}

                    <p className="mt-5 text-sm text-zinc-300">
                      {featuredNews.author || "Rhevolver Media"} ·{" "}
                      {formatDate(
                        featuredNews.published_at,
                        featuredNews.created_at
                      )}
                    </p>
                  </div>
                </Link>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  {secondaryNews.length > 0 ? (
                    secondaryNews.map((item) => (
                      <Link
                        key={item.id}
                        href={articleHref(item)}
                        className="group grid overflow-hidden rounded-2xl border border-white/10 bg-[#10121a] shadow-xl transition hover:border-pink-500/40 hover:bg-[#141722] sm:grid-cols-[150px_1fr]"
                      >
                        <div className="h-48 overflow-hidden bg-zinc-900 sm:h-full">
                          {item.featured_image ? (
                            <img
                              src={item.featured_image}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 to-pink-950 text-3xl font-black">
                              R
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <p className="text-xs font-black uppercase tracking-wider text-pink-500">
                            {item.category || "Noticias"}
                          </p>

                          <h2 className="mt-2 line-clamp-3 text-lg font-black leading-snug transition group-hover:text-pink-400">
                            {item.title}
                          </h2>

                          <p className="mt-4 text-xs text-zinc-500">
                            {formatDate(item.published_at, item.created_at)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="grid min-h-[520px] place-items-center rounded-3xl border border-dashed border-white/10 bg-[#10121a] p-8 text-center">
                      <div>
                        <p className="text-4xl">📰</p>
                        <p className="mt-4 font-bold text-zinc-300">
                          Las próximas noticias aparecerán aquí
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {latestNews.length > 0 && (
              <section className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-500">
                      Actualidad
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                      Últimas noticias
                    </h2>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400">
                    {news.length} publicaciones
                  </span>
                </div>

                <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNews.map((item) => (
                    <Link
                      key={item.id}
                      href={articleHref(item)}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#10121a] shadow-xl transition hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-pink-950/20"
                    >
                      <div className="h-56 overflow-hidden bg-zinc-900">
                        {item.featured_image ? (
                          <img
                            src={item.featured_image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 via-violet-950 to-pink-950 text-4xl font-black">
                            R
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-black uppercase tracking-wider text-pink-500">
                          {item.category || "Noticias"}
                        </p>

                        <h3 className="mt-3 text-xl font-black leading-snug transition group-hover:text-pink-400">
                          {item.title}
                        </h3>

                        {item.summary && (
                          <p className="mt-3 line-clamp-3 leading-7 text-zinc-400">
                            {item.summary}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
                          <span>{item.author || "Rhevolver Media"}</span>

                          <span>
                            {formatDate(item.published_at, item.created_at)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <footer className="border-t border-white/10 bg-[#07080d]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-pink-600 font-black">
                R
              </div>

              <p className="text-2xl font-black">
                Rhevolver<span className="text-pink-500">.news</span>
              </p>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Noticias, opinión, política, tecnología, entretenimiento y la
              información que transforma la conversación.
            </p>
          </div>

          <div className="text-sm text-zinc-500 md:text-right">
            <p>© {new Date().getFullYear()} Rhevolver Media Comunicaciones</p>
            <p className="mt-1">Información que revoluciona.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}