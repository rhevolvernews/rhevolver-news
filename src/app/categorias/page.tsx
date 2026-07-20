import Link from "next/link";
import { supabase } from "@/lib/supabase";

const baseCategories = ["Local", "Iguala", "Guerrero", "México", "Internacional", "Deportes", "Espectáculos", "Opinión"];

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const { data } = await supabase.from("news").select("category");
  const counts = new Map<string, number>();
  for (const item of data ?? []) {
    const category = item.category || "Sin categoría";
    counts.set(category, (counts.get(category) || 0) + 1);
  }

  const categories = Array.from(new Set([...baseCategories, ...counts.keys()]));

  return (
    <main className="min-h-screen bg-[#07080d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-pink-500">RHEVOLVER CMS</p>
            <h1 className="mt-2 text-4xl font-black">Categorías</h1>
            <p className="mt-2 text-zinc-400">Consulta las secciones editoriales y cuántas noticias utiliza cada una.</p>
          </div>
          <Link href="/admin" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10">← Dashboard</Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article key={category} className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3b51b]">Sección</p>
              <h2 className="mt-2 text-2xl font-black">{category}</h2>
              <p className="mt-4 text-sm text-zinc-500">{counts.get(category) || 0} noticias</p>
            </article>
          ))}
        </section>

        <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-zinc-400">
          Las categorías se asignan desde los formularios de nueva noticia y edición. Esta vista permite revisar su uso sin añadir opciones innecesarias al CMS.
        </p>
      </div>
    </main>
  );
}
