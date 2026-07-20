"use client";

import { useMemo, useState } from "react";

export type EditorialSuggestion = {
  title: string;
  summary: string;
  content: string;
  category: string;
  seoDescription: string;
  tags: string[];
  hashtags: string[];
  facebookCopy: string;
  instagramCopy: string;
  xCopy: string;
};

type EditorialAssistantProps = {
  title: string;
  summary: string;
  content: string;
  category: string;
  onApplyTitle: (value: string) => void;
  onApplySummary: (value: string) => void;
  onApplyContent: (value: string) => void;
  onApplyCategory: (value: string) => void;
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

export default function EditorialAssistant({
  title,
  summary,
  content,
  category,
  onApplyTitle,
  onApplySummary,
  onApplyContent,
  onApplyCategory,
}: EditorialAssistantProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<EditorialSuggestion | null>(null);

  const canGenerate = useMemo(
    () => Boolean(title.trim() || summary.trim() || content.trim() || notes.trim()),
    [title, summary, content, notes]
  );

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, content, category, notes }),
      });

      const payload = (await response.json()) as EditorialSuggestion & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "No fue posible generar las sugerencias.");
      }

      setSuggestion(payload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible conectar con la asistencia editorial."
      );
    } finally {
      setLoading(false);
    }
  }

  function applyAll() {
    if (!suggestion) return;
    onApplyTitle(suggestion.title);
    onApplySummary(suggestion.summary);
    onApplyContent(suggestion.content);
    onApplyCategory(suggestion.category);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-400/20 bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(17,19,28,0.96)_48%,rgba(236,72,153,0.14))] shadow-2xl">
      <div className="border-b border-white/10 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
              Asistencia editorial con IA
            </p>
            <h2 className="mt-2 text-2xl font-black">Mesa de edición Rhevolver</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Convierte datos base o una nota preliminar en un paquete listo para revisar. La IA no publica ni guarda cambios automáticamente.
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
            Revisión humana obligatoria
          </span>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-zinc-300">
            Datos adicionales, contexto o información recibida
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Pega aquí el boletín, datos confirmados, nombres, lugar, hora, contexto o enfoque editorial..."
            className="w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-violet-400"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate || loading}
            className="rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-black shadow-lg shadow-violet-700/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? "Generando paquete editorial..." : "Generar con IA"}
          </button>
          <p className="text-xs text-zinc-500">
            Usa únicamente la información disponible y revisa nombres, cifras y atribuciones.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      {suggestion && (
        <div className="grid gap-5 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-400">
                Propuesta generada
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Puedes aplicar todo o sustituir solamente cada campo.
              </p>
            </div>
            <button
              type="button"
              onClick={applyAll}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-zinc-950 transition hover:bg-zinc-200"
            >
              Aplicar título, resumen, contenido y categoría
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Titular</h3>
                <button type="button" onClick={() => onApplyTitle(suggestion.title)} className="text-xs font-bold text-fuchsia-300 hover:text-white">Aplicar</button>
              </div>
              <p className="mt-3 text-lg font-black leading-snug">{suggestion.title}</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Resumen</h3>
                <button type="button" onClick={() => onApplySummary(suggestion.summary)} className="text-xs font-bold text-fuchsia-300 hover:text-white">Aplicar</button>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{suggestion.summary}</p>
            </article>
          </div>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Contenido editorial</h3>
              <button type="button" onClick={() => onApplyContent(suggestion.content)} className="text-xs font-bold text-fuchsia-300 hover:text-white">Aplicar al editor</button>
            </div>
            <div className="mt-3 max-h-64 overflow-y-auto text-sm leading-6 text-zinc-300" dangerouslySetInnerHTML={{ __html: suggestion.content }} />
          </article>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">SEO y clasificación</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{suggestion.seoDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestion.tags.map((tag) => <span key={tag} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">{tag}</span>)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestion.hashtags.map((tag) => <span key={tag} className="text-xs font-bold text-fuchsia-300">{tag}</span>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onApplyCategory(suggestion.category)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">Usar categoría: {suggestion.category}</button>
                <CopyButton value={suggestion.seoDescription} label="Copiar SEO" />
                <CopyButton value={suggestion.hashtags.join(" ")} label="Copiar hashtags" />
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Copys para redes</h3>
              <div className="mt-3 grid gap-3">
                <div className="rounded-xl border border-white/10 p-3"><p className="text-xs font-black text-blue-300">Facebook</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{suggestion.facebookCopy}</p><div className="mt-2"><CopyButton value={suggestion.facebookCopy} label="Copiar Facebook" /></div></div>
                <div className="rounded-xl border border-white/10 p-3"><p className="text-xs font-black text-fuchsia-300">Instagram</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{suggestion.instagramCopy}</p><div className="mt-2"><CopyButton value={suggestion.instagramCopy} label="Copiar Instagram" /></div></div>
                <div className="rounded-xl border border-white/10 p-3"><p className="text-xs font-black text-zinc-300">X</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{suggestion.xCopy}</p><div className="mt-2"><CopyButton value={suggestion.xCopy} label="Copiar X" /></div></div>
              </div>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}
