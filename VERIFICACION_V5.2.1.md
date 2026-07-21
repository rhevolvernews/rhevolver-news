# Rhevolver CMS v5.2.1 — flujo profesional de video

- La miniatura se genera automáticamente en JPG 16:9 al subir un video.
- La miniatura se sube a Supabase Storage y se asigna automáticamente como imagen destacada cuando no existe otra.
- El editor permite reemplazar la miniatura generada.
- Las noticias normales muestran únicamente su imagen destacada.
- Las noticias con video muestran miniatura e indicador VIDEO/PLAY en portada y tarjetas.
- Dentro de una noticia con video ya no se duplica imagen y reproductor: el reproductor utiliza la miniatura como poster.
- Las noticias con video incluyen datos estructurados VideoObject.
