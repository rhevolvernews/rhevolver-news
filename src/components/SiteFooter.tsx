import Link from "next/link";
import PlatformIcon from "@/components/PlatformIcon";

const networks = [
  { label: "Facebook", href: "https://www.facebook.com/rhevolvermx", icon: "facebook" as const, tone: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/rhevolvermx", icon: "instagram" as const, tone: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@rhevolvercdmx", icon: "tiktok" as const, tone: "tiktok" },
  { label: "X", href: "https://x.com/rhevolvercdmx", icon: "x" as const, tone: "x" },
  { label: "YouTube", href: "https://www.youtube.com/@RhevolverMx", icon: "youtube" as const, tone: "youtube" },
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb8o6fODzgTKUBkxkH2o", icon: "whatsapp" as const, tone: "whatsapp" },
];

export default function SiteFooter() {
  return (
    <footer className="rhevolver-footer border-t border-white/10 text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_.7fr_.9fr_.9fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-[#ffd400] shadow-[0_18px_55px_rgba(246,201,68,.18)]">
                <span className="text-2xl font-black tracking-[-.12em] text-[#111827]">R<span className="text-[var(--rhevolver-pink)]">.</span></span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-[-.05em]">Rhevolver<span className="text-[var(--rhevolver-pink)]">.news</span></p>
                <p className="text-[.62rem] font-bold uppercase tracking-[.2em] text-zinc-600">Información que revoluciona</p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-zinc-500">
              Casa editorial digital independiente con información local, estatal, nacional e internacional, análisis, tecnología y entretenimiento.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {networks.map((network) => (
                <a
                  key={network.label}
                  href={network.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={network.label}
                  className={`footer-social footer-social--${network.tone}`}
                >
                  <PlatformIcon name={network.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Secciones</h3>
            <div className="footer-links">
              <Link href="/categoria/local">Local</Link>
              <Link href="/categoria/guerrero">Guerrero</Link>
              <Link href="/categoria/nacional">Nacional</Link>
              <Link href="/categoria/politica">Política</Link>
              <Link href="/videos">Videos</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Conócenos</h3>
            <div className="footer-links">
              <Link href="/sobre-rhevolver">Sobre Rhevolver</Link>
              <Link href="/mision-vision">Misión, visión y valores</Link>
              <Link href="/principios-editoriales">Principios editoriales</Link>
              <Link href="/transparencia">Transparencia</Link>
              <Link href="/contacto">Contacto</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Legal</h3>
            <div className="footer-links">
              <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
              <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
              <Link href="/politica-de-cookies">Política de cookies</Link>
              <Link href="/responsabilidad-editorial">Responsabilidad editorial</Link>
              <Link href="/publicidad-y-alianzas">Publicidad y alianzas</Link>
              <a href="mailto:contacto@rhevolver.news" className="font-bold text-fuchsia-400 hover:text-fuchsia-300">contacto@rhevolver.news</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rhevolver Media Comunicaciones. Todos los derechos reservados.</p>
          <p>Guerrero, México · Periodismo digital</p>
        </div>
      </div>
    </footer>
  );
}
