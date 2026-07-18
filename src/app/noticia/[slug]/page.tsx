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

  const articleUrl = `http://localhost:3000/noticia/${news.slug || news.id}`;

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

          <Link
            href="/"
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
          >
            ← Volver a Inicio
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <header>
          <span className="inline-block rounded-full bg-pink-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
            {news.category || "Noticias"}
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {news.title}
          </h1>

          {news.summary && (
            <p className="mt-6 max-w-4xl text-xl leading-8 text-zinc-600">
              {news.summary}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-black/10 py-4 text-sm text-zinc-500">
            <strong className="text-black">
              {news.author || "Rhevolver Media"}
            </strong>

            <span>•</span>

            <span>
              {formatDate(news.published_at, news.created_at)}
            </span>
          </div>
        </header>

        {news.featured_image && (
          <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-200">
            <img
              src={news.featured_image}
              alt={news.title}
              className="max-h-[680px] w-full object-cover"
            />
          </div>
        )}

        <div
          className="mt-10 rounded-3xl border border-black/10 bg-white p-6 text-lg leading-8 shadow-sm md:p-10
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

        <ShareButtons
          title={news.title}
          url={articleUrl}
        />

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
          <p className="text-sm text-zinc-500">
            Publicado por Rhevolver Media Comunicaciones
          </p>

          <Link
            href="/"
            className="rounded-xl bg-[#111111] px-5 py-3 font-bold text-white hover:bg-pink-600"
          >
            Ver más noticias
          </Link>
        </footer>
      </article>
    </main>
  );
}