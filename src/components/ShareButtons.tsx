"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [message, setMessage] = useState("");

  function effectiveUrl() {
    if (typeof window !== "undefined") return window.location.href;
    return url;
  }

  function showMessage(value: string) {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2500);
  }

  async function copyLink() {
    const value = effectiveUrl();
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      textarea.remove();
    }

    if (copied) {
      showMessage("Enlace copiado");
      return;
    }

    window.prompt("Copia este enlace:", value);
    showMessage("Enlace listo para copiar");
  }

  async function nativeShare() {
    const value = effectiveUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: value });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  const buttonClass =
    "inline-flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-black transition active:scale-[.98]";

  return (
    <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-5 text-[#17181c] shadow-xl sm:p-6" aria-label="Compartir noticia">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-pink-600">Difunde la información</p>
          <h3 className="mt-1 text-lg font-black">Compartir esta noticia</h3>
        </div>
        {message && <span aria-live="polite" className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">{message}</span>}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
        <button type="button" onClick={nativeShare} className={`${buttonClass} col-span-2 bg-pink-600 text-white sm:col-span-1`}>
          Compartir
        </button>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={`${buttonClass} bg-[#1877F2] text-white`}>
          Facebook
        </a>
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noreferrer" className={`${buttonClass} bg-[#25D366] text-white`}>
          WhatsApp
        </a>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={`${buttonClass} bg-black text-white`}>
          X
        </a>
        <button type="button" onClick={copyLink} className={`${buttonClass} border border-zinc-300 bg-white text-zinc-900`}>
          Copiar enlace
        </button>
      </div>
    </section>
  );
}
