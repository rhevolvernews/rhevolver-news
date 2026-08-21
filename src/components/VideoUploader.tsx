"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_VIDEO_SIZE = 200 * 1024 * 1024;
const THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_HEIGHT = 720;

type VideoUploadResult = {
  videoUrl: string;
  thumbnailUrl?: string;
};

function createUploadId() {
  if (typeof globalThis.crypto !== "undefined") {
    if (typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    if (typeof globalThis.crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function cleanBaseName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "video";
}

async function generateThumbnail(file: File): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.src = objectUrl;

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("Tiempo agotado al leer el video.")), 15000);

      video.onloadedmetadata = () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const captureTime = duration > 0 ? Math.min(Math.max(duration * 0.12, 0.25), 2) : 0;
        video.currentTime = captureTime;
      };

      video.onseeked = () => {
        window.clearTimeout(timeout);
        resolve();
      };

      video.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("El navegador no pudo leer el video para crear la miniatura."));
      };

      video.load();
    });

    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement("canvas");
    canvas.width = THUMBNAIL_WIDTH;
    canvas.height = THUMBNAIL_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const sourceRatio = video.videoWidth / video.videoHeight;
    const targetRatio = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    if (sourceRatio > targetRatio) {
      sourceWidth = video.videoHeight * targetRatio;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else {
      sourceHeight = video.videoWidth / targetRatio;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    context.fillStyle = "#05060a";
    context.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
    context.drawImage(
      video,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      THUMBNAIL_WIDTH,
      THUMBNAIL_HEIGHT
    );

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.88);
    });
  } catch (error) {
    console.warn("No se pudo generar la miniatura automática:", error);
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
    video.removeAttribute("src");
    video.load();
  }
}

async function uploadThumbnail(file: File, base: string, uploadId: string) {
  const thumbnail = await generateThumbnail(file);
  if (!thumbnail) return undefined;

  const path = `video-thumbnails/${Date.now()}-${uploadId}-${base}.jpg`;
  const { error } = await supabase.storage.from("news-images").upload(path, thumbnail, {
    cacheControl: "31536000",
    upsert: false,
    contentType: "image/jpeg",
  });

  if (error) {
    console.warn("No se pudo subir la miniatura automática:", error.message);
    return undefined;
  }

  return supabase.storage.from("news-images").getPublicUrl(path).data.publicUrl;
}

export default function VideoUploader({
  onUploaded,
}: {
  onUploaded?: (result: VideoUploadResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file || !file.type.startsWith("video/") || file.size > MAX_VIDEO_SIZE) {
      setMessage("Selecciona un video válido de hasta 200 MB.");
      return;
    }

    setUploading(true);
    setMessage("Preparando video y miniatura automática…");

    const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const base = cleanBaseName(file.name);
    const uploadId = createUploadId();
    const path = `videos/${Date.now()}-${uploadId}-${base}.${ext}`;

    try {
      const thumbnailPromise = uploadThumbnail(file, base, uploadId);
      const { error } = await supabase.storage.from("news-images").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });

      if (error) {
        setMessage(`No se pudo subir: ${error.message}`);
        return;
      }

      const videoUrl = supabase.storage.from("news-images").getPublicUrl(path).data.publicUrl;
      const thumbnailUrl = await thumbnailPromise;

      onUploaded?.({ videoUrl, thumbnailUrl });
      setMessage(
        thumbnailUrl
          ? "Video subido y miniatura creada automáticamente. Ya puedes publicar."
          : "Video subido. No se pudo generar la miniatura; puedes elegir una imagen manualmente."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!uploading) void upload(event.dataTransfer.files[0]);
  }

  function change(event: ChangeEvent<HTMLInputElement>) {
    void upload(event.target.files?.[0]);
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
        onDrop={drop}
        className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
          dragging ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-white/15 bg-black/20"
        }`}
      >
        <div className="text-3xl">▶</div>
        <h3 className="mt-2 font-black">Subir video</h3>
        <p className="mt-2 text-sm text-zinc-500">
          MP4, MOV, WebM u otro formato de video. Máximo 200 MB. La portada se genera automáticamente.
        </p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-black disabled:opacity-50"
        >
          {uploading ? "Procesando…" : "Seleccionar video"}
        </button>
        <input ref={inputRef} type="file" accept="video/*" onChange={change} className="hidden" />
      </div>
      {message && (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
}
