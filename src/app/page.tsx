 import Link from "next/link";
 
 const menu = [
  { icon: "⌂", label: "Dashboard", active: true },
  { icon: "▤", label: "Noticias" },
  { icon: "+", label: "Nueva noticia" },
  { icon: "▧", label: "Multimedia" },
  { icon: "◫", label: "Categorías" },
  { icon: "✦", label: "Editorial" },
  { icon: "◎", label: "Publicidad" },
  { icon: "↗", label: "Analíticas" },
  { icon: "⚙", label: "Configuración" },
];

const statistics = [
  { title: "Noticias publicadas", value: "0", detail: "Hoy" },
  { title: "Borradores", value: "0", detail: "Pendientes" },
  { title: "Visitas", value: "—", detail: "Próximamente" },
  { title: "Categorías", value: "7", detail: "Activas" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07080d] text-white lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="border-b border-white/10 bg-[#090a10] p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 text-2xl font-black shadow-lg shadow-pink-500/20">
            R
          </div>

          <div>
            <p className="text-xl font-black">
              Rhevolver<span className="text-pink-500">.CMS</span>
            </p>
            <p className="text-xs text-zinc-500">
              Información que revoluciona
            </p>
          </div>
        </div>

        <nav className="mt-8 hidden space-y-2 lg:block">
          {menu.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                item.active
                  ? "bg-pink-500/15 text-white shadow-[inset_3px_0_0_#ec4899]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-6 text-center text-pink-500">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:absolute lg:bottom-6 lg:left-5 lg:right-5 lg:flex lg:items-center lg:gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-xs font-bold">
            RV
          </div>

          <div>
            <p className="text-sm font-bold">Administrador</p>
            <p className="text-xs text-zinc-500">Rhevolver Media</p>
          </div>
        </div>
      </aside>

      <section className="mx-auto w-full max-w-7xl p-5 md:p-8">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.22em] text-pink-500">
              RHEVOLVER CMS
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Dashboard
            </h1>
          </div>

          <Link
  href="/nueva-noticia"
  className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 font-bold shadow-lg shadow-pink-500/20 transition hover:scale-[1.02]"
>
  + Nueva noticia
</Link>
        </header>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/60 via-[#12141d] to-pink-950/40 p-7 shadow-2xl md:p-10">
          <p className="mb-4 text-xs font-black tracking-[0.22em] text-pink-500">
            BUEN DÍA
          </p>

          <h2 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            Bienvenido a tu centro editorial.
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Desde aquí administrarás noticias, imágenes, categorías y la
            operación diaria de Rhevolver.news.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Sistema en desarrollo
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#11131c] p-6"
            >
              <p className="text-sm text-zinc-500">{item.title}</p>
              <p className="mt-5 text-4xl font-black">{item.value}</p>
              <p className="mt-2 text-xs font-bold text-pink-500">
                {item.detail}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
          <article className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <p className="text-xs font-black tracking-[0.2em] text-pink-500">
              ACTIVIDAD
            </p>
            <h3 className="mt-2 text-xl font-bold">
              Publicaciones recientes
            </h3>

            <div className="mt-6 grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/15 p-8 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-500/10 text-2xl text-pink-500">
                  ▤
                </div>
                <h4 className="mt-5 text-lg font-bold">
                  Aún no hay noticias publicadas
                </h4>
                <p className="mt-2 text-zinc-500">
                  La primera nota que publiques aparecerá aquí.
                </p>
                <Link
  href="/nueva-noticia"
  className="mt-5 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
>
  Crear primera noticia
</Link>
              </div>
            </div>
          </article>

          <aside className="rounded-2xl border border-white/10 bg-[#11131c] p-6">
            <p className="text-xs font-black tracking-[0.2em] text-pink-500">
              ACCESOS RÁPIDOS
            </p>
            <h3 className="mt-2 text-xl font-bold">Comienza a trabajar</h3>

            <div className="mt-6 divide-y divide-white/10">
              {[
                ["+", "Nueva noticia", "Redactar y guardar un borrador"],
                ["▧", "Subir imagen", "Añadir contenido multimedia"],
                ["◫", "Gestionar categorías", "Organizar las secciones"],
              ].map(([icon, title, description]) => (
                <button
                  key={title}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-500/10 font-black text-pink-500">
                    {icon}
                  </span>

                  <span>
                    <strong className="block">{title}</strong>
                    <small className="mt-1 block text-zinc-500">
                      {description}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}