# Protección de egress de Supabase — 21 agosto 2026

Este paquete conserva el motor de Rhevolver.news y agrega únicamente ajustes preventivos de entrega de medios:

- Los videos públicos insertados en artículos se normalizan a `preload="none"`, incluso si un HTML antiguo traía otro valor de `preload`; así se evita la descarga automática de metadata/bytes antes de la interacción del usuario.
- Las vistas previas de video en crear/editar usan `preload="none"`.
- La biblioteca multimedia ya no monta el `src` de cada video en la cuadrícula: muestra un marcador de video y no descarga bytes del archivo al abrir la biblioteca.
- Las imágenes de “También te puede interesar” ya no usan `unoptimized`; pasan por la optimización de Next.js con `quality={80}`.
- Se conservan las optimizaciones existentes: portada/carrusel con imágenes optimizadas, compresión automática de imágenes nuevas a WebP cuando reduce peso, y reproductor de video con `preload="none"`.

No se modificaron esquemas, tablas, buckets, políticas, consultas de escritura, autenticación, publicación, edición, contador de vistas ni APIs de Supabase.

Nota: ningún cambio de frontend puede garantizar consumo cero de egress si se sirven archivos desde Supabase. El objetivo de estos cambios es evitar descargas automáticas innecesarias y reducir el peso de las imágenes servidas al público.
