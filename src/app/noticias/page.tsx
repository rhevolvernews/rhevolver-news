import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NewsActions from "./NewsActions";

type NewsItem = { id:number; title:string; category:string|null; author:string|null; status:string|null; created_at:string; published_at:string|null };

async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("id, title, category, author, status, created_at, published_at").order("created_at", { ascending:false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

function formatDate(value:string|null, fallback:string) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle:"medium", timeStyle:"short" }).format(new Date(value || fallback));
}

const statusInfo: Record<string, {label:string; className:string}> = {
  published:{label:"Publicada",className:"bg-emerald-500/10 text-emerald-300"},
  featured:{label:"Destacada",className:"bg-fuchsia-500/10 text-fuchsia-300"},
  scheduled:{label:"Programada",className:"bg-blue-500/10 text-blue-300"},
  draft:{label:"Borrador",className:"bg-amber-500/10 text-amber-300"},
  archived:{label:"Archivada",className:"bg-zinc-500/10 text-zinc-300"},
  trash:{label:"Papelera",className:"bg-red-500/10 text-red-300"},
};

export const dynamic = "force-dynamic";

export default async function NoticiasPage({ searchParams }: { searchParams: Promise<{view?:string}> }) {
  const { view = "active" } = await searchParams;
  const allNews = await getNews();
  const news = view === "trash" ? allNews.filter(i => i.status === "trash") : view === "archived" ? allNews.filter(i => i.status === "archived") : allNews.filter(i => i.status !== "trash" && i.status !== "archived");

  return <main className="min-h-screen bg-[#07080d] px-5 py-8 text-white md:px-10"><div className="mx-auto max-w-7xl">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-black tracking-[0.22em] text-pink-500">RHEVOLVER CMS</p><h1 className="text-4xl font-black tracking-tight">Sistema editorial</h1><p className="mt-2 text-zinc-400">Publica, programa, destaca, duplica, archiva y recupera noticias.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10">← Dashboard</Link><Link href="/nueva-noticia" className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-bold">+ Nueva noticia</Link></div></header>
    <nav className="mb-5 flex flex-wrap gap-2"><Link href="/noticias" className={`rounded-full px-4 py-2 text-sm font-bold ${view==="active"?"bg-white text-black":"bg-white/5 text-zinc-400"}`}>Activas</Link><Link href="/noticias?view=archived" className={`rounded-full px-4 py-2 text-sm font-bold ${view==="archived"?"bg-white text-black":"bg-white/5 text-zinc-400"}`}>Archivadas</Link><Link href="/noticias?view=trash" className={`rounded-full px-4 py-2 text-sm font-bold ${view==="trash"?"bg-white text-black":"bg-white/5 text-zinc-400"}`}>Papelera</Link></nav>
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#11131c]"><div className="border-b border-white/10 px-6 py-5 text-sm text-zinc-400">Registros: <strong className="text-white">{news.length}</strong></div>
      {news.length===0 ? <div className="grid min-h-72 place-items-center p-8 text-center text-zinc-500">No hay noticias en esta sección.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px]"><thead><tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-zinc-500"><th className="px-6 py-4">Título</th><th className="px-6 py-4">Categoría</th><th className="px-6 py-4">Autor</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Fecha editorial</th><th className="px-6 py-4">Acciones</th></tr></thead><tbody>{news.map(item=>{const info=statusInfo[item.status||"draft"]||statusInfo.draft; return <tr key={item.id} className="border-b border-white/5 align-top hover:bg-white/[0.03]"><td className="px-6 py-5"><strong className="block max-w-md">{item.title}</strong><span className="mt-1 block text-xs text-zinc-600">ID: {item.id}</span></td><td className="px-6 py-5 text-zinc-300">{item.category||"Sin categoría"}</td><td className="px-6 py-5 text-zinc-300">{item.author||"Sin autor"}</td><td className="px-6 py-5"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${info.className}`}>{info.label}</span></td><td className="px-6 py-5 text-sm text-zinc-400">{formatDate(item.published_at,item.created_at)}</td><td className="px-6 py-5"><div className="flex max-w-md flex-wrap gap-2">{view!=="trash"&&<Link href={`/noticias/editar/${item.id}`} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold hover:bg-blue-800">Editar</Link>}<NewsActions id={item.id} title={item.title} status={item.status}/></div></td></tr>})}</tbody></table></div>}
    </section>
  </div></main>;
}
