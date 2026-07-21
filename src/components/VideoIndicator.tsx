type VideoIndicatorProps = {
  compact?: boolean;
  className?: string;
};

export default function VideoIndicator({ compact = false, className = "" }: VideoIndicatorProps) {
  if (compact) {
    return (
      <span
        aria-label="Noticia con video"
        title="Noticia con video"
        className={`grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/70 text-sm text-white shadow-xl backdrop-blur-md ${className}`}
      >
        ▶
      </span>
    );
  }

  return (
    <span
      aria-label="Noticia con video"
      title="Noticia con video"
      className={`inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/70 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white shadow-xl backdrop-blur-md ${className}`}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[0.7rem] text-black">▶</span>
      Video
    </span>
  );
}
