"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
type DeleteButtonProps = { id: number; title: string };
export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const router = useRouter(); const [deleting, setDeleting] = useState(false);
  async function handleDelete() {
    if (!window.confirm(`¿Seguro que deseas eliminar la noticia "${title}"?`)) return;
    setDeleting(true); const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (!response.ok) { const payload = (await response.json().catch(() => null)) as { error?: string } | null; alert(`No se pudo eliminar: ${payload?.error || "Error del servidor"}`); setDeleting(false); return; }
    router.refresh();
  }
  return <button type="button" onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{deleting ? "Eliminando..." : "🗑 Eliminar"}</button>;
}
