# Flujo único de Rhevolver.news

## Ver cambios mientras editas

```bash
npm run dev
```

Los cambios guardados en VS Code se actualizan automáticamente en `http://localhost:3000`.

## Publicar la versión en línea

```bash
npm run publish
```

Este comando agrega los cambios, crea un commit y los envía al repositorio original:

`https://github.com/rhevolvernews/rhevolver-news.git`

Si el alojamiento de `rhevolver.news` continúa conectado a ese repositorio, el despliegue comenzará automáticamente después del push.

El archivo `.env.local` está excluido por `.gitignore` y no se publica en GitHub.
