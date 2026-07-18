import Link from "next/link";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
};

type CategoriaPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNews(category: string): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, summary, featured_image, category, published_at, created_at"
    )
    .eq("status", "published")
    .ilike("category", category)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error al cargar la categoría:", error.message);
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

function formatCategoryName(slug: string) {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");

  return decoded
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const dynamic = "force-dynamic";

export default async function CategoriaPage({
  params,
}: CategoriaPageProps) {
  const { slug } = await params;
  const categoria = formatCategoryName(slug);
  const news = await getNews(categoria);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-48 top-0 h-[520px] w-[520px] rounded-full bg-blue-700/20 blur-[140px]" />
        <div className="absolute -right-48 top-72 h-[560px] w-[560px] rounded-full bg-pink-600/15 blur-[150px]" />
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

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:border-pink-500/40 hover:bg-white/10 hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <section className="border-b border-white/10 bg-gradient-to-r from-blue-950/70 via-[#11131c] to-pink-950/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-500">
            Sección
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            {categoria}
          </h1>

          <p className="mt-3 text-zinc-400">
            {news.length} {news.length === 1 ? "noticia encontrada" : "noticias encontradas"}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/noticia/${item.slug || item.id}`}
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
                    {item.category || categoria}
                  </p>

                  <h2 className="mt-3 text-xl font-black leading-snug transition group-hover:text-pink-400">
                    {item.title}
                  </h2>

                  {item.summary && (
                    <p className="mt-4 line-clamp-3 leading-7 text-zinc-400">
                      {item.summary}
                    </p>
                  )}

                  <p className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-500">
                    {formatDate(item.published_at, item.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[46vh] place-items-center rounded-3xl border border-dashed border-white/10 bg-[#10121a] p-10 text-center shadow-2xl">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-pink-500/10 text-3xl">
                📰
              </div>

              <h2 className="mt-6 text-2xl font-black">
                No hay noticias en esta categoría
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-500">
                Las publicaciones de la sección “{categoria}” aparecerán aquí
                automáticamente.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-3 font-bold shadow-lg shadow-pink-500/20"
              >
                Volver a la portada
              </Link>
            </div>
          </div>
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