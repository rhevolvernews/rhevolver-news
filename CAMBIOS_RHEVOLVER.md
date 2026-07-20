# Rhevolver.news — versión consolidada 4.1

- Recuperada la conexión Git original con `rhevolvernews/rhevolver-news`.
- Conservados todos los avances funcionales y visuales de la versión 4.0.
- Agregadas páginas de Responsabilidad editorial, Transparencia y Publicidad y alianzas.
- Reforzado el descargo de responsabilidad, correcciones, uso responsable de IA y derechos de autor.
- Optimización de imágenes, caché, consultas de portada y render diferido de secciones inferiores.
- Identidad propia de Rhevolver: no se replica la estructura ni el estilo de otros medios.
- Dashboard y rutas privadas continúan protegidos; la portada pública no muestra acceso editorial.

# Rhevolver.news — Registro de cambios

## Versión 2.1 — Portada profesional

- Portada editorial rediseñada y responsive.
- Carrusel automático real con controles, indicadores y accesibilidad.
- Header profesional reutilizable.
- Menú móvil animado con todas las categorías.
- Redes completas: Facebook, Instagram, TikTok, X, YouTube y canal de WhatsApp.
- Footer profesional reutilizable.
- Cintillo animado de Última Hora.
- Bloques de actualidad, tendencias, cobertura editorial y contenidos visuales.
- Metadatos generales, Open Graph y Twitter Card base.
- Mejoras globales de estilos, movimiento reducido y navegación.
- Dashboard, CMS, Supabase, publicación y rutas existentes conservados.

## Verificación

- `npm run build`: correcto.
- `npm run lint`: sin errores; quedan advertencias no bloqueantes por imágenes externas con `<img>`.

## Versión 2.2
- Rediseño profesional de la página individual de noticia.
- SEO dinámico por artículo mediante `generateMetadata`.
- Open Graph, Twitter Cards, URL canónica y robots avanzados.
- Datos estructurados Schema.org `NewsArticle`.
- Sitemap XML dinámico con noticias publicadas.
- Archivo robots.txt generado por Next.js.
- Integración del header y footer compartidos.
- Mejor tipografía y estilos para contenido editorial enriquecido.


## Versión 2.3 — Rendimiento, Analytics y preparación Meta

- Migración de imágenes públicas principales a `next/image`.
- Generación automática de formatos AVIF y WebP.
- Mejora de carga prioritaria en el carrusel y la imagen principal de cada artículo.
- Google Analytics opcional mediante `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Servicio interno preparado para publicar artículos en una Página de Facebook cuando se agreguen permisos y credenciales.
- Variables documentadas en `.env.example`; los secretos de Meta permanecen únicamente en el servidor.
- Se conservaron Dashboard, CMS, Supabase, SEO, Open Graph, sitemap y robots.


## Versión 2.4 — Asistencia editorial con IA

- Módulo de IA integrado en las pantallas de nueva noticia y edición.
- Generación estructurada de titular, resumen, contenido HTML, categoría, descripción SEO, etiquetas y hashtags.
- Copys listos para Facebook, Instagram y X con botones de copiado.
- Aplicación selectiva o completa de sugerencias sin guardar ni publicar automáticamente.
- Endpoint privado `/api/ai/editorial` protegido por el acceso administrativo.
- Integración server-side con OpenAI Responses API; la clave nunca se expone al navegador.
- Variables `OPENAI_API_KEY` y `OPENAI_MODEL` documentadas en `.env.example`.
- Política editorial incorporada: no inventar datos y exigir revisión humana.

## 2.6 - Multimedia
- Se renovó la biblioteca multimedia con búsqueda, contador y modo de administración.
- Se añadió carga múltiple mediante selector o arrastrar y soltar, con progreso.
- La imagen destacada ahora puede elegirse desde archivos ya subidos.
- El editor permite insertar una imagen, una galería o un video.
- YouTube y Facebook Video se muestran embebidos dentro de las noticias.
- TikTok se inserta como enlace editorial compatible.
- Se añadió eliminación de imágenes desde la biblioteca.

## Versión 2.7 — SEO avanzado y distribución

- Feed RSS 2.0 dinámico en `/rss.xml`.
- Sitemap específico para Google News en `/news-sitemap.xml` con artículos de las últimas 48 horas.
- `robots.txt` actualizado con ambos sitemaps y exclusión de rutas editoriales privadas.
- Datos estructurados globales `NewsMediaOrganization` y `WebSite` con búsqueda interna.
- Metadatos globales reforzados, descubrimiento automático del RSS y Twitter/X Cards.
- Datos `NewsArticle` mejorados en cada noticia.

## 4.0.0 — Versión final de identidad y lanzamiento
- Mega menú y menú móvil de pantalla completa.
- Acceso editorial eliminado de la navegación pública.
- Páginas institucionales: Sobre Rhevolver, misión, visión, valores y principios editoriales.
- Páginas legales: privacidad, términos y cookies.
- Contacto, correcciones y página 404 personalizada.
- Página pública de videos.
- Carga directa de videos al almacenamiento de Supabase desde Multimedia y el editor.
- Biblioteca multimedia unificada para imágenes y videos.
- Barra de progreso y tiempo estimado de lectura en artículos.
- Footer público reorganizado con solo enlaces necesarios.
