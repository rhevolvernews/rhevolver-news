# Verificación Rhevolver CMS v5.1

Fecha de verificación: 2026-07-20

Esta versión fue comparada contra el respaldo funcional `rhevolver-cms(2).zip`.

## Archivos funcionales modificados

- `src/components/SiteHeader.tsx`
  - Menú móvil lateral visible en iPhone/Safari.
  - Cierre al tocar fuera y con tecla Escape.
  - Scroll interno y zonas seguras de iOS.
  - Encabezado móvil simplificado sin saturación.

- `src/app/globals.css`
  - Soporte para `100dvh`, `-webkit-fill-available` y safe areas.
  - Animación del panel lateral.
  - Mejoras táctiles y de desplazamiento en Safari.
  - Ajustes del cintillo de Última Hora.

- `src/app/noticia/[slug]/page.tsx`
  - Open Graph dinámico con imagen destacada absoluta.
  - Imagen social de respaldo 1200x630.
  - Twitter/X Card dinámica.

- `src/app/opengraph-image.tsx`
  - Imagen social de respaldo con identidad Rhevolver.

- `src/app/layout.tsx`
  - Ajustes de metadatos y viewport para móviles.

- `public/sw.js`
  - Actualización de caché para evitar versiones antiguas en Safari.

## Validación técnica

Comando ejecutado:

```bash
npm run build
```

Resultado: compilación de producción completada correctamente, TypeScript sin errores y 24 páginas generadas.

## Elementos conservados sin reconstruir

- Portada y carrusel.
- Dashboard, login y Supabase.
- Publicación y edición de noticias.
- Multimedia, galerías y videos.
- Git, rama `master`, Vercel y dominio.
- Contacto, WhatsApp, redes y páginas institucionales.
