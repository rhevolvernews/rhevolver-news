import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Acceso editorial | Rhevolver.news",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#07080d] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10121a] p-7 shadow-2xl sm:p-9">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3b51b] text-xl font-black text-black">R</span>
          <span className="text-2xl font-black">Rhevolver<span className="text-pink-500">.CMS</span></span>
        </Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-pink-500">Acceso protegido</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Mesa de edición</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Ingresa con las credenciales administrativas configuradas para Rhevolver.</p>
        <Suspense fallback={<p className="mt-8 text-sm text-zinc-500">Cargando acceso…</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
