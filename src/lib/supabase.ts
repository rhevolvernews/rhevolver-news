import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const PUBLIC_READ_REVALIDATE_SECONDS = 60;

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

function normalizePublicReadUrl(input: RequestInfo | URL) {
  const raw = input instanceof Request ? input.url : input.toString();

  try {
    const url = new URL(raw);

    if (!url.hostname.endsWith(".supabase.co") || !url.pathname.startsWith("/rest/v1/")) {
      return raw;
    }

    const publishedAt = url.searchParams.get("published_at");
    if (publishedAt?.startsWith("lte.")) {
      const date = new Date(publishedAt.slice(4));
      if (!Number.isNaN(date.getTime())) {
        date.setSeconds(0, 0);
        url.searchParams.set("published_at", `lte.${date.toISOString()}`);
      }
    }

    return url.toString();
  } catch {
    return raw;
  }
}

const rhevolverFetch: typeof fetch = async (input, init) => {
  const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();

  if (typeof window !== "undefined" || method !== "GET") {
    return fetch(input, init);
  }

  const normalizedInput = normalizePublicReadUrl(input);

  // Las rutas individuales de noticia deben ver una publicación nueva de inmediato.
  // Evitamos cachear consultas exactas por slug/id; el resto conserva el cache
  // público de 60 s para proteger el egress de Supabase.
  let isExactArticleLookup = false;
  try {
    const url = new URL(normalizedInput);
    const slug = url.searchParams.get("slug");
    const id = url.searchParams.get("id");
    isExactArticleLookup =
      (slug?.startsWith("eq.") ?? false) ||
      (id?.startsWith("eq.") ?? false);
  } catch {
    isExactArticleLookup = false;
  }

  if (isExactArticleLookup) {
    // No reutilizar respuestas negativas/antiguas al abrir una noticia recién
    // publicada. La URL recibe un nonce solo del lado servidor; Supabase ignora
    // el parámetro desconocido para el resultado REST, pero la red/CDN ve una
    // solicitud única.
    const freshUrl = new URL(normalizedInput);
    freshUrl.searchParams.set("_rv", Date.now().toString());

    const headers = new Headers(init?.headers);
    headers.set("cache-control", "no-cache, no-store, max-age=0");
    headers.set("pragma", "no-cache");

    return fetch(freshUrl.toString(), {
      ...init,
      headers,
      cache: "no-store",
    });
  }

  const nextInit: NextFetchInit = {
    ...init,
    next: {
      revalidate: PUBLIC_READ_REVALIDATE_SECONDS,
      tags: ["rhevolver-public-supabase"],
    },
  };

  return fetch(normalizedInput, nextInit);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: rhevolverFetch,
  },
});
