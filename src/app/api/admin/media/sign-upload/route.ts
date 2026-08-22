import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createPrivateVideoRef } from "@/lib/video-content";

const PUBLIC_MEDIA_BUCKET = "news-images";
const PRIVATE_VIDEO_BUCKET = "news-videos";
const IMAGE_LIMIT = 12 * 1024 * 1024;
const VIDEO_LIMIT = 200 * 1024 * 1024;

function validPath(path: string) {
  return !path.includes("..") && /^[a-zA-Z0-9/_\-.]+$/.test(path);
}

export async function POST(request: Request) {
  if (!(await hasValidAdminSession())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    path?: string;
    contentType?: string;
    size?: number;
    bucket?: string;
  } | null;

  const path = body?.path?.trim() || "";
  const contentType = body?.contentType?.trim() || "application/octet-stream";
  const size = Number(body?.size || 0);
  const bucketName = body?.bucket === PRIVATE_VIDEO_BUCKET ? PRIVATE_VIDEO_BUCKET : PUBLIC_MEDIA_BUCKET;

  if (!validPath(path)) {
    return NextResponse.json({ error: "Ruta de archivo no válida." }, { status: 400 });
  }

  const isPrivateVideo = bucketName === PRIVATE_VIDEO_BUCKET;
  const validPrefix = isPrivateVideo
    ? path.startsWith("videos/")
    : path.startsWith("news/") || path.startsWith("video-thumbnails/");

  if (!validPrefix) {
    return NextResponse.json({ error: "Ruta de archivo no permitida para este bucket." }, { status: 400 });
  }

  if (isPrivateVideo ? !contentType.startsWith("video/") : !contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400 });
  }

  const maxSize = isPrivateVideo ? VIDEO_LIMIT : IMAGE_LIMIT;
  if (!Number.isFinite(size) || size <= 0 || size > maxSize) {
    return NextResponse.json({ error: "El tamaño del archivo no está permitido." }, { status: 400 });
  }

  const bucket = getSupabaseAdmin().storage.from(bucketName);
  const { data, error } = await bucket.createSignedUploadUrl(path, { upsert: false });

  if (error || !data?.token) {
    return NextResponse.json(
      { error: error?.message || "No se pudo autorizar la carga." },
      { status: 500 }
    );
  }

  if (isPrivateVideo) {
    return NextResponse.json({
      path,
      bucket: bucketName,
      token: data.token,
      fileRef: createPrivateVideoRef(path),
    });
  }

  return NextResponse.json({
    path,
    bucket: bucketName,
    token: data.token,
    publicUrl: bucket.getPublicUrl(path).data.publicUrl,
  });
}
