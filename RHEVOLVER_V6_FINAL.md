# Rhevolver CMS v6.0.0 — Edición Final Premium

Versión integral construida sobre Rhevolver CMS v5.2.3 sin modificar la estructura de Supabase ni el flujo de despliegue.

## Incluido

- Identidad visual premium con fondos editoriales, morado, rosa y amarillo mate.
- Modo cine sutil al reproducir videos; Escape o pausa restaura la página.
- Reproductor adaptable para video horizontal y vertical.
- Vista previa completa antes de publicar o actualizar una noticia.
- Borradores, edición, programación, archivo, papelera, restauración y eliminación definitiva.
- Galerías y selección múltiple de imágenes desde la biblioteca multimedia.
- Buscador con más resultados y clasificación por relevancia.
- Noticias relacionadas inteligentes por categoría, palabras clave, actualidad y vistas.
- Seis noticias relacionadas al final de cada nota.
- Lectura móvil refinada y protección contra desbordamientos de contenido.
- SEO dinámico con descripción automática, palabras clave, Open Graph, Twitter Card, NewsArticle y BreadcrumbList.
- Base PWA, sitemap, news sitemap, RSS, robots y páginas institucionales conservadas.
- Registro npm público fijado en `.npmrc` y `package-lock.json` limpio.

## Elementos conservados

- Supabase y tabla `news`.
- Login y protección del panel.
- Vercel, Cloudflare y dominio `rhevolver.news`.
- Miniaturas automáticas de video.
- Menú móvil, Safari/iOS, buscador, portada y redes sociales.

## Validación

- Todos los archivos TypeScript/TSX pasaron validación sintáctica con TypeScript 5.8.3.
- El ZIP no incluye `.env.local`, `node_modules`, `.next` ni archivos de compilación.
- Para validación final local: `npm install` y `npm run build`.
