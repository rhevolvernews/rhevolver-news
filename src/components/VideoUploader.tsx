"use client";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;
export default function VideoUploader({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false); const [dragging, setDragging] = useState(false); const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file || !file.type.startsWith("video/") || file.size > MAX_VIDEO_SIZE) { setMessage("Selecciona un video válido de hasta 200 MB."); return; }
    setUploading(true); setMessage("");
    const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const base = file.name.replace(/\.[^/.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "-").slice(0, 60);
    const path = `videos/${Date.now()}-${crypto.randomUUID()}-${base}.${ext}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (error) setMessage(`No se pudo subir: ${error.message}`); else { const { data } = supabase.storage.from("news-images").getPublicUrl(path); setMessage("Video subido correctamente."); onUploaded?.(data.publicUrl); }
    setUploading(false); if (inputRef.current) inputRef.current.value = "";
  }
  function drop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); if (!uploading) void upload(event.dataTransfer.files[0]); }
  function change(event: ChangeEvent<HTMLInputElement>) { void upload(event.target.files?.[0]); }
  return <div className="grid gap-3"><div onDragEnter={(e)=>{e.preventDefault();setDragging(true)}} onDragOver={(e)=>e.preventDefault()} onDragLeave={()=>setDragging(false)} onDrop={drop} className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${dragging ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-white/15 bg-black/20"}`}><div className="text-3xl">▶</div><h3 className="mt-2 font-black">Subir video</h3><p className="mt-2 text-sm text-zinc-500">MP4, MOV, WebM u otro formato de video. Máximo 200 MB.</p><button type="button" disabled={uploading} onClick={()=>inputRef.current?.click()} className="mt-4 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-black disabled:opacity-50">{uploading ? "Subiendo…" : "Seleccionar video"}</button><input ref={inputRef} type="file" accept="video/*" onChange={change} className="hidden" /></div>{message && <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">{message}</p>}</div>;
}
