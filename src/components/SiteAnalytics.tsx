"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/nueva-noticia",
  "/editar-noticia",
  "/categorias",
];

export default function SiteAnalytics() {
  return (
    <>
      <VercelAnalytics
        beforeSend={(event) => {
          try {
            const pathname = new URL(event.url).pathname;
            if (PRIVATE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
              return null;
            }
          } catch {
            return event;
          }

          return event;
        }}
      />
      <SpeedInsights sampleRate={0.25} />
    </>
  );
}
