"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";
import RichTextEditor from "@/components/RichTextEditor";
import EditorialAssistant from "@/components/EditorialAssistant";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditarNoticiaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Local");
  const [author, setAuthor] = useState("Rhevolver Media");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    async function loadNews() {
      const id = Number(params.id);
      if (!Number.isFinite(id)) {
        setErrorMessage("El identificador de la noticia no es válido.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("news")
        .select("title, summary, content, category, author, featured_image, status, published_at")
        .eq("id", id)
        .single();

      if (error || !data) {
        setErrorMessage(`No se pudo cargar la noticia: ${error?.message || "No encontrada"}`);
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setSummary(data.summary || "");
      setContent(data.content || "");
      setCategory(data.category || "Local");
      setAuthor(data.author || "Rhevolver Media");
      setFeaturedImage(data.featured_image || "");
      setStatus(data.status || "draft");
      if (data.status === "scheduled" && data.published_at) {
        const date = new Date(data.published_at);
        setScheduledAt(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      }
      setLoading(false);
    }

    loadNews();
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!title.trim() || !content.trim()) {
      setErrorMessage("El título y el contenido son obligatorios.");
      return;
    }

    setSaving(true);
    const id = Number(params.id);
    if (status === "scheduled" && !scheduledAt) {
      setErrorMessage("Selecciona la fecha y hora de publicación.");
      setSaving(false);
      return;
    }
    const publishedAt =
      status === "published" || status === "featured"
        ? new Date().toISOString()
        : status === "scheduled"
          ? new Date(scheduledAt).toISOString()
          : null;

    const { error } = await supabase
      .from("news")
      .update({
        title: title.trim(),
        slug: createSlug(title),
        summary: summary.trim(),
        content: content.trim(),
        featured_image: featuredImage.trim() || null,
        category,
        author: author.trim() || "Rhevolver Media",
        status,
        published_at: publishedAt,
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(`No se pudo actualizar: ${error.message}`);
      setSaving(false);
      return;
    }

    setMessage("Noticia actualizada correctamente.");
    setSaving(false);
    router.refresh();
  }

  if (loading) {
    return <main className="min-h-screen bg-[#07080d] p-8 text-white">Cargando noticia...</main>;
  }

  return (
    <main className="min-h-screen bg-[#07080d] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-pink-500">RHEVOLVER CMS</p>
            <h1 className="mt-2 text-4xl font-black">Editar noticia</h1>
          </div>
          <Link href="/noticias" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10">
            ← Volver a noticias
          </Link>
        </header>

        {errorMessage && <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{errorMessage}</div>}
        {message && <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{message}</div>}

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

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6 rounded-3xl border border-white/10 bg-[#11131c] p-6 md:p-8">
          <label>
            <span className="mb-2 block text-sm font-bold text-zinc-300">Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 outline-none focus:border-pink-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-zinc-300">Resumen</span>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 outline-none focus:border-pink-500" />
          </label>

          <div>
            <span className="mb-2 block text-sm font-bold text-zinc-300">Contenido</span>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-zinc-300">Categoría</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3">
                {["Local", "Iguala", "Guerrero", "México", "Internacional", "Deportes", "Espectáculos", "Opinión"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-zinc-300">Autor</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3" />
            </label>
          </div>

          <ImageUploader value={featuredImage} onChange={setFeaturedImage} />

          <label>
            <span className="mb-2 block text-sm font-bold text-zinc-300">Estado</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3">
              <option value="draft">Guardar como borrador</option>
              <option value="published">Publicar</option>
              <option value="featured">Publicar y destacar</option>
              <option value="scheduled">Programar publicación</option>
              <option value="archived">Archivar</option>
            </select>
          </label>

          {status === "scheduled" && (
            <label>
              <span className="mb-2 block text-sm font-bold text-zinc-300">Fecha y hora de publicación</span>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#090a10] px-4 py-3" />
            </label>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">
            <Link href="/noticias" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10">Cancelar</Link>
            <button disabled={saving} className="rounded-xl bg-gradient-to-r from-pink-500 to-pink-700 px-6 py-3 font-bold shadow-lg shadow-pink-500/20 disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
