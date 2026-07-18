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

type BuscarPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

async function searchNews(query: string): Promise<NewsItem[]> {
  if (!query) return [];

  const { data, error } = await supabase
    .from("news")
    .select(
      "id,title,slug,summary,featured_image,category,published_at,created_at"
    )
    .eq("status", "published")
    .or(
      `title.ilike.%${query}%,summary.ilike.%${query}%,category.ilike.%${query}%`
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error(error);
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

export default async function BuscarPage({
  searchParams,
}: BuscarPageProps) {
  const { q = "" } = await searchParams;

  const news = await searchNews(q);

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <Link
          href="/"
          className="text-sm font-bold text-pink-600 hover:underline"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mt-5 text-5xl font-black">
          Buscar noticias
        </h1>

        <p className="mt-3 text-zinc-500">
          Resultados para:
          <strong> "{q}"</strong>
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {news.map((item) => (
            <Link
              key={item.id}
              href={`/noticia/${item.slug || item.id}`}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-xl"
            >
              {item.featured_image && (
                <img
                  src={item.featured_image}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-6">

                <p className="text-xs font-black uppercase text-pink-600">
                  {item.category}
                </p>

                <h2 className="mt-2 text-xl font-black">
                  {item.title}
                </h2>

                {item.summary && (
                  <p className="mt-3 line-clamp-3 text-zinc-600">
                    {item.summary}
                  </p>
                )}

                <p className="mt-5 text-xs text-zinc-500">
                  {formatDate(item.published_at, item.created_at)}
                </p>

              </div>
            </Link>
          ))}

        </div>

        {news.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">

            <h2 className="text-2xl font-black">
              No se encontraron resultados
            </h2>

            <p className="mt-3 text-zinc-500">
              Intenta buscar otra palabra.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}