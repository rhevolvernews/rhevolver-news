import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: number;
  title: string;
  category: string | null;
  author: string | null;
  status: string | null;
  created_at: string;
  published_at: string | null;
};

async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, category, author, status, created_at, published_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function NoticiasPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-[#07080d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.22em] text-pink-500">
              RHEVOLVER CMS
            </p>

            <h1 className="text-4xl font-black tracking-tight">
              Noticias
            </h1>

            <p className="mt-2 text-zinc-400">
              Consulta y administra las noticias guardadas en Supabase.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
            >
              ← Dashboard
            </Link>

            <Link
              href="/nueva-noticia"
              className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-bold shadow-lg shadow-pink-500/20"
            >
              + Nueva noticia
            </Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#11131c]">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-sm text-zinc-400">
              Total de registros:{" "}
              <strong className="text-white">{news.length}</strong>
            </p>
          </div>

          {news.length === 0 ? (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-500/10 text-2xl text-pink-500">
                  ▤
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  No hay noticias todavía
                </h2>

                <p className="mt-2 text-zinc-500">
                  La primera noticia que guardes aparecerá aquí.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4">Título</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Autor</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {news.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <strong className="block max-w-md">
                          {item.title}
                        </strong>

                        <span className="mt-1 block text-xs text-zinc-600">
                          ID: {item.id}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-zinc-300">
                        {item.category || "Sin categoría"}
                      </td>

                      <td className="px-6 py-5 text-zinc-300">
                        {item.author || "Sin autor"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "published"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {item.status === "published"
                            ? "Publicada"
                            : "Borrador"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-5">
  <div className="flex items-center gap-2">
    <Link
      href={`/noticias/editar/${item.id}`}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
    >
      ✏ Editar
    </Link>

    <DeleteButton
      id={item.id}
      title={item.title}
    />
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}