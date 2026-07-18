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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await getPublishedNews();
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 5);
  const latestNews = news.slice(5);

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#111111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-6 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-pink-600 text-xl font-black text-white">
              R
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight">
                Rhevolver<span className="text-pink-600">.news</span>
              </p>

              <p className="text-xs text-zinc-500">
                Información que revoluciona
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-5 text-sm font-bold">
            <Link href="/" className="hover:text-pink-600">
              Inicio
            </Link>

            <Link href="/categoria/local" className="hover:text-pink-600">
              Local
            </Link>

            <Link href="/categoria/nacional" className="hover:text-pink-600">
              Nacional
            </Link>

            <Link href="/categoria/politica" className="hover:text-pink-600">
              Política
            </Link>

            <Link href="/categoria/deportes" className="hover:text-pink-600">
              Deportes
            </Link>

            <Link
              href="/admin"
              className="rounded-xl bg-[#111111] px-4 py-2 text-white hover:bg-pink-600"
            >
              Administrar
            </Link>
          </nav>
        </div>
      </header>
<section className="border-b border-black/10 bg-white">
  <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-5 py-3 md:px-8">
    {[
      "Última Hora",
      "Local",
      "Nacional",
      "Política",
      "Internacional",
      "Deportes",
      "IA",
      "Opinión",
      "TV Show",
    ].map((item) => (
      <Link
        key={item}
        href="#"
        className="whitespace-nowrap text-sm font-bold text-zinc-700 transition hover:text-pink-600"
      >
        {item}
      </Link>
    ))}
  </div>
</section>
      <section className="border-b border-black/10 bg-[#111111] text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden px-5 py-3 md:px-8">
          <strong className="shrink-0 rounded-md bg-pink-600 px-3 py-1 text-xs uppercase tracking-wider">
            Última hora
          </strong>

          <p className="truncate text-sm text-zinc-300">
            {featuredNews
              ? featuredNews.title
              : "Muy pronto encontrarás aquí las noticias más relevantes."}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">

        <SearchBar />
        
        {news.length === 0 ? (
          <section className="grid min-h-[60vh] place-items-center rounded-3xl border border-black/10 bg-white p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-pink-100 text-3xl">
                📰
              </div>

              <h1 className="mt-6 text-3xl font-black">
                Aún no hay noticias publicadas
              </h1>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-500">
                Las noticias que cambies al estado “Publicada” desde Rhevolver
                CMS aparecerán automáticamente en esta portada.
              </p>

              <Link
                href="/admin"
                className="mt-6 inline-block rounded-xl bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700"
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
                  href={`/noticia/${featuredNews.slug || featuredNews.id}`}
                  className="group relative min-h-[480px] overflow-hidden rounded-3xl bg-[#161616]"
                >
                  {featuredNews.featured_image ? (
                    <img
                      src={featuredNews.featured_image}
                      alt={featuredNews.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#171717] to-pink-950" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-10">
                    <span className="inline-block rounded-full bg-pink-600 px-4 py-2 text-xs font-black uppercase tracking-wider">
                      {featuredNews.category || "Noticias"}
                    </span>

                    <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight md:text-5xl">
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
                  {secondaryNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/noticia/${item.slug || item.id}`}
                      className="group grid overflow-hidden rounded-2xl border border-black/10 bg-white sm:grid-cols-[150px_1fr]"
                    >
                      <div className="h-48 overflow-hidden bg-zinc-200 sm:h-full">
                        {item.featured_image ? (
                          <img
                            src={item.featured_image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 to-pink-900 text-3xl text-white">
                            R
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-black uppercase tracking-wider text-pink-600">
                          {item.category || "Noticias"}
                        </p>

                        <h2 className="mt-2 line-clamp-3 text-lg font-black leading-snug group-hover:text-pink-600">
                          {item.title}
                        </h2>

                        <p className="mt-4 text-xs text-zinc-500">
                          {formatDate(item.published_at, item.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {latestNews.length > 0 && (
              <section className="mt-12">
                <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
                      Actualidad
                    </p>

                    <h2 className="mt-1 text-3xl font-black">
                      Últimas noticias
                    </h2>
                  </div>

                  <span className="text-sm text-zinc-500">
                    {news.length} publicaciones
                  </span>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/noticia/${item.slug || item.id}`}
                      className="group overflow-hidden rounded-2xl border border-black/10 bg-white"
                    >
                      <div className="h-56 overflow-hidden bg-zinc-200">
                        {item.featured_image ? (
                          <img
                            src={item.featured_image}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 to-pink-900 text-4xl font-black text-white">
                            R
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-black uppercase tracking-wider text-pink-600">
                          {item.category || "Noticias"}
                        </p>

                        <h3 className="mt-3 text-xl font-black leading-snug group-hover:text-pink-600">
                          {item.title}
                        </h3>

                        {item.summary && (
                          <p className="mt-3 line-clamp-3 leading-7 text-zinc-500">
                            {item.summary}
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-xs text-zinc-500">
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

      <footer className="mt-12 bg-[#111111] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-8 md:px-8">
          <div>
            <p className="text-xl font-black">
              Rhevolver<span className="text-pink-500">.news</span>
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Información que revoluciona.
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Rhevolver Media Comunicaciones
          </p>
        </div>
      </footer>
    </main>
  );
}