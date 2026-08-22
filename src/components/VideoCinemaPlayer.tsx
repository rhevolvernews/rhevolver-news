"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  articleId: number;
  videoIndex: number;
  poster?: string;
  title?: string;
};

type PlaybackAuthorization = {
  url?: string;
  error?: string;
};

export default function VideoCinemaPlayer({
  articleId,
  videoIndex,
  poster,
  title = "Video de la noticia",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldAutoPlay = useRef(false);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") videoRef.current?.pause();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playing]);

  useEffect(() => {
    if (!source || !shouldAutoPlay.current) return;
    shouldAutoPlay.current = false;
    void videoRef.current?.play().catch(() => {
      // Algunos navegadores exigen un segundo toque después de una petición de red.
    });
  }, [source]);

  async function authorizePlayback() {
    if (loading) return;
    if (source) {
      await videoRef.current?.play().catch(() => undefined);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    shouldAutoPlay.current = true;

    try {
      const response = await fetch(
        `/api/media/video?articleId=${encodeURIComponent(articleId)}&index=${encodeURIComponent(videoIndex)}`,
        { cache: "no-store" }
      );
      const result = (await response.json().catch(() => null)) as PlaybackAuthorization | null;

      if (!response.ok || !result?.url) {
        throw new Error(result?.error || "No se pudo autorizar la reproducción.");
      }

      setSource(result.url);
    } catch (error) {
      shouldAutoPlay.current = false;
      setErrorMessage(error instanceof Error ? error.message : "No se pudo reproducir el video.");
    } finally {
      setLoading(false);
    }
  }

  function resetExpiredSource() {
    if (!source) return;
    setPlaying(false);
    setSource("");
    setErrorMessage("El enlace temporal venció. Toca reproducir para renovarlo.");
  }

  return (
    <div className={`cinema-player ${playing ? "cinema-player--active" : ""}`}>
      {playing && (
        <button
          type="button"
          aria-label="Salir del modo cine"
          className="cinema-dimmer"
          onClick={() => videoRef.current?.pause()}
        />
      )}
      <div className="cinema-frame relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={source || undefined}
          poster={poster}
          controls={Boolean(source)}
          playsInline
          preload="none"
          aria-label={title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={resetExpiredSource}
          className="aspect-video max-h-[78vh] w-full bg-black object-contain"
        >
          Tu navegador no puede reproducir este video.
        </video>

        {!source && (
          <button
            type="button"
            onClick={() => void authorizePlayback()}
            disabled={loading}
            className="absolute inset-0 grid place-items-center bg-black/20 text-white transition hover:bg-black/30 disabled:cursor-wait"
            aria-label={loading ? "Preparando video" : `Reproducir ${title}`}
          >
            <span className="grid h-20 w-20 place-items-center rounded-full border border-white/30 bg-black/65 text-3xl shadow-2xl backdrop-blur-sm">
              {loading ? "…" : "▶"}
            </span>
          </button>
        )}
      </div>

      {errorMessage && (
        <button
          type="button"
          onClick={() => void authorizePlayback()}
          className="mt-3 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-200"
        >
          {errorMessage} Reintentar
        </button>
      )}
    </div>
  );
}
