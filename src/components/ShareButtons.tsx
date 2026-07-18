"use client";

type ShareButtonsProps = {
  title: string;
  url: string;
};

export default function ShareButtons({
  title,
  url,
}: ShareButtonsProps) {
  async function copyLink() {
    await navigator.clipboard.writeText(url);
    window.alert("Enlace copiado.");
  }

  return (
    <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6">
      <h3 className="text-lg font-black">
        Compartir esta noticia
      </h3>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-[#1877F2] px-5 py-3 font-bold text-white"
        >
          Facebook
        </a>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `${title} ${url}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white"
        >
          WhatsApp
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-black px-5 py-3 font-bold text-white"
        >
          X
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="rounded-xl border border-black/10 px-5 py-3 font-bold"
        >
          Copiar enlace
        </button>
      </div>
    </div>
  );
}