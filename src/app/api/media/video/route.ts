import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { extractVideoUrlsFromContent, parsePrivateVideoRef } from "@/lib/video-content";

const PRIVATE_VIDEO_BUCKET = "news-videos";
const LEGACY_VIDEO_BUCKET = "news-images";
const SIGNED_URL_TTL_SECONDS = 5 * 60;
const PUBLIC_STATUSES = ["published", "featured", "scheduled"];

function noStoreJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

function getLegacySupabaseVideoPath(source: string) {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!projectUrl) return null;

  try {
    const sourceUrl = new URL(source);
    const supabaseUrl = new URL(projectUrl);
    if (sourceUrl.origin !== supabaseUrl.origin) return null;

    const prefixes = [
      `/storage/v1/object/public/${LEGACY_VIDEO_BUCKET}/`,
      `/storage/v1/object/sign/${LEGACY_VIDEO_BUCKET}/`,
    ];
    const prefix = prefixes.find((candidate) => sourceUrl.pathname.startsWith(candidate));
    if (!prefix) return null;

    const path = decodeURIComponent(sourceUrl.pathname.slice(prefix.length));
    if (!path.startsWith("videos/") || path.includes("..") || !/^[a-zA-Z0-9/_\-.]+$/.test(path)) {
      return null;
    }

    return path;
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const articleId = Number(url.searchParams.get("articleId"));
  const videoIndex = Number(url.searchParams.get("index"));

  if (!Number.isInteger(articleId) || articleId <= 0 || !Number.isInteger(videoIndex) || videoIndex < 0) {
    return noStoreJson({ error: "Solicitud de video no válida." }, 400);
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: news, error: newsError } = await supabaseAdmin
    .from("news")
    .select("content, status, published_at")
    .eq("id", articleId)
    .in("status", PUBLIC_STATUSES)
    .lte("published_at", new Date().toISOString())
    .single();

  if (newsError || !news?.content) {
    return noStoreJson({ error: "Video no disponible." }, 404);
  }

  const sources = extractVideoUrlsFromContent(news.content);
  const source = sources[videoIndex];
  if (!source) {
    return noStoreJson({ error: "Video no encontrado." }, 404);
  }

  const privatePath = parsePrivateVideoRef(source);
  if (privatePath) {
    const { data, error } = await supabaseAdmin.storage
      .from(PRIVATE_VIDEO_BUCKET)
      .createSignedUrl(privatePath, SIGNED_URL_TTL_SECONDS);

    if (error || !data?.signedUrl) {
      return noStoreJson({ error: "No se pudo autorizar la reproducción." }, 500);
    }

    return noStoreJson({ url: data.signedUrl, expiresIn: SIGNED_URL_TTL_SECONDS });
  }

  // Compatibilidad: los videos antiguos estaban en news-images y guardaban una URL pública.
  const legacyPath = getLegacySupabaseVideoPath(source);
  if (legacyPath) {
    const { data, error } = await supabaseAdmin.storage
      .from(LEGACY_VIDEO_BUCKET)
      .createSignedUrl(legacyPath, SIGNED_URL_TTL_SECONDS);

    if (!error && data?.signedUrl) {
      return noStoreJson({ url: data.signedUrl, expiresIn: SIGNED_URL_TTL_SECONDS, legacy: true });
    }
  }

  // Último fallback para URLs externas históricas ya guardadas en noticias publicadas.
  if (/^https?:\/\//i.test(source)) {
    return noStoreJson({ url: source, expiresIn: 0, legacy: true });
  }

  return noStoreJson({ error: "Formato de video no compatible." }, 404);
}
