import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import VideoIndicator from "@/components/VideoIndicator";

type NewsItem = {
  id: number;
  title: string;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
  content: string | null;
};

type CategoriaPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getNews(category: string): Promise<NewsItem[]> {
  let query = supabase
    .from("news")
    .select(
      "id, title, slug, summary, featured_image, category, published_at, created_at, content"
    )
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", new Date().toISOString());

  // Compatibilidad con publicaciones antiguas de Opinión:
  // algunas quedaron como "Editorial" aunque editorialmente son Opinión.
  if (category.toLocaleLowerCase("es-MX") === "opinión") {
    query = query.or("category.ilike.Opinión,category.ilike.Opinion,category.ilike.Editorial");
  } else {
    query = query.ilike("category", category);
  }

  const { data, error } = await query.order("published_at", { ascending: false });

  if (error) {
    console.error("Error al cargar la categoría:", error.message);
    return [];
  }

  return data ?? [];
}

function formatDate(value: string | null, fallback: string) {
  const date = new Date(value || fallback);
  const datePart = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(/\./g, "")
    .toUpperCase();
  const timePart = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} · ${timePart} HRS`;
}

function formatCategoryName(slug: string) {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  // La URL histórica es /categoria/opinion (sin acento), pero la categoría
  // almacenada en el CMS es "Opinión".
  if (decoded.trim().toLocaleLowerCase("es-MX") === "opinion") return "Opinión";
  if (decoded.trim().toLocaleLowerCase("es-MX") === "en contexto") return "En Contexto | Reporte Rhevolver";

  return decoded
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function hasVideo(content: string | null) {
  return /<video[\s>]|data-video-embed=["\']true["\']|<!--RHEVOLVER_VIDEO:/i.test(content || "");
}

export const dynamic = "force-dynamic";

export default async function CategoriaPage({
  params,
}: CategoriaPageProps) {
  const { slug } = await params;
  const categoria = formatCategoryName(slug);
  const news = await getNews(categoria);
  const enContexto = categoria === "En Contexto | Reporte Rhevolver";

  return (
    <main
      className={`rhevolver-category-page min-h-screen overflow-hidden text-white ${enContexto ? "rhevolver-category-page--en-contexto bg-[#011135]" : "bg-[#05060a]"}`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={`absolute -left-48 top-0 h-[520px] w-[520px] rounded-full blur-[140px] ${enContexto ? "bg-[#1677d4]/20" : "bg-blue-700/20"}`} />
        <div className={`absolute -right-48 top-72 h-[560px] w-[560px] rounded-full blur-[150px] ${enContexto ? "bg-[#087bd1]/20" : "bg-pink-600/15"}`} />
      </div>

      <header className={`border-b border-white/10 backdrop-blur-xl ${enContexto ? "bg-[#01102f]/95" : "bg-[#07080d]/95"}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-xl font-black shadow-lg transition group-hover:scale-105 ${enContexto ? "from-[#58dafe] via-[#0671bc] to-[#f9047d] shadow-[#0583c9]/20" : "from-blue-600 via-violet-600 to-pink-600 shadow-pink-500/20"}`}>
              R
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight">
                Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span>
              </p>

              <p className="text-xs text-zinc-500">
                Información que revoluciona
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className={`rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white ${enContexto ? "hover:border-[#58dafe]/50" : "hover:border-pink-500/40"}`}
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <section className={`border-b border-white/10 bg-gradient-to-r ${enContexto ? "from-[#011135]/90 via-[#04377b]/85 to-[#011a47]/80" : "from-blue-950/70 via-[#11131c] to-pink-950/60"}`}>
        <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <p className={`text-xs font-black uppercase tracking-[0.22em] ${enContexto ? "text-[#58dafe]" : "text-pink-500"}`}>
            Sección
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            {categoria}
          </h1>

          {enContexto && (
            <div className="mt-5 flex items-center gap-2" aria-hidden="true">
              <span className="h-1.5 w-24 bg-[#58dafe]" />
              <span className="h-1.5 w-12 bg-[#f9047d]" />
            </div>
          )}

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
                className={`group overflow-hidden rounded-3xl border border-white/10 shadow-xl transition hover:-translate-y-1 ${enContexto ? "bg-[#051b46] hover:border-[#58dafe]/50 hover:shadow-[#001333]/30" : "bg-[#10121a] hover:border-pink-500/40 hover:shadow-pink-950/20"}`}
              >
                <div className="relative h-56 overflow-hidden bg-zinc-900">
                  {item.featured_image ? (
                    <Image
                      src={item.featured_image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`grid h-full place-items-center bg-gradient-to-br text-4xl font-black ${enContexto ? "from-[#032d68] via-[#011135] to-[#3b164f]" : "from-blue-950 via-violet-950 to-pink-950"}`}>
                      R
                    </div>
                  )}
                  {hasVideo(item.content) && <VideoIndicator className="absolute left-4 top-4" />}
                </div>

                <div className="p-6">
                  <p className={`text-xs font-black uppercase tracking-wider ${enContexto ? "text-[#ff278e]" : "text-pink-500"}`}>
                    {item.category || categoria}
                  </p>

                  <h2 className={`mt-3 text-xl font-black leading-snug transition ${enContexto ? "group-hover:text-[#58dafe]" : "group-hover:text-pink-400"}`}>
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
          <div className={`grid min-h-[46vh] place-items-center rounded-3xl border border-dashed border-white/10 p-10 text-center shadow-2xl ${enContexto ? "bg-[#051b46]" : "bg-[#10121a]"}`}>
            <div>
              <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl ${enContexto ? "bg-[#f9047d]/15" : "bg-pink-500/10"}`}>
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
                className={`mt-6 inline-block rounded-xl bg-gradient-to-r px-6 py-3 font-bold shadow-lg ${enContexto ? "from-[#0879cf] to-[#f9047d] shadow-[#053b81]/30" : "from-pink-500 to-pink-700 shadow-pink-500/20"}`}
              >
                Volver a la portada
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer className={`border-t border-white/10 ${enContexto ? "bg-[#01102f]" : "bg-[#07080d]"}`}>
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br font-black ${enContexto ? "from-[#58dafe] to-[#f9047d]" : "from-blue-600 to-pink-600"}`}>
                R
              </div>

              <p className="text-2xl font-black">
                Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span>
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