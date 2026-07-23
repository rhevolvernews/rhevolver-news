import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import IgualaLiveStrip from "@/components/IgualaLiveStrip";
import SiteFooter from "@/components/SiteFooter";
import HomeHeroCarousel from "@/components/HomeHeroCarousel";
import PlatformIcon from "@/components/PlatformIcon";
import VideoIndicator from "@/components/VideoIndicator";

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
  status: string | null;
  content: string | null;
};

const editorialSections = [
  { label: "Local", slug: "local", accent: "text-cyan-300" },
  { label: "Guerrero", slug: "guerrero", accent: "text-blue-300" },
  { label: "Política", slug: "politica", accent: "text-fuchsia-300" },
  { label: "Nacional", slug: "nacional", accent: "text-violet-300" },
];

async function getPublishedNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, summary, featured_image, category, author, published_at, created_at, status, content")
    .in("status", ["published", "featured", "scheduled"])
    .order("published_at", { ascending: false })
    .limit(80);

  if (error) {
    console.error("Error al cargar noticias:", error.message);
    return [];
  }

  const now = Date.now();
  return (data ?? [])
    .filter((item) => item.status !== "scheduled" || (item.published_at && new Date(item.published_at).getTime() <= now))
    .sort((a, b) => {
      if (a.status === "featured" && b.status !== "featured") return -1;
      if (b.status === "featured" && a.status !== "featured") return 1;
      return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
    });
}

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value || fallback));
}

function articleHref(item: NewsItem) {
  return `/noticia/${item.slug || item.id}`;
}

function normalizeCategory(value: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}



function takeUnique(
  items: NewsItem[],
  used: Set<number>,
  limit: number,
  predicate: (item: NewsItem) => boolean = () => true
) {
  const selected: NewsItem[] = [];
  for (const item of items) {
    if (selected.length >= limit) break;
    if (used.has(item.id) || !predicate(item)) continue;
    used.add(item.id);
    selected.push(item);
  }
  return selected;
}

