import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";
import ViewTracker from "@/components/ViewTracker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReadingProgress from "@/components/ReadingProgress";
import {
  DEFAULT_DESCRIPTION,
  PUBLISHER_NAME,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo";

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
  params: Promise<{ slug: string }>;
};

async function getNews(slug: string): Promise<NewsItem | null> {
  const numericId = Number(slug);

  let query = supabase
    .from("news")
    .select(
      "id, title, slug, summary, content, category, author, featured_image, status, created_at, published_at"
    )
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", new Date().toISOString());

  query =
    Number.isInteger(numericId) && numericId > 0
      ? query.eq("id", numericId)
      : query.eq("slug", slug);

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
  if (!category) return [];

  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, summary, category, featured_image, created_at, published_at"
    )
    .in("status", ["published", "featured", "scheduled"])
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

function articlePath(news: Pick<NewsItem, "id" | "slug">) {
  return `/noticia/${news.slug || news.id}`;
}


function categoryPath(category: string | null) {
  if (!category) return "/";

  const slug = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return `/categoria/${slug}`;
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

function isoDate(value: string | null, fallback: string) {
  return new Date(value || fallback).toISOString();
}

export async function generateMetadata({
  params,
}: NoticiaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    return {
      title: "Noticia no encontrada",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = articlePath(news);
  const description = news.summary?.trim() || DEFAULT_DESCRIPTION;
  const image = news.featured_image || undefined;

  return {
    title: news.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    authors: [{ name: news.author || "Rhevolver Media" }],
    category: news.category || "Noticias",
    openGraph: {
      type: "article",
      locale: "es_MX",
      siteName: SITE_NAME,
      url: canonicalPath,
      title: news.title,
      description,
      publishedTime: isoDate(news.published_at, news.created_at),
      modifiedTime: isoDate(news.published_at, news.created_at),
      authors: [news.author || "Rhevolver Media"],
      section: news.category || "Noticias",
      images: image
        ? [
            {
              url: image,
              alt: news.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const dynamic = "force-dynamic";

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) notFound();

  const relatedNews = await getRelatedNews(news.category, news.id);
  const canonicalPath = articlePath(news);
  const articleUrl = absoluteUrl(canonicalPath);
  const publishedDate = isoDate(news.published_at, news.created_at);
  const description = news.summary?.trim() || DEFAULT_DESCRIPTION;
  const plainText = news.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const readingMinutes = Math.max(1, Math.ceil(plainText.split(" ").filter(Boolean).length / 220));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description,
    image: news.featured_image ? [news.featured_image] : undefined,
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: news.category || "Noticias",
    isAccessibleForFree: true,
    url: articleUrl,
    inLanguage: "es-MX",
    author: {
      "@type": "Person",
      name: news.author || PUBLISHER_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-48 top-0 h-[520px] w-[520px] rounded-full bg-blue-700/20 blur-[140px]" />
        <div className="absolute -right-48 top-80 h-[560px] w-[560px] rounded-full bg-fuchsia-600/15 blur-[150px]" />
      </div>

      <ReadingProgress />
      <ViewTracker articleId={news.id} />
      <SiteHeader />

      <article className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 md:py-14 lg:px-8">
        <nav
          aria-label="Ruta de navegación"
          className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-500"
        >
          <Link href="/" className="transition hover:text-white">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={categoryPath(news.category)}
            className="transition hover:text-white"
          >
            {news.category || "Noticias"}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="line-clamp-1 text-zinc-700">{news.title}</span>
        </nav>

        <header className="mx-auto mt-8 max-w-5xl text-center">
          <Link
            href={categoryPath(news.category)}
            className="inline-flex rounded-full bg-fuchsia-600 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-fuchsia-600/20 transition hover:bg-fuchsia-500"
          >
            {news.category || "Noticias"}
          </Link>

          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
            {news.title}
          </h1>

          {news.summary && (
            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-400 sm:text-xl">
              {news.summary}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-zinc-500">
            <strong className="text-zinc-200">
              Por {news.author || "Rhevolver Media"}
            </strong>
            <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
            <time dateTime={publishedDate}>{formatDate(news.published_at, news.created_at)}</time>
            <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
            <span>{readingMinutes} min de lectura</span>
          </div>
        </header>

        {news.featured_image && (
          <figure className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#11131c] shadow-2xl shadow-black/35">
            <div className="relative aspect-[16/9] max-h-[760px] w-full">
              <Image
                src={news.featured_image}
                alt={news.title}
                fill
                priority
                sizes="(max-width: 1180px) 100vw, 1180px"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-white/10 px-5 py-3 text-xs text-zinc-600">
              Imagen principal de la información publicada por Rhevolver.news.
            </figcaption>
          </figure>
        )}

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div>
            <div
              className="article-body rounded-[2rem] border border-zinc-200/90 bg-white p-6 text-[1.05rem] leading-8 text-[#202124] shadow-2xl shadow-black/25 sm:p-9 md:p-12"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <ShareButtons title={news.title} url={articleUrl} />

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400">Autor</p>
              <h3 className="mt-2 text-xl font-black">{news.author || "Rhevolver Media"}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Contenido revisado por la mesa editorial de Rhevolver.news.</p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400">
                Nota editorial
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Rhevolver.news publica información de interés público con enfoque
                local, estatal y nacional. Puedes compartir esta noticia usando
                los botones disponibles en esta página.
              </p>
            </div>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-40 xl:self-start">
            <div className="rounded-2xl border border-white/10 bg-[#0b0e15] p-5 shadow-xl">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-fuchsia-400">
                Información
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-zinc-600">Sección</dt>
                  <dd className="mt-1 font-bold text-zinc-300">
                    {news.category || "Noticias"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Autor</dt>
                  <dd className="mt-1 font-bold text-zinc-300">
                    {news.author || "Rhevolver Media"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-600">Publicado</dt>
                  <dd className="mt-1 leading-6 text-zinc-400">
                    {formatDate(news.published_at, news.created_at)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-700/20 via-[#0b0e15] to-fuchsia-700/20 p-5">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-fuchsia-300">
                Sigue la conversación
              </p>
              <h2 className="mt-2 text-xl font-black">Rhevolver.news</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Noticias, videos y coberturas en nuestras plataformas oficiales.
              </p>
              <a
                href="https://whatsapp.com/channel/0029Vb8o6fODzgTKUBkxkH2o"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-500"
              >
                Seguir canal de WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {relatedNews.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-500">
                  Más información
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  También te puede interesar
                </h2>
              </div>
              <Link
                href={categoryPath(news.category)}
                className="text-sm font-bold text-zinc-500 transition hover:text-white"
              >
                Ver sección →
              </Link>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticia/${item.slug || item.id}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-[#10121a] shadow-xl transition hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-fuchsia-950/20"
                >
                  <div className="relative h-52 overflow-hidden bg-zinc-900">
                    {item.featured_image ? (
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 via-violet-950 to-fuchsia-950 text-4xl font-black text-white">
                        R<span className="text-fuchsia-400">.</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.17em] text-fuchsia-500">
                      {item.category || "Noticias"}
                    </p>
                    <h3 className="mt-2 line-clamp-3 text-lg font-black leading-snug text-white transition group-hover:text-fuchsia-400">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {item.summary}
                      </p>
                    )}
                    <p className="mt-4 text-xs text-zinc-600">
                      {formatDate(item.published_at, item.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-zinc-500">
            Publicado por Rhevolver Media Comunicaciones
          </p>
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5"
          >
            Ver más noticias
          </Link>
        </footer>
      </article>

      <SiteFooter />
    </main>
  );
}
