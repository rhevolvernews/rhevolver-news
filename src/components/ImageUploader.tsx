"use client";

import { ChangeEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({
  value,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Selecciona un archivo de imagen válido.");
      return;
    }

    setUploading(true);

    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setErrorMessage(`No se pudo subir la imagen: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath);

    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-zinc-300">
          Imagen destacada
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-pink-700 disabled:opacity-50"
        />
      </label>

      {uploading && (
        <p className="text-sm text-zinc-400">Subiendo imagen...</p>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {value && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <img
            src={value}
            alt="Vista previa de la imagen destacada"
            className="h-64 w-full object-cover"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="max-w-full truncate text-xs text-zinc-500">
              {value}
            </p>

            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20"
            >
              Quitar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}