function hasVideo(item: NewsItem) {
  const category = normalizeCategory(item.category);
  const content = item.content || "";
  return (
    category === "videos" ||
    category === "tv-show" ||
    /<video[\s>]|data-video-embed=["']true["']/i.test(content)
  );
}

function NewsImage({ item, className, sizes = "(max-width: 768px) 100vw, 33vw" }: { item: NewsItem; className: string; sizes?: string }) {
  if (!item.featured_image) {
    return (
      <div className={`${className} grid place-items-center bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.55),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(219,39,119,0.45),_transparent_40%),#10131d]`}>
        <span className="text-4xl font-black tracking-[-0.08em] text-white/90">R<span className="text-fuchsia-400">.</span></span>
      </div>
    );
  }

  return (
    <Image
      src={item.featured_image}
      alt={item.title}
      fill
      sizes={sizes}
      className={className}
    />
  );
}

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="rhevolver-section-heading flex flex-wrap items-end justify-between gap-4 pb-4">
      <div className="relative pl-5">
        <span className="rhevolver-section-heading__rail" aria-hidden="true" />
        <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#f6c944]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
      {href && <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white">Ver más <span aria-hidden="true">→</span></Link>}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await getPublishedNews();
  const used = new Set<number>();
  const carouselNews = takeUnique(news, used, 3);
  const secondaryNews = takeUnique(news, used, 4);
  const latestNews = takeUnique(news, used, 6);
  const trendingNews = takeUnique(news, used, 6);

  const editorialNewsBySection = new Map<string, NewsItem[]>();
  for (const section of editorialSections) {
    const items = takeUnique(
      news,
      used,
      3,
      (item) => normalizeCategory(item.category) === section.slug
    );
    editorialNewsBySection.set(section.slug, items);
  }

  const videoNews = takeUnique(news, used, 3, hasVideo);
  const hasLatestOrTrending = latestNews.length > 0 || trendingNews.length > 0;
  const hasEditorialCoverage = editorialSections.some(
    (section) => (editorialNewsBySection.get(section.slug) ?? []).length > 0
  );

  return (
    <main id="top" className="rhevolver-home min-h-screen overflow-x-hidden text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-15rem] top-[-12rem] h-[38rem] w-[38rem] rounded-full bg-blue-700/20 blur-[150px]" />
        <div className="absolute right-[-16rem] top-[22rem] h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/15 blur-[160px]" />
      </div>

      <SiteHeader />

      <section className="rhevolver-frontline" aria-label="Portada editorial">
        <div className="rhevolver-frontline__mesh" />
        <div className="rhevolver-frontline__flare rhevolver-frontline__flare--violet" />
        <div className="rhevolver-frontline__flare rhevolver-frontline__flare--pink" />
        <IgualaLiveStrip />
      </section>

      <section className="rhevolver-breaking border-b border-white/10">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
          <strong className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.18em] shadow-lg shadow-red-600/20">Última hora</strong>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="rhevolver-ticker-final flex min-w-max items-center" aria-label="Últimas noticias">
              {[0, 1].map((group) => (
                <div key={group} className="rhevolver-ticker-final__group flex shrink-0 items-center gap-12 pr-12" aria-hidden={group === 1}>
                  {(carouselNews.length ? carouselNews : [{ id: 0, title: "Muy pronto encontrarás aquí las noticias más relevantes." }]).map((item) => (
                    <span key={`${group}-${item.id}`} className="whitespace-nowrap text-sm font-medium text-zinc-200">{item.title}<i className="ml-12 inline-block h-1 w-1 rounded-full bg-fuchsia-400 align-middle" /></span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-8">
        {news.length === 0 ? (
          <section className="grid min-h-[60vh] place-items-center rounded-[2rem] border border-white/10 bg-[#0c0e15] p-8 text-center shadow-2xl">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-fuchsia-500/10 text-3xl">📰</div>
              <h1 className="mt-6 text-3xl font-black">Aún no hay noticias publicadas</h1>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-zinc-400">Las noticias publicadas desde Rhevolver CMS aparecerán automáticamente en esta portada.</p>
              <Link href="/sobre-rhevolver" className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-6 py-3 font-bold">Conoce Rhevolver</Link>
            </div>
          </section>
        ) : (
          <>
            <section className="rhevolver-lead-grid grid gap-5 xl:grid-cols-[minmax(0,1.62fr)_minmax(340px,0.72fr)]">
              <HomeHeroCarousel items={carouselNews} />
              <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {secondaryNews.map((item, index) => (
                  <Link key={item.id} href={articleHref(item)} className="rhevolver-side-card group grid min-h-[142px] overflow-hidden sm:grid-cols-[132px_1fr]">
                    <div className="relative min-h-40 overflow-hidden bg-zinc-900 sm:min-h-full">
                      <NewsImage item={item} sizes="132px" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      {hasVideo(item) && <VideoIndicator compact className="absolute right-3 top-3" />}
                      <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-xs font-black backdrop-blur">{String(index + 2).padStart(2, "0")}</span>
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-fuchsia-400">{item.category || "Noticias"}</p>
                        <h2 className="mt-2 line-clamp-3 text-base font-black leading-snug transition group-hover:text-fuchsia-300">{item.title}</h2>
                      </div>
                      <p className="mt-3 text-[0.68rem] text-zinc-500">{formatDate(item.published_at, item.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </aside>
            </section>

            {hasLatestOrTrending && <section className="deferred-section mt-12 grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
              {latestNews.length > 0 && <div>
                <SectionHeading eyebrow="Actualidad" title="Lo más reciente" href="/categoria/ultima-hora" />
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {latestNews.slice(0, 6).map((item) => (
                    <Link key={item.id} href={articleHref(item)} className="rhevolver-news-card group overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <NewsImage item={item} sizes="(max-width: 768px) 100vw, 33vw" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        {hasVideo(item) && <VideoIndicator compact className="absolute right-3 top-3" />}
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] backdrop-blur">{item.category || "Noticias"}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="line-clamp-3 text-lg font-black leading-snug transition group-hover:text-fuchsia-300">{item.title}</h3>
                        {item.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">{item.summary}</p>}
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[0.68rem] text-zinc-500"><span>{item.author || "Rhevolver"}</span><span>{formatDate(item.published_at, item.created_at)}</span></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>}

              {trendingNews.length > 0 && <aside className="rhevolver-trending-panel rounded-[1.75rem] p-5 xl:sticky xl:top-40 xl:self-start">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-fuchsia-400">En tendencia</p>
                <h2 className="mt-1 text-2xl font-black">Lo más destacado</h2>
                <div className="mt-5 divide-y divide-white/10">
                  {trendingNews.map((item, index) => (
                    <Link key={item.id} href={articleHref(item)} className="group grid grid-cols-[42px_1fr] gap-3 py-4 first:pt-0 last:pb-0">
                      <span className="text-2xl font-black text-white/15 transition group-hover:text-fuchsia-500/70">{String(index + 1).padStart(2, "0")}</span>
                      <div><p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-zinc-600">{item.category || "Noticias"}</p><h3 className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-zinc-300 transition group-hover:text-white">{item.title}</h3></div>
                    </Link>
                  ))}
                </div>
              </aside>}
            </section>}

{hasEditorialCoverage && <section className="rhevolver-editorial-panel deferred-section mt-14 rounded-[2rem] p-5 sm:p-7">
              <SectionHeading eyebrow="Cobertura editorial" title="La conversación de hoy" />
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {editorialSections.map((section) => {
                  const categoryNews = editorialNewsBySection.get(section.slug) ?? [];
                  if (!categoryNews.length) return null;
                  const [lead, ...rest] = categoryNews;
                  return (
                    <article key={section.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h3 className={`text-sm font-black uppercase tracking-[0.18em] ${section.accent}`}>{section.label}</h3><Link href={`/categoria/${section.slug}`} className="text-xs font-bold text-zinc-500 hover:text-white">Ver sección →</Link></div>
                      <Link href={articleHref(lead)} className="group grid sm:grid-cols-[210px_1fr]">
                        <div className="relative min-h-48 overflow-hidden"><NewsImage item={lead} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />{hasVideo(lead) && <VideoIndicator compact className="absolute right-3 top-3" />}</div>
                        <div className="p-5"><h4 className="line-clamp-3 text-xl font-black leading-snug transition group-hover:text-fuchsia-300">{lead.title}</h4>{lead.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">{lead.summary}</p>}</div>
                      </Link>
                      {rest.length > 0 && <div className="divide-y divide-white/10 border-t border-white/10 px-5">{rest.map((item) => <Link key={item.id} href={articleHref(item)} className="group flex items-start gap-3 py-4"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fuchsia-500" /><h4 className="line-clamp-2 text-sm font-bold leading-6 text-zinc-300 group-hover:text-white">{item.title}</h4></Link>)}</div>}
                    </article>
                  );
                })}
              </div>
            </section>}

            {videoNews.length > 0 && <section className="deferred-section mt-14">
              <SectionHeading eyebrow="Rhevolver visual" title="Videos y contenidos" href="/videos" />
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {videoNews.map((item, index) => (
                  <Link key={item.id} href={articleHref(item)} className={`rhevolver-video-card group relative overflow-hidden rounded-[1.75rem] ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                    <div className={`relative overflow-hidden ${index === 0 ? "aspect-[16/9] lg:h-full" : "aspect-video"}`}>
                      <NewsImage item={item} sizes="(max-width: 768px) 100vw, 33vw" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                      <VideoIndicator className="absolute left-5 top-5 transition group-hover:scale-110 group-hover:bg-fuchsia-600" />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6"><p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-fuchsia-300">{item.category || "Rhevolver TV"}</p><h3 className={`mt-2 line-clamp-3 font-black leading-tight ${index === 0 ? "text-2xl sm:text-3xl" : "text-lg"}`}>{item.title}</h3></div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>}

            <section className="rhevolver-social-stage deferred-section mt-14 overflow-hidden rounded-[2rem] p-6 sm:p-9">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div><p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-fuchsia-300">Mantente informado</p><h2 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Rhevolver en todas tus plataformas</h2><p className="mt-3 max-w-2xl leading-7 text-zinc-400">Noticias, videos y contenidos que explican lo que está pasando.</p></div>
                <div className="grid w-full grid-cols-2 gap-3 lg:w-[31rem]">
                  <a href="https://www.facebook.com/rhevolvermx" target="_blank" rel="noreferrer" className="social-cta social-cta--facebook justify-center bg-blue-600"><PlatformIcon name="facebook" /> Facebook</a>
                  <a href="https://www.instagram.com/rhevolvermx" target="_blank" rel="noreferrer" className="social-cta social-cta--instagram justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600"><PlatformIcon name="instagram" /> Instagram</a>
                  <a href="https://whatsapp.com/channel/0029Vb8o6fODzgTKUBkxkH2o" target="_blank" rel="noreferrer" className="social-cta social-cta--whatsapp justify-center bg-emerald-600 text-center"><PlatformIcon name="whatsapp" /> <span>Canal de WhatsApp</span></a>
                  <a href="https://x.com/rhevolvercdmx" target="_blank" rel="noreferrer" className="social-cta social-cta--x justify-center bg-zinc-950 ring-1 ring-white/15"><PlatformIcon name="x" /> X</a>
                  <a href="https://www.tiktok.com/@rhevolvercdmx" target="_blank" rel="noreferrer" className="social-cta social-cta--tiktok justify-center bg-black ring-1 ring-white/15"><PlatformIcon name="tiktok" /> TikTok</a>
                  <a href="https://www.youtube.com/@RhevolverMx" target="_blank" rel="noreferrer" className="social-cta social-cta--youtube justify-center bg-red-600"><PlatformIcon name="youtube" /> YouTube</a>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <SiteFooter />
      <a href="#top" aria-label="Volver arriba" className="scroll-top-premium fixed bottom-5 right-5 z-40 grid place-items-center">↑</a>
    </main>
  );
}
