import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Section = { title: string; paragraphs?: string[]; bullets?: string[] };

export default function InstitutionPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: Section[] }) {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <SiteHeader />
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,.2),transparent_38%),radial-gradient(circle_at_top_right,rgba(219,39,119,.16),transparent_36%)]">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 md:py-24">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-fuchsia-400">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">{intro}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:py-16">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.03em]">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-zinc-400">
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul className="grid gap-3 pl-5">{section.bullets.map((bullet) => <li key={bullet} className="list-disc">{bullet}</li>)}</ul>}
            </div>
          </section>
        ))}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link href="/contacto" className="rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-black">Contactar a Rhevolver</Link>
          <Link href="/" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-black">Volver a noticias</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
