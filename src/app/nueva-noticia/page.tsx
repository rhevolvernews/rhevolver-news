"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";
import RichTextEditor from "@/components/RichTextEditor";
import EditorialAssistant from "@/components/EditorialAssistant";
import ArticlePreview from "@/components/ArticlePreview";
import { ensureVideoMarkers } from "@/lib/video-content";
function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NuevaNoticiaPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const uploadedVideosRef = useRef<string[]>([]);
  const [category, setCategory] = useState("Local");
  const [author, setAuthor] = useState("Rhevolver Media");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!title.trim() || !content.trim()) {
      setErrorMessage("El título y el contenido son obligatorios.");
      return;
    }

    const hasAttachedVideo = uploadedVideosRef.current.length > 0;
    const willBePublic = ["published", "featured", "scheduled"].includes(status);
    if (hasAttachedVideo && willBePublic && !featuredImage.trim()) {
      setErrorMessage("Las noticias con video necesitan una portada o miniatura antes de publicarse.");
      return;
    }

    setSaving(true);

    if (status === "scheduled" && !scheduledAt) {
      setErrorMessage("Selecciona la fecha y hora de publicación.");
      setSaving(false);
      return;
    }

    const finalContent = ensureVideoMarkers(content.trim(), uploadedVideosRef.current);

    const publishedAt =
      status === "published" || status === "featured"
        ? new Date().toISOString()
        : status === "scheduled"
          ? new Date(scheduledAt).toISOString()
          : null;

    const { error } = await supabase.from("news").insert({
      title: title.trim(),
      slug: createSlug(title),
      summary: summary.trim(),
      content: finalContent,
      featured_image: featuredImage.trim() || null,
      category,
      author: author.trim() || "Rhevolver Media",
      status,
      published_at: publishedAt,
      views: 0,
    });

    if (error) {
      console.error(error);
      setErrorMessage(`No se pudo guardar: ${error.message}`);
      setSaving(false);
      return;
    }

    setMessage(
      status === "scheduled"
        ? "Noticia programada correctamente."
        : status === "published" || status === "featured"
          ? "Noticia publicada correctamente."
          : "Borrador guardado correctamente."
    );

    setTitle("");
    setSummary("");
    setContent("");
    setFeaturedImage("");
    setUploadedVideos([]);
    uploadedVideosRef.current = [];

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#07080d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.22em] text-pink-500">
              RHEVOLVER CMS
            </p>

            <h1 className="text-4xl font-black tracking-tight">
              Nueva noticia
            </h1>

            <p className="mt-2 text-zinc-400">
              Redacta, guarda como borrador o publica una noticia.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
          >
            ← Volver al Dashboard
          </button>
        </header>

        <EditorialAssistant
          title={title}
          summary={summary}
          content={content}
          category={category}
          onApplyTitle={setTitle}
          onApplySummary={setSummary}
          onApplyContent={setContent}
          onApplyCategory={setCategory}
        />

        <ArticlePreview
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={title}
          summary={summary}
          content={content}
          category={category}
          author={author}
          featuredImage={featuredImage}
        />

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-6 rounded-3xl border border-white/10 bg-[#11131c] p-6 shadow-2xl md:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold text-zinc-300"
            >
              Título *
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Escribe el título de la noticia"
              className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="mb-2 block text-sm font-bold text-zinc-300"
            >
              Resumen
            </label>

            <textarea
              id="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Descripción breve para portada y redes sociales"
              rows={3}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
            />
          </div>

          <div>
  <label className="mb-2 block text-sm font-bold text-zinc-300">
    Contenido *
  </label>

  <RichTextEditor
    value={content}
    onChange={setContent}
    onVideoUploaded={(url, thumbnailUrl) => {
      if (!uploadedVideosRef.current.includes(url)) {
        uploadedVideosRef.current = [...uploadedVideosRef.current, url];
      }
      setUploadedVideos(uploadedVideosRef.current);
      if (thumbnailUrl) {
        setFeaturedImage((current) => current.trim() || thumbnailUrl);
      }
    }}
  />
</div>

          {uploadedVideos.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-black text-emerald-300">Video adjunto listo para publicar</p>
              {uploadedVideos.map((url) => (
                <video key={url} src={url} controls playsInline preload="metadata" className="mt-3 max-h-80 w-full rounded-xl bg-black object-contain" />
              ))}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-bold text-zinc-300"
              >
                Categoría
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none focus:border-pink-500"
              >
                <option>Local</option>
                <option>Nacional</option>
                <option>Internacional</option>
                <option>Política</option>
                <option>Deportes</option>
                <option>TV Show</option>
                <option>IA</option>
                <option>Humor</option>
                <option>Editorial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-bold text-zinc-300"
              >
                Autor
              </label>

              <input
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <ImageUploader
            value={featuredImage}
            onChange={setFeaturedImage}
            label={uploadedVideos.length > 0 ? "Portada o miniatura del video" : "Imagen destacada"}
            helpText={uploadedVideos.length > 0 ? "La miniatura se genera automáticamente al subir el video. Puedes reemplazarla aquí por otra imagen horizontal." : "Esta imagen aparecerá en la portada y al compartir la noticia."}
            required={uploadedVideos.length > 0 && ["published", "featured", "scheduled"].includes(status)}
          />

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-bold text-zinc-300"
            >
              Estado
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none focus:border-pink-500"
            >
              <option value="draft">Guardar como borrador</option>
              <option value="published">Publicar ahora</option>
              <option value="featured">Publicar y destacar en portada</option>
              <option value="scheduled">Programar publicación</option>
              <option value="archived">Archivar</option>
            </select>
          </div>


          {status === "scheduled" && (
            <div>
              <label htmlFor="scheduledAt" className="mb-2 block text-sm font-bold text-zinc-300">
                Fecha y hora de publicación
              </label>
              <input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-white outline-none focus:border-pink-500"
              />
              <p className="mt-2 text-xs text-zinc-500">La noticia aparecerá automáticamente cuando llegue esta fecha y hora.</p>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {errorMessage}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">
              {message}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
            <button type="button" onClick={() => setPreviewOpen(true)} className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-5 py-3 font-bold text-fuchsia-200 hover:bg-fuchsia-500/20">
              Vista previa
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-3 font-bold shadow-lg shadow-pink-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Guardando..."
                : status === "scheduled"
                  ? "Programar noticia"
                  : status === "published" || status === "featured"
                    ? "Publicar noticia"
                    : "Guardar noticia"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}