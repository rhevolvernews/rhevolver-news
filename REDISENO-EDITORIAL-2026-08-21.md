# Rhevolver.news — Rediseño editorial claro

Fecha: 21 de agosto de 2026

Base funcional preservada: `master` del repositorio `rhevolvernews/rhevolver-news`, commit `b5f74d74f0188ecdad5fc08532ea327672451e63`.

## Objetivo

Actualizar únicamente la presentación pública de Rhevolver.news para que se perciba más limpia, periodística y editorial, manteniendo intacto el motor del sitio.

## Cambios visuales

- Encabezado y pie de página conservan la identidad oscura de Rhevolver.
- Portada con transición a superficie editorial clara después de la zona superior de marca/Última Hora.
- Tarjetas de noticias blancas, bordes más finos, sombras discretas y radios menos pronunciados.
- Jerarquía tipográfica más sobria y menos pesada.
- Titular de las notas alineado a la izquierda, con tamaño y peso más editoriales.
- Página de nota en fondo blanco, sin la gran tarjeta blanca flotando sobre fondo negro.
- Imagen principal con borde/radio más discreto y sin sombras excesivas.
- Cuerpo de lectura continuo, limpio y con ancho editorial.
- Módulos laterales, autor, nota editorial y relacionadas convertidos a superficies claras.
- Categorías, búsqueda, videos e institucionales pasan a una estética clara coherente.
- Magenta se conserva como color de acento de marca.

## Fecha y hora

La base de datos no se modifica. `published_at` sigue siendo el mismo dato existente.

Solo cambia su presentación pública para usar explícitamente la zona horaria `America/Mexico_City`, evitando que el servidor muestre la hora UTC. El formato público queda así:

`21 AGO 2026 · 13:25 HRS`

## Motor preservado

No se modificaron:

- `src/app/api`
- `src/lib`
- `src/app/admin`
- `src/app/login`
- `src/app/nueva-noticia`
- `src/app/noticias`
- consultas Supabase
- esquema/base de datos
- publicación y estados
- rutas API
- buscador/API de búsqueda
- conteo de vistas
- editor Tiptap
- sistema de autenticación

## Cambios vigentes de master que se conservaron

- Open Graph estático `public/og-home.png`.
- Etiqueta `fb:app_id` actual.
- Optimización de imágenes de portada y artículo a calidad 80.
- Corrección de hidratación/reloj en `IgualaLiveStrip`.
- Video con `preload="none"`.
- Compresión de imágenes antes de subirlas a Supabase Storage.

## Despliegue

No requiere migraciones ni cambios en Supabase. Se despliega como el proyecto actual: instalar dependencias y compilar normalmente.
