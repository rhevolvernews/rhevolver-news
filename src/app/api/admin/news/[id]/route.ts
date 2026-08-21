import { NextResponse } from "next/server";
import { hasValidAdminSession } from "@/lib/admin-request";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_STATUSES = new Set(["draft", "published", "featured", "scheduled", "archived", "trash"]);
const ALLOWED_FIELDS = new Set(["title", "slug", "summary", "content", "featured_image", "category", "author", "status", "published_at", "views"]);
function parseId(raw: string) { const id = Number(raw); return Number.isInteger(id) && id > 0 ? id : null; }

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id: rawId } = await params; const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  const { data, error } = await getSupabaseAdmin().from("news").select("id, title, slug, summary, content, featured_image, category, author, status, published_at, created_at, views").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: error?.message || "Noticia no encontrada." }, { status: 404 });
  return NextResponse.json({ news: data }, { headers: { "Cache-Control": "no-store, private" } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id: rawId } = await params; const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) if (ALLOWED_FIELDS.has(key)) payload[key] = typeof value === "string" ? value.trim() : value;
  if (typeof payload.status === "string" && !ALLOWED_STATUSES.has(payload.status)) return NextResponse.json({ error: "Estado editorial no válido." }, { status: 400 });
  if (Object.keys(payload).length === 0) return NextResponse.json({ error: "No hay cambios válidos." }, { status: 400 });
  const { data, error } = await getSupabaseAdmin().from("news").update(payload).eq("id", id).select("id, slug, status, published_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, news: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id: rawId } = await params; const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  const { error } = await getSupabaseAdmin().from("news").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
