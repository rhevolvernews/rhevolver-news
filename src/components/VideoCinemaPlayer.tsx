"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  title?: string;
};

export default function VideoCinemaPlayer({ src, poster, title = "Video de la noticia" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") videoRef.current?.pause();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playing]);

  return (
    <div className={`cinema-player ${playing ? "cinema-player--active" : ""}`}>
      {playing && <button type="button" aria-label="Salir del modo cine" className="cinema-dimmer" onClick={() => videoRef.current?.pause()} />}
      <div className="cinema-frame">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="aspect-video max-h-[78vh] w-full bg-black object-contain"
        >
          Tu navegador no puede reproducir este video.
        </video>
      </div>
    </div>
  );
}
