import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const articleId = Number(id);
  if (!Number.isInteger(articleId) || articleId <= 0) return NextResponse.json({ ok: false }, { status: 400 });
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error: readError } = await supabaseAdmin.from("news").select("views, status, published_at").eq("id", articleId).single();
  if (readError || !data) return NextResponse.json({ ok: false }, { status: 404 });
  const isPublic = ["published", "featured", "scheduled"].includes(data.status || "") && Boolean(data.published_at) && new Date(data.published_at as string).getTime() <= Date.now();
  if (!isPublic) return NextResponse.json({ ok: false }, { status: 404 });
  const currentViews = Number(data.views || 0);
  const { error } = await supabaseAdmin.from("news").update({ views: currentViews + 1 }).eq("id", articleId);
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200, headers: { "Cache-Control": "no-store" } });
}
