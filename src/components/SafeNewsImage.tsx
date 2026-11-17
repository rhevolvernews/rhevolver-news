"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SafeNewsImageProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
  quality?: number;
};

export default function SafeNewsImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  quality = 80,
}: SafeNewsImageProps) {
  const [direct, setDirect] = useState(false);
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setDirect(false);
    setFailed(!src);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} grid place-items-center bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.48),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(219,39,119,0.38),_transparent_40%),#10131d]`}
      >
        <span className="text-3xl font-black tracking-[-0.08em] text-white/90">
          R<span className="text-fuchsia-400">.</span>
        </span>
      </div>
    );
  }

  return (
    <Image
      key={`${src}-${direct ? "direct" : "optimized"}`}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={direct}
      className={className}
      onError={() => {
        if (!direct) {
          setDirect(true);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
