"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import MultiImageUploader from "@/components/MultiImageUploader";
import VideoUploader from "@/components/VideoUploader";

type MediaLibraryProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  managementMode?: boolean;
};

type MediaItem = {
  name: string;
  path: string;
  url: string;
  createdAt: string | null;
  size: number | null;
  kind: "image" | "video";
};

function formatSize(value: number | null) {
  if (!value) return "Tamaño no disponible";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({
  open,
  onClose,
  onSelect,
  onSelectMultiple,
  multiple = false,
  managementMode = false,
}: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(managementMode);
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [deleting, setDeleting] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const folders = ["news", "videos"];
    const results = await Promise.all(
      folders.map((folder) =>
        supabase.storage.from("news-images").list(folder, {
          limit: 500,
          sortBy: { column: "created_at", order: "desc" },
        })
      )
    );

    const firstError = results.find((result) => result.error)?.error;
    if (firstError) {
      setErrorMessage(`No se pudieron cargar los archivos: ${firstError.message}`);
      setLoading(false);
      return;
    }

    const mediaItems = results.flatMap((result, folderIndex) => {
      const folder = folders[folderIndex];
      return (result.data ?? [])
        .filter((item) => item.name && !item.name.endsWith("/"))
        .map((item) => {
          const path = `${folder}/${item.name}`;
          const { data: publicUrlData } = supabase.storage.from("news-images").getPublicUrl(path);
          return {
            name: item.name,
            path,
            url: publicUrlData.publicUrl,
            createdAt: item.created_at || null,
            size: typeof item.metadata?.size === "number" ? item.metadata.size : null,
            kind: folder === "videos" ? "video" as const : "image" as const,
          };
        });
    });

    mediaItems.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    setItems(mediaItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      void loadImages();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, loadImages]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTerm = !term || item.name.toLowerCase().includes(term);
      const matchesKind = filter === "all" || item.kind === filter;
      return matchesTerm && matchesKind;
    });
  }, [items, search, filter]);

  async function deleteItem(item: MediaItem) {
    if (!window.confirm("¿Eliminar este archivo de la biblioteca?")) return;
    setDeleting(item.path);
    const { error } = await supabase.storage
      .from("news-images")
      .remove([item.path]);

    if (error) {
      setErrorMessage(`No se pudo eliminar: ${error.message}`);
    } else {
      setItems((current) => current.filter((entry) => entry.path !== item.path));
      setSelected((current) => current.filter((url) => url !== item.url));
    }
    setDeleting("");
  }

  function selectItem(item: MediaItem) {
    if (!multiple) {
      onSelect?.(item.url);
      if (!managementMode) onClose();
      return;
    }

    setSelected((current) =>
      current.includes(item.url)
        ? current.filter((url) => url !== item.url)
        : [...current, item.url]
    );
  }

  if (!open) return null;

  const content = (
    <div className="flex max-h-[92vh] min-h-[70vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#11131c] shadow-2xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-pink-500">
            RHEVOLVER CMS
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Biblioteca multimedia
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {items.length} archivos disponibles
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowUploader((value) => !value)}
            className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-black text-white hover:bg-pink-500"
          >
            {showUploader ? "Ocultar imágenes" : "+ Imágenes"}
          </button>
          <button
            type="button"
            onClick={() => setShowVideoUploader((value) => !value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10"
          >
            {showVideoUploader ? "Ocultar video" : "+ Video"}
          </button>
          {!managementMode && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10"
            >
              Cerrar
            </button>
          )}
        </div>
      </header>

      {showUploader && (
        <div className="border-b border-white/10 p-5 sm:p-6">
          <MultiImageUploader onUploaded={() => void loadImages()} />
        </div>
      )}
      {showVideoUploader && (
        <div className="border-b border-white/10 p-5 sm:p-6">
          <VideoUploader onUploaded={() => void loadImages()} />
        </div>
      )}

      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:px-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar imagen por nombre…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-pink-500"
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | "image" | "video")} className="rounded-xl border border-white/10 bg-[#090a10] px-4 py-3 text-sm text-white outline-none">
          <option value="all">Todos</option><option value="image">Imágenes</option><option value="video">Videos</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        {loading && <p className="text-center text-zinc-400">Cargando archivos…</p>}

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {errorMessage}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="grid min-h-64 place-items-center text-center">
            <div>
              <div className="text-4xl">🖼</div>
              <h3 className="mt-4 text-lg font-bold text-white">
                No encontramos archivos
              </h3>
              <p className="mt-2 text-zinc-500">
                Sube imágenes o videos, o cambia la búsqueda.
              </p>
            </div>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => {
              const isSelected = selected.includes(item.url);
              return (
                <div
                  key={item.path}
                  className={`group overflow-hidden rounded-2xl border bg-black/20 transition ${
                    isSelected
                      ? "border-pink-500 ring-2 ring-pink-500/30"
                      : "border-white/10 hover:border-pink-500/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    className="relative block w-full overflow-hidden text-left"
                  >
                    {item.kind === "video" ? (
                      <video src={item.url} preload="metadata" muted className="h-44 w-full bg-black object-cover" />
                    ) : (
                      <img src={item.url} alt={item.name} loading="lazy" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                    {multiple && (
                      <span
                        className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border text-xs font-black ${
                          isSelected
                            ? "border-pink-400 bg-pink-600 text-white"
                            : "border-white/30 bg-black/60 text-white"
                        }`}
                      >
                        {isSelected ? "✓" : "+"}
                      </span>
                    )}
                  </button>

                  <div className="p-3">
                    <p className="truncate text-sm font-bold text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.kind === "video" ? "Video" : "Imagen"} · {formatSize(item.size)}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectItem(item)}
                        className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs font-black text-zinc-300 hover:bg-white/10"
                      >
                        {multiple
                          ? isSelected
                            ? "Quitar"
                            : "Seleccionar"
                          : item.kind === "video" ? "Usar video" : "Usar imagen"}
                      </button>
                      {managementMode && (
                        <button
                          type="button"
                          disabled={deleting === item.path}
                          onClick={() => void deleteItem(item)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {deleting === item.path ? "…" : "Eliminar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {multiple && selected.length > 0 && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0b0d14] px-5 py-4 sm:px-6">
          <p className="text-sm font-bold text-zinc-300">
            {selected.length} {selected.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectMultiple?.(selected);
              setSelected([]);
              if (!managementMode) onClose();
            }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 px-5 py-3 text-sm font-black text-white"
          >
            Insertar galería
          </button>
        </footer>
      )}
    </div>
  );

  if (managementMode) return content;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      {content}
    </div>
  );
}
