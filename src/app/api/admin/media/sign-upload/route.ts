import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "news-images";
const ALLOWED_PREFIXES = ["news/", "videos/", "video-thumbnails/"];
const IMAGE_LIMIT = 12 * 1024 * 1024;
const VIDEO_LIMIT = 200 * 1024 * 1024;

function validPath(path: string) {
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix)) && !path.includes("..") && /^[a-zA-Z0-9/_\-.]+$/.test(path);
}

export async function POST(request: Request) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { path?: string; contentType?: string; size?: number } | null;
  const path = body?.path?.trim() || "";
  const contentType = body?.contentType?.trim() || "application/octet-stream";
  const size = Number(body?.size || 0);
  if (!validPath(path)) return NextResponse.json({ error: "Ruta de archivo no válida." }, { status: 400 });
  const isVideo = path.startsWith("videos/");
  const isImage = path.startsWith("news/") || path.startsWith("video-thumbnails/");
  if ((isVideo && !contentType.startsWith("video/")) || (isImage && !contentType.startsWith("image/"))) return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400 });
  const maxSize = isVideo ? VIDEO_LIMIT : IMAGE_LIMIT;
  if (!Number.isFinite(size) || size <= 0 || size > maxSize) return NextResponse.json({ error: "El tamaño del archivo no está permitido." }, { status: 400 });
  const bucket = getSupabaseAdmin().storage.from(BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path, { upsert: false });
  if (error || !data?.token) return NextResponse.json({ error: error?.message || "No se pudo autorizar la carga." }, { status: 500 });
  const publicUrl = bucket.getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ path, token: data.token, publicUrl });
}
