"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MediaLibraryProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
};

type MediaItem = {
  name: string;
  url: string;
};

export default function MediaLibrary({
  open,
  onClose,
  onSelect,
}: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadImages() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase.storage
        .from("news-images")
        .list("news", {
          limit: 100,
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        });

      if (error) {
        setErrorMessage(`No se pudieron cargar las imágenes: ${error.message}`);
        setLoading(false);
        return;
      }

      const imageItems =
        data
          ?.filter((item) => item.name && !item.name.endsWith("/"))
          .map((item) => {
            const filePath = `news/${item.name}`;

            const { data: publicUrlData } = supabase.storage
              .from("news-images")
              .getPublicUrl(filePath);

            return {
              name: item.name,
              url: publicUrlData.publicUrl,
            };
          }) ?? [];

      setItems(imageItems);
      setLoading(false);
    }

    loadImages();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#11131c] shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-pink-500">
              RHEVOLVER CMS
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Biblioteca multimedia
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10"
          >
            Cerrar
          </button>
        </header>

        <div className="max-h-[72vh] overflow-y-auto p-6">
          {loading && (
            <p className="text-center text-zinc-400">
              Cargando imágenes...
            </p>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {errorMessage}
            </div>
          )}

          {!loading && !errorMessage && items.length === 0 && (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <div className="text-4xl">🖼</div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  No hay imágenes todavía
                </h3>
                <p className="mt-2 text-zinc-500">
                  Las imágenes que subas aparecerán aquí.
                </p>
              </div>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-left transition hover:border-pink-500/50 hover:bg-white/5"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-3">
                    <p className="truncate text-sm font-bold text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Seleccionar imagen
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}