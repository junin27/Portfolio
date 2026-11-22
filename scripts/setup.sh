#!/usr/bin/env bash
# Prepara uma máquina Linux/macOS (e o CI) para rodar e testar o portfólio.
# Idempotente: só faz o que ainda falta. Uso: bash scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

NODE_MINIMO="22.12.0"
NODE_MAIOR_PERMITIDO="22"

etapa() { printf '==> %s\n' "$1"; }

etapa "Conferindo o Node.js"
command -v node >/dev/null || { echo "Node.js não encontrado; instale o Node ${NODE_MAIOR_PERMITIDO}.x >= ${NODE_MINIMO}." >&2; exit 1; }
versao="$(node --version | tr -d v)"
maior="${versao%%.*}"
if [ "$maior" != "$NODE_MAIOR_PERMITIDO" ] || [ "$(printf '%s\n' "$NODE_MINIMO" "$versao" | sort -V | head -1)" != "$NODE_MINIMO" ]; then
  echo "Node ${versao} encontrado; o projeto exige ${NODE_MAIOR_PERMITIDO}.x >= ${NODE_MINIMO} (veja .nvmrc)." >&2
  exit 1
fi

etapa "Conferindo o Docker"
if ! command -v docker >/dev/null || ! docker info >/dev/null 2>&1; then
  echo "Aviso: Docker ausente ou parado; integração e banco local não vão rodar." >&2
fi

etapa "Ativando o pnpm fixado no package.json (Corepack)"
corepack enable
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

etapa "Instalando dependências (lockfile congelado)"
pnpm install --frozen-lockfile

etapa "Instalando navegadores do Playwright"
if [ "${CI:-}" = "true" ]; then
  pnpm exec playwright install --with-deps chromium firefox webkit
else
  pnpm exec playwright install chromium firefox webkit
fi

if [ -f .env ]; then
  etapa ".env já existe; mantido como está"
else
  etapa "Criando .env a partir do .env.example"
  cp .env.example .env
fi

etapa "Pronto. Próximo passo: pnpm check"
