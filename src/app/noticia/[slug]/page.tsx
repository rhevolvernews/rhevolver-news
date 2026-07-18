import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";

type NewsItem = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  content: string;
  category: string | null;
  author: string | null;
  featured_image: string | null;
  status: string | null;
  created_at: string;
  published_at: string | null;
};

type RelatedNewsItem = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  category: string | null;
  featured_image: string | null;
  created_at: string;
  published_at: string | null;
};

type NoticiaPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNews(slug: string): Promise<NewsItem | null> {
  const numericId = Number(slug);

  let query = supabase
    .from("news")
    .select(
      "id, title, slug, summary, content, category, author, featured_image, status, created_at, published_at"
    )
    .eq("status", "published");

  if (Number.isInteger(numericId) && numericId > 0) {
    query = query.eq("id", numericId);
  } else {
    query = query.eq("slug", slug);
  }

  const { data, error } = await query.single<NewsItem>();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getRelatedNews(
  category: string | null,
  currentId: number
): Promise<RelatedNewsItem[]> {
  if (!category) {
    return [];
  }

  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, summary, category, featured_image, created_at, published_at"
    )
    .eq("status", "published")
    .ilike("category", category)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error al cargar noticias relacionadas:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value || fallback));
}

export const dynamic = "force-dynamic";

export default async function NoticiaPage({
  params,
}: NoticiaPageProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news.category, news.id);

  const articleUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${news.slug || news.id}`
    : `http://localhost:3000/noticia/${news.slug || news.id}`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-48 top-0 h-[520px] w-[520px] rounded-full bg-blue-700/20 blur-[140px]" />
        <div className="absolute -right-48 top-80 h-[560px] w-[560px] rounded-full bg-pink-600/15 blur-[150px]" />
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
            ← Volver a Inicio
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <header>
          <span className="inline-block rounded-full bg-pink-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-pink-600/20">
            {news.category || "Noticias"}
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {news.title}
          </h1>

          {news.summary && (
            <p className="mt-6 max-w-4xl text-xl leading-8 text-zinc-400">
              {news.summary}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-white/10 py-4 text-sm text-zinc-500">
            <strong className="text-white">
              {news.author || "Rhevolver Media"}
            </strong>

            <span>•</span>

            <span>{formatDate(news.published_at, news.created_at)}</span>
          </div>
        </header>

        {news.featured_image && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#11131c] shadow-2xl">
            <img
              src={news.featured_image}
              alt={news.title}
              className="max-h-[680px] w-full object-cover"
            />
          </div>
        )}

        <div
          className="mt-10 rounded-3xl border border-white/10 bg-white p-6 text-lg leading-8 text-[#171717] shadow-2xl md:p-10
          [&_p]:mb-6
          [&_h2]:mb-4
          [&_h2]:mt-10
          [&_h2]:text-3xl
          [&_h2]:font-black
          [&_h3]:mb-3
          [&_h3]:mt-8
          [&_h3]:text-2xl
          [&_h3]:font-bold
          [&_ul]:mb-6
          [&_ul]:list-disc
          [&_ul]:pl-7
          [&_ol]:mb-6
          [&_ol]:list-decimal
          [&_ol]:pl-7
          [&_blockquote]:my-8
          [&_blockquote]:border-l-4
          [&_blockquote]:border-pink-600
          [&_blockquote]:pl-5
          [&_blockquote]:italic
          [&_blockquote]:text-zinc-600
          [&_img]:my-8
          [&_img]:h-auto
          [&_img]:max-w-full
          [&_img]:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <ShareButtons title={news.title} url={articleUrl} />

        {relatedNews.length > 0 && (
          <section className="mt-14">
            <div className="border-b border-white/10 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-500">
                Más información
              </p>

              <h2 className="mt-2 text-3xl font-black">
                También te puede interesar
              </h2>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticia/${item.slug || item.id}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#10121a] shadow-xl transition hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-pink-950/20"
                >
                  <div className="h-48 overflow-hidden bg-zinc-900">
                    {item.featured_image ? (
                      <img
                        src={item.featured_image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 via-violet-950 to-pink-950 text-4xl font-black text-white">
                        R
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-pink-500">
                      {item.category || "Noticias"}
                    </p>

                    <h3 className="mt-2 text-lg font-black leading-snug text-white transition group-hover:text-pink-400">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {item.summary}
                      </p>
                    )}

                    <p className="mt-4 text-xs text-zinc-500">
                      {formatDate(item.published_at, item.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-zinc-500">
            Publicado por Rhevolver Media Comunicaciones
          </p>

          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-bold text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
          >
            Ver más noticias
          </Link>
        </footer>
      </article>

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