type PlatformName =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "whatsapp";

export default function PlatformIcon({
  name,
  className = "h-4 w-4",
}: {
  name: PlatformName;
  className?: string;
}) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.74-1.7H17.1V2.43A24.9 24.9 0 0 0 14.39 2C11.7 2 9.86 3.64 9.86 6.65V9.5H6.82V13h3.04v9h3.64Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.53 3.58 12 3.58 12 3.58s-7.53 0-9.39.5A3 3 0 0 0 .5 6.2 31.1 31.1 0 0 0 0 12a31.1 31.1 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.86.5 9.39.5 9.39.5s7.53 0 9.39-.5a3 3 0 0 0 2.11-2.12A31.1 31.1 0 0 0 24 12a31.1 31.1 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M14.6 2h3.15c.3 2.15 1.5 3.72 3.64 4.42v3.2a8.55 8.55 0 0 1-3.64-1.05v6.13a7.3 7.3 0 1 1-6.3-7.24v3.25a4.13 4.13 0 1 0 3.15 4V2Z" />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
        <path d="M12.04 2A9.84 9.84 0 0 0 3.6 16.9L2 22l5.25-1.55A9.9 9.9 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.12.92.94-3.03-.2-.31a8.1 8.1 0 1 1 6.8 3.73Zm4.45-6.05c-.24-.12-1.44-.71-1.66-.79-.23-.08-.4-.12-.57.12-.16.25-.64.8-.78.96-.15.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.46 22H3.35l7.24-8.28L2.95 2H9.36l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.42 4.05H6.57L17.8 19.84Z" />
    </svg>
  );
}
