"use client";

import Link from "next/link";
import MediaLibrary from "@/components/MediaLibrary";

export default function MultimediaPage() {
  return (
    <main className="min-h-screen bg-[#07080d] px-4 py-7 text-white sm:px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-pink-500">
              RHEVOLVER CMS
            </p>
            <h1 className="mt-2 text-4xl font-black">Multimedia</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Sube varias imágenes, consulta archivos existentes y administra la biblioteca editorial desde un solo lugar.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
          >
            ← Dashboard
          </Link>
        </header>

        <MediaLibrary
          open
          managementMode
          onClose={() => undefined}
        />
      </div>
    </main>
  );
}
