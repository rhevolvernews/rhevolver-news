"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  id: number;
  title: string;
  status: string | null;
};

export default function NewsActions({ id, title, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const inTrash = status === "trash";

  async function update(nextStatus: string, publishedAt?: string | null) {
    setBusy(nextStatus);
    const payload: Record<string, string | null> = { status: nextStatus };
    if (publishedAt !== undefined) payload.published_at = publishedAt;
    const { error } = await supabase.from("news").update(payload).eq("id", id);
    if (error) window.alert(`No se pudo actualizar: ${error.message}`);
    setBusy(null);
    router.refresh();
  }

  async function duplicate() {
    setBusy("duplicate");
    const { data, error } = await supabase.from("news").select("title, slug, summary, content, featured_image, category, author, views").eq("id", id).single();
    if (error || !data) {
      window.alert(`No se pudo duplicar: ${error?.message || "Registro no encontrado"}`);
      setBusy(null);
      return;
    }
    const suffix = Date.now().toString().slice(-6);
    const { error: insertError } = await supabase.from("news").insert({
      ...data,
      title: `${data.title} (copia)`,
      slug: `${data.slug || "noticia"}-copia-${suffix}`,
      status: "draft",
      published_at: null,
      views: 0,
    });
    if (insertError) window.alert(`No se pudo duplicar: ${insertError.message}`);
    setBusy(null);
    router.refresh();
  }

  async function permanentDelete() {
    if (!window.confirm(`¿Eliminar definitivamente “${title}”? Esta acción no se puede deshacer.`)) return;
    setBusy("delete");
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) window.alert(`No se pudo eliminar: ${error.message}`);
    setBusy(null);
    router.refresh();
  }

  if (inTrash) {
    return (
      <div className="flex flex-wrap gap-2">
        <button onClick={() => update("draft", null)} disabled={busy !== null} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold hover:bg-emerald-700 disabled:opacity-50">Restaurar</button>
        <button onClick={permanentDelete} disabled={busy !== null} className="rounded-lg bg-red-700 px-3 py-2 text-xs font-bold hover:bg-red-800 disabled:opacity-50">Eliminar definitivamente</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "published" || status === "featured" ? (
        <button onClick={() => update("draft", null)} disabled={busy !== null} className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold hover:bg-amber-700 disabled:opacity-50">Borrador</button>
      ) : (
        <button onClick={() => update("published", new Date().toISOString())} disabled={busy !== null} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold hover:bg-emerald-700 disabled:opacity-50">Publicar</button>
      )}
      {status === "published" ? (
        <button onClick={() => update("featured")} disabled={busy !== null} className="rounded-lg bg-fuchsia-600 px-3 py-2 text-xs font-bold hover:bg-fuchsia-700 disabled:opacity-50">Destacar</button>
      ) : status === "featured" ? (
        <button onClick={() => update("published")} disabled={busy !== null} className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold hover:bg-violet-700 disabled:opacity-50">Quitar destaque</button>
      ) : null}
      <button onClick={duplicate} disabled={busy !== null} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold hover:bg-blue-700 disabled:opacity-50">Duplicar</button>
      <button onClick={() => update("archived")} disabled={busy !== null} className="rounded-lg bg-zinc-600 px-3 py-2 text-xs font-bold hover:bg-zinc-700 disabled:opacity-50">Archivar</button>
      <button onClick={() => update("trash")} disabled={busy !== null} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold hover:bg-red-700 disabled:opacity-50">Papelera</button>
    </div>
  );
}
