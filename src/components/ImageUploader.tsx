"use client";

import { ChangeEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import MediaLibrary from "@/components/MediaLibrary";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
  required?: boolean;
};

export default function ImageUploader({ value, onChange, label = "Imagen destacada", helpText, required = false }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage("");
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Selecciona un archivo de imagen válido.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage("La imagen no debe superar 12 MB.");
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const randomPart = typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    const fileName = `${Date.now()}-${randomPart}.${extension}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
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
      <div>
        <span className="mb-2 block text-sm font-bold text-zinc-300">
          {label}{required ? " *" : ""}
        </span>
        {helpText && <p className="mb-3 text-sm leading-6 text-zinc-500">{helpText}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block cursor-pointer rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-pink-500/40 hover:bg-white/5">
            {uploading ? "Subiendo imagen…" : "Subir desde el equipo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm font-black text-pink-300 hover:bg-pink-500/20"
          >
            Elegir de la biblioteca
          </button>
        </div>
      </div>

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
            <p className="max-w-full truncate text-xs text-zinc-500">{value}</p>
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

      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}
