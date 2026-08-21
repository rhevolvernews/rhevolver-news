import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "news-images";
const ALLOWED_PREFIXES = ["news/", "videos/", "video-thumbnails/"];
function validPath(path: string) { return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix)) && !path.includes("..") && /^[a-zA-Z0-9/_\-.]+$/.test(path); }

export async function POST(request: Request) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path?.trim() || "";
  if (!validPath(path)) return NextResponse.json({ error: "Ruta de archivo no válida." }, { status: 400 });
  const { error } = await getSupabaseAdmin().storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
