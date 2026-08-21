"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type PublishButtonProps = { id: number; status: string | null };
export default function PublishButton({ id, status }: PublishButtonProps) {
  const router = useRouter(); const [saving, setSaving] = useState(false); const isPublished = status === "published";
  async function toggleStatus() {
    setSaving(true); const nextStatus = isPublished ? "draft" : "published";
    const response = await fetch(`/api/admin/news/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus, published_at: nextStatus === "published" ? new Date().toISOString() : null }) });
    if (!response.ok) { const payload = (await response.json().catch(() => null)) as { error?: string } | null; window.alert(`No se pudo actualizar: ${payload?.error || "Error del servidor"}`); setSaving(false); return; }
    router.refresh(); setSaving(false);
  }
  return <button type="button" onClick={toggleStatus} disabled={saving} className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${isPublished ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>{saving ? "Guardando..." : isPublished ? "Pasar a borrador" : "Publicar"}</button>;
}
