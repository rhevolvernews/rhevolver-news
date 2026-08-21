"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type MultiImageUploaderProps = {
  onUploaded?: (urls: string[]) => void;
};

const MAX_FILE_SIZE = 12 * 1024 * 1024;

export default function MultiImageUploader({
  onUploaded,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  async function uploadFiles(files: File[]) {
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length === 0) {
      setErrorMessage(
        "Selecciona imágenes válidas de hasta 12 MB por archivo."
      );
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setMessage("");
    setProgress({ completed: 0, total: validFiles.length });

    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    for (let index = 0; index < validFiles.length; index += 1) {
      const file = validFiles[index];
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;
      const filePath = `news/${fileName}`;

      const { error } = await supabase.storage
        .from("news-images")
        .upload(filePath, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        failedFiles.push(file.name);
      } else {
        const { data } = supabase.storage
          .from("news-images")
          .getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      setProgress({ completed: index + 1, total: validFiles.length });
    }

    if (uploadedUrls.length > 0) {
      onUploaded?.(uploadedUrls);
      setMessage(
        `${uploadedUrls.length} ${
          uploadedUrls.length === 1 ? "imagen subida" : "imágenes subidas"
        } correctamente.`
      );
    }

    if (failedFiles.length > 0) {
      setErrorMessage(
        `No se pudieron subir: ${failedFiles.slice(0, 4).join(", ")}${
          failedFiles.length > 4 ? "…" : ""
        }`
      );
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(event.target.files || []));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!uploading) void uploadFiles(Array.from(event.dataTransfer.files));
  }

  const percent =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div className="grid gap-4">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-pink-500 bg-pink-500/10"
            : "border-white/15 bg-black/20 hover:border-pink-500/40"
        }`}
      >
        <div className="text-4xl">▧</div>
        <h3 className="mt-3 text-lg font-black text-white">
          Arrastra tus imágenes aquí
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          Puedes subir varias imágenes a la vez. Máximo 12 MB por archivo.
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/20 disabled:opacity-50"
        >
          {uploading ? "Subiendo…" : "Seleccionar imágenes"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>
              Subiendo {progress.completed} de {progress.total}
            </span>
            <strong>{percent}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
