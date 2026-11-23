"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { signedUpload } from "@/lib/admin-media-client";

const MAX_PDF_SIZE = 25 * 1024 * 1024;

function cleanBaseName(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "documento";
}

function createUploadId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export type PdfUploadResult = {
  url: string;
  name: string;
};

export default function PdfUploader({
  onUploaded,
}: {
  onUploaded?: (result: PdfUploadResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function upload(file?: File) {
    setMessage("");
    setErrorMessage("");

    if (!file || file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Selecciona un documento PDF válido.");
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setErrorMessage("El PDF no debe superar 25 MB.");
      return;
    }

    setUploading(true);

    try {
      const base = cleanBaseName(file.name);
      const path = `documents/${Date.now()}-${createUploadId()}-${base}.pdf`;
      const url = await signedUpload(file, path, "application/pdf");
      onUploaded?.({ url, name: file.name });
      setMessage("Documento PDF subido correctamente.");
    } catch (error) {
      setErrorMessage(`No se pudo subir el PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    void upload(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!uploading) void upload(event.dataTransfer.files[0]);
  }

  return (
    <div className="grid gap-3">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
          dragging ? "border-pink-500 bg-pink-500/10" : "border-white/15 bg-black/20"
        }`}
      >
        <div className="text-4xl">📄</div>
        <h3 className="mt-2 font-black text-white">Subir documento PDF</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Documentos PDF de hasta 25 MB. Se publican con una URL segura de Rhevolver.news.
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-xl bg-pink-600 px-5 py-3 text-sm font-black text-white hover:bg-pink-500 disabled:opacity-50"
        >
          {uploading ? "Subiendo PDF…" : "Seleccionar PDF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {message && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
