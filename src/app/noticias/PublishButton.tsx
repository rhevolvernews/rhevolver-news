"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PublishButtonProps = {
  id: number;
  status: string | null;
};

export default function PublishButton({ id, status }: PublishButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isPublished = status === "published";

  async function toggleStatus() {
    setSaving(true);

    const nextStatus = isPublished ? "draft" : "published";
    const { error } = await supabase
      .from("news")
      .update({
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) {
      window.alert(`No se pudo actualizar: ${error.message}`);
      setSaving(false);
      return;
    }

    router.refresh();
    setSaving(false);
  }

  return (
    <button
      type="button"
      onClick={toggleStatus}
      disabled={saving}
      className={`rounded-lg px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
        isPublished
          ? "bg-amber-600 hover:bg-amber-700"
          : "bg-emerald-600 hover:bg-emerald-700"
      }`}
    >
      {saving ? "Guardando..." : isPublished ? "Pasar a borrador" : "Publicar"}
    </button>
  );
}
