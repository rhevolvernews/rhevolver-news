# Rhevolver.news V4

Portal estático profesional y adaptable para GitHub Pages.

## Actualizar tu sitio actual

1. Descomprime este paquete.
2. En el repositorio `rhevolver-news`, abre **Code → Add file → Upload files**.
3. Arrastra `index.html`, `articulo.html`, `editor.html`, `README.md`, la carpeta `assets` y la carpeta `data`.
4. Pulsa **Commit changes**.
5. Espera uno o dos minutos y actualiza con `Ctrl + Shift + R`.

La dirección seguirá siendo la misma.

## Publicar una noticia

Las noticias están en:

`data/noticias.json`

Cada elemento contiene título, resumen, contenido, imagen, categoría, fecha y autor.

También se incluye `editor.html`, que genera el bloque JSON de una noticia. GitHub Pages es un sitio estático: el formulario no puede publicar directamente sin conectar un servicio adicional y autenticación. Por ahora, genera el JSON, agrégalo al archivo y vuelve a subir únicamente `data/noticias.json`.

## Cambiar enlaces

En `index.html` sustituye:

- Facebook
- WhatsApp
- Correo

## Imágenes

Guarda imágenes nuevas dentro de `assets/img/` y coloca la ruta correspondiente en `data/noticias.json`.
