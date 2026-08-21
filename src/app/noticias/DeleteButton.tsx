"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type DeleteButtonProps = {
  id: number;
  title: string;
};

export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la noticia "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Eliminando..." : "🗑 Eliminar"}
    </button>
  );
}