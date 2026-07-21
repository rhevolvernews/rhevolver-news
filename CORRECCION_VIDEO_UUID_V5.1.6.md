# Rhevolver CMS v5.1.6

## Corrección

Se reemplazó el uso directo de `crypto.randomUUID()` en el cargador de videos.

En conexiones HTTP mediante una IP local, algunos navegadores no exponen `randomUUID`, lo que impedía iniciar la subida aunque el archivo cumpliera el límite de 200 MB.

La generación del nombre del archivo ahora usa:

1. `crypto.randomUUID()` cuando está disponible.
2. `crypto.getRandomValues()` como alternativa segura.
3. Un identificador temporal compatible como último recurso.

Esto permite subir videos desde localhost, IP de red local, Safari, Chrome y producción HTTPS.
