"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  featuredImage: string;
};

export default function ArticlePreview({ open, onClose, title, summary, content, category, author, featuredImage }: Props) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label="Vista previa de noticia">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#090b12] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#090b12]/95 px-5 py-4 backdrop-blur-xl">
          <div><p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-fuchsia-400">Vista previa</p><p className="text-sm text-zinc-500">Así se verá la publicación antes de guardarla.</p></div>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-black hover:bg-white/10">Cerrar</button>
        </div>
        <article className="p-5 sm:p-8 md:p-12">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-fuchsia-600 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em]">{category || "Noticias"}</span>
            <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">{title || "Título de la noticia"}</h1>
            {summary && <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-400">{summary}</p>}
            <p className="mt-5 text-sm text-zinc-500">Por <strong className="text-zinc-200">{author || "Rhevolver Media"}</strong></p>
          </div>
          {featuredImage && <img src={featuredImage} alt="Vista previa" className="mt-8 aspect-video w-full rounded-[1.6rem] object-cover" />}
          <div className="article-body mt-8 rounded-[1.6rem] bg-white p-6 text-[#202124] sm:p-9" dangerouslySetInnerHTML={{ __html: content || "<p>El contenido de la noticia aparecerá aquí.</p>" }} />
        </article>
      </div>
    </div>
  );
}
