#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: esta carpeta no conserva la conexión Git."
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [ -z "$BRANCH" ]; then
  echo "Error: no se pudo detectar la rama actual."
  exit 1
fi

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "No hay cambios nuevos para publicar."
  exit 0
fi

MESSAGE="Actualización Rhevolver $(date '+%Y-%m-%d %H:%M')"

git add .
git commit -m "$MESSAGE"
git push origin "$BRANCH"

echo "Cambios enviados a GitHub. El alojamiento conectado iniciará el despliegue automático."
