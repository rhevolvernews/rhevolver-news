# Rhevolver.news V2

Versión profesional para reemplazar los archivos del repositorio actual sin cambiar la dirección pública.

## Cómo actualizar el sitio que ya publicaste

1. Entra a tu repositorio:
   `https://github.com/rhevolvernews/rhevolver-news`
2. Pulsa **Add file → Upload files**.
3. Sube `index.html`, `README.md` y la carpeta `assets` de este paquete.
4. GitHub mostrará que algunos archivos ya existen. Confirma la subida y pulsa **Commit changes**.
5. Espera entre 1 y 3 minutos.
6. Abre:
   `https://rhevolvernews.github.io/rhevolver-news/`

La dirección no cambia. GitHub reemplazará la versión anterior por esta.

## Qué incluye esta versión

- Portada tipo medio digital.
- Menú adaptable a celular.
- Barra de última hora animada.
- Buscador funcional.
- Filtros por categoría.
- Botones de compartir.
- Noticias de ejemplo.
- Secciones de Opinión, IA, TV Show y Humor.
- Galería.
- Espacio para videos.
- Enlaces a redes sociales.
- Metadatos básicos para compartir en redes.

## Cambiar enlaces sociales

En `index.html`, busca y reemplaza:

- `https://www.facebook.com/`
- `https://x.com/`
- `https://www.instagram.com/`
- `https://www.youtube.com/`
- `https://www.tiktok.com/`
- `https://wa.me/5210000000000`

## Cambiar una noticia

Busca una tarjeta que comience con:

```html
<article class="news-card searchable"
```

Cambia el título dentro de `<h3>`, el resumen dentro de `<p>` y la imagen dentro de `src="..."`.

## Agregar un video de YouTube

Sustituye el bloque `video-placeholder` por:

```html
<div class="video-placeholder">
  <iframe width="100%" height="360" src="https://www.youtube.com/embed/ID_DEL_VIDEO" title="Video de Rhevolver" allowfullscreen></iframe>
</div>
```

Cambia `ID_DEL_VIDEO` por el código del video.
