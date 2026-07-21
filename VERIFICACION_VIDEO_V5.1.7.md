# Rhevolver CMS v5.1.7 — reproductor de video garantizado

## Corrección

- El CMS guarda una referencia explícita de cada video subido dentro del contenido.
- La URL se conserva en una referencia síncrona para evitar que una publicación rápida pierda el video.
- La página pública extrae las URLs de video y construye reproductores React directamente.
- El reproductor ya no depende de que el navegador interprete correctamente la etiqueta `<video>` incrustada por el editor.
- Compatible con Safari y Chrome mediante `controls`, `playsInline` y `preload="metadata"`.
- Se evita mostrar el mismo video dos veces dentro del cuerpo de la noticia.

## Verificación

- `npm run lint`: 0 errores; 2 advertencias anteriores sobre miniaturas.
- `npm run build`: compilación completa y TypeScript correctos.
