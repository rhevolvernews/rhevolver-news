# Rhevolver V9.3.18 — Escudo de egress de Supabase

Objetivo: reducir de forma estructural el egress de Supabase y evitar que redes sociales, bots y visitantes descarguen medios directamente desde Storage.

## Cambios de aplicación

- Se crea `/media/news-images/[...path]` como capa de entrega de imágenes en Rhevolver.news.
- La ruta lee el objeto con el cliente administrativo de Supabase y responde con caché CDN de Vercel de larga duración.
- El proxy solo acepta `news/` y `video-thumbnails/` y además verifica que el MIME sea `image/*`; los videos no pueden pasar por esta ruta.
- Las imágenes nuevas que se suban desde el CMS guardan como URL pública la ruta de Rhevolver.news, no la URL directa de Supabase.
- La biblioteca multimedia devuelve la URL protegida para imágenes existentes.
- Open Graph transforma URLs antiguas de `news-images` a la ruta de Rhevolver para que Facebook y otros rastreadores no reciban como imagen social el origen directo de Supabase.
- Las lecturas GET públicas de PostgREST realizadas desde el servidor usan caché de 60 segundos. Los filtros `published_at=lte` se redondean al minuto para que metadata y página puedan reutilizar la misma lectura en vez de generar una URL distinta por milisegundos.
- Escrituras, panel administrativo y clientes en navegador no usan esta caché.
- Los videos privados de `news-videos` conservan el flujo de URL firmada bajo demanda.
- Los videos legacy de `news-images/videos/` conservan compatibilidad mediante el endpoint de video, que ya genera URL firmada al solicitar reproducción.

## Auditoría del 27 de agosto de 2026

- 78 noticias en la tabla `news`.
- 77 noticias tenían `featured_image` apuntando directamente al bucket público `news-images`.
- 22 noticias contenían URLs directas de `news-images` dentro del cuerpo.
- El bucket `news-images` almacenaba aproximadamente 534 MB en 182 objetos.
- De ese total, aproximadamente 452 MB correspondían a 27 videos legacy bajo `videos/`.
- 11 de esos videos legacy seguían referenciados por noticias; 16 objetos, aproximadamente 270 MB, no tenían referencia en el contenido de ninguna noticia. No se eliminan automáticamente porque la limpieza de archivos es una acción destructiva separada.

## Migración posterior al despliegue en Production

Después de que V9.3.18 esté activa en Production:

1. Reescribir URLs de `featured_image` que apunten al origen público de Supabase hacia `https://rhevolver.news/media/news-images/...`.
2. Reescribir esas mismas URLs dentro de `content` para imágenes de cuerpo, galerías y miniaturas.
3. Verificar que no queden referencias directas de imágenes públicas.
4. Cambiar `news-images` a bucket privado. El proxy seguirá leyendo las imágenes con credenciales de servidor, mientras que los accesos directos y hotlinks dejarán de funcionar.
5. Mantener los videos legacy reproducibles mediante URLs firmadas; no se exponen mediante el proxy de imágenes.

No se modifican títulos, textos periodísticos, slugs, categorías, estados, fechas, IDs, RLS ni el flujo de publicación.

## Importante durante la cuota agotada

Este escudo evita repetir el patrón de consumo cuando el servicio vuelva a estar disponible, pero una cuota ya agotada puede seguir devolviendo HTTP 402 hasta el reinicio del ciclo o un cambio de plan. El despliegue no puede crear bytes de caché nuevos mientras Supabase rechace la lectura del origen.
