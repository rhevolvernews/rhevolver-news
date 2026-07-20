import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/categorias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    },
    ...[
      "sobre-rhevolver",
      "mision-vision",
      "principios-editoriales",
      "aviso-de-privacidad",
      "terminos-y-condiciones",
      "politica-de-cookies",
      "correcciones",
      "responsabilidad-editorial",
      "transparencia",
      "publicidad-y-alianzas",
      "contacto",
      "videos",
    ].map((route) => ({
      url: `${SITE_URL}/${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "videos" ? 0.75 : 0.5,
    })),
    ...[
      "local",
      "guerrero",
      "nacional",
      "politica",
      "internacional",
      "deportes",
      "ia",
      "opinion",
      "tv-show",
    ].map((category) => ({
      url: `${SITE_URL}/categoria/${category}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];

  const { data, error } = await supabase
    .from("news")
    .select("id, slug, published_at, created_at")
    .in("status", ["published", "featured", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error al generar sitemap:", error.message);
    return staticRoutes;
  }

  const articleRoutes: MetadataRoute.Sitemap = (data ?? []).map((item) => ({
    url: `${SITE_URL}/noticia/${item.slug || item.id}`,
    lastModified: new Date(item.published_at || item.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
