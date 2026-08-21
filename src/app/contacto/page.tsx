import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Contacto",
  description:
    "Contacta a la redacción de Rhevolver para información, correcciones, publicidad y colaboraciones.",
};

const whatsappMessage = encodeURIComponent(
  "Hola, quiero contactar a la redacción de Rhevolver.news."
);

const whatsappContactUrl =
  `https://wa.me/527335841460?text=${whatsappMessage}`;

export default function Page() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-[var(--rhevolver-pink)]">
            Contacto
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-[-.05em]">
            Hablemos
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Información, denuncias ciudadanas, correcciones, colaboraciones,
            publicidad y alianzas.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <a
            href="mailto:contacto@rhevolver.news"
            className="rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-[var(--rhevolver-pink)]/60"
          >
            <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--rhevolver-pink)]">
              Correo editorial
            </p>
            <h2 className="mt-3 text-xl font-black">
              contacto@rhevolver.news
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Incluye datos de contacto, contexto y documentos relevantes.
            </p>
          </a>

          <a
            href={whatsappContactUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border border-white/10 bg-white/[.035] p-7 transition hover:-translate-y-1 hover:border-emerald-500/60"
          >
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-400">
              Atención por WhatsApp
            </p>
            <h2 className="mt-3 text-xl font-black">
              Enviar mensaje por WhatsApp
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Abre una conversación para enviar información o contactar a la
              redacción. El canal de noticias permanece únicamente en Redes.
            </p>
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/correcciones"
            className="text-sm font-black text-[var(--rhevolver-pink)]"
          >
            Solicitar una corrección →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
