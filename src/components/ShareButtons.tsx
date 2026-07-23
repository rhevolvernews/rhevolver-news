"use client";

import { useState } from "react";

type ShareButtonsProps = { title: string; url: string };

type IconProps = { className?: string };

function FacebookIcon({ className = "" }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.7 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.7-1.6h1.8V4.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7.3v3.2h2.9V22h3.5Z"/></svg>;
}
function WhatsAppIcon({ className = "" }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.7 9.7 0 0 0-8.3 14.7L2.3 22l5.5-1.4A9.7 9.7 0 1 0 12 2Zm0 17.6c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.3.9.9-3.2-.2-.3A7.7 7.7 0 1 1 12 19.6Zm4.2-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3.2 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.2-.2-.4-.3Z"/></svg>;
}
function XIcon({ className = "" }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.2-8.3L2.8 2h6.4l4.4 5.9L18.9 2Zm-1.1 17.9h1.7L8.3 4H6.5l11.3 15.9Z"/></svg>;
}
function LinkIcon({ className = "" }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/></svg>;
}
function ShareIcon({ className = "" }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 16V3m0 0L7 8m5-5 5 5"/></svg>;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [message, setMessage] = useState("");
  const effectiveUrl = () => (typeof window !== "undefined" ? window.location.href : url);
  const showMessage = (value: string) => { setMessage(value); window.setTimeout(() => setMessage(""), 2500); };

  async function copyLink() {
    const value = effectiveUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const input = document.createElement("textarea"); input.value = value; input.style.position = "fixed"; input.style.opacity = "0";
        document.body.appendChild(input); input.select(); document.execCommand("copy"); input.remove();
      }
      showMessage("Enlace copiado");
    } catch { window.prompt("Copia este enlace:", value); }
  }

  async function nativeShare() {
    if (navigator.share) {
      try { await navigator.share({ title, text: title, url: effectiveUrl() }); return; }
      catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    await copyLink();
  }

  const networks = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: FacebookIcon, tone: "share-orb--facebook" },
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`, icon: WhatsAppIcon, tone: "share-orb--whatsapp" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, icon: XIcon, tone: "share-orb--x" },
  ];

  return (
    <section className="article-share-premium" aria-label="Compartir noticia">
      <div className="article-share-premium__head">
        <div>
          <p className="article-kicker">Difunde la información</p>
          <h3>Compartir esta noticia</h3>
        </div>
        {message && <span aria-live="polite" className="article-share-premium__toast">{message}</span>}
      </div>
      <button type="button" onClick={nativeShare} className="article-share-premium__main">
        <ShareIcon className="h-5 w-5" /> Compartir noticia
      </button>
      <div className="article-share-premium__orbs">
        {networks.map(({ label, href, icon: Icon, tone }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" className={`share-orb ${tone}`} aria-label={`Compartir en ${label}`}>
            <span><Icon className="h-5 w-5" /></span><small>{label}</small>
          </a>
        ))}
        <button type="button" onClick={copyLink} className="share-orb share-orb--copy" aria-label="Copiar enlace">
          <span><LinkIcon className="h-5 w-5" /></span><small>Copiar</small>
        </button>
      </div>
    </section>
  );
}
