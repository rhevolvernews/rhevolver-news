import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/lib/supabase";

export const metadata={title:"Videos",description:"Videos, entrevistas y contenidos visuales de Rhevolver.news."};
export const dynamic="force-dynamic";

export default async function Page(){
  const {data}=await supabase.from("news").select("id,title,slug,summary,featured_image,category,published_at,created_at,status").in("status",["published","featured"]).or("category.ilike.%video%,category.ilike.%tv show%").order("published_at",{ascending:false}).limit(24);
  const items=data??[];
  return <main className="min-h-screen bg-[#05060a] text-white"><SiteHeader/><section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-xs font-black uppercase tracking-[.22em] text-fuchsia-400">Rhevolver visual</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em] sm:text-5xl">Videos y contenidos</h1></div><p className="max-w-xl text-sm leading-6 text-zinc-500">Entrevistas, coberturas, explicadores y contenidos audiovisuales publicados por Rhevolver.</p></div>{items.length===0?<div className="grid min-h-[45vh] place-items-center text-center"><div><p className="text-4xl">▶</p><h2 className="mt-4 text-2xl font-black">Próximamente</h2><p className="mt-2 text-zinc-500">Los videos publicados desde el CMS aparecerán aquí.</p></div></div>:<div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item)=><Link key={item.id} href={`/noticia/${item.slug||item.id}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d1018] transition hover:-translate-y-1 hover:border-fuchsia-500/40"><div className="relative aspect-video overflow-hidden bg-black">{item.featured_image?<Image src={item.featured_image} alt={item.title} fill sizes="(max-width:768px) 100vw,33vw" className="object-cover transition duration-700 group-hover:scale-105"/>:<div className="grid h-full place-items-center bg-gradient-to-br from-blue-950 to-fuchsia-950 text-4xl font-black">R.</div>}<span className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/60 backdrop-blur">▶</span></div><div className="p-5"><p className="text-[.65rem] font-black uppercase tracking-[.18em] text-fuchsia-400">{item.category||"Video"}</p><h2 className="mt-2 line-clamp-3 text-xl font-black leading-snug">{item.title}</h2>{item.summary&&<p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">{item.summary}</p>}</div></Link>)}</div>}</section><SiteFooter/></main>
}
