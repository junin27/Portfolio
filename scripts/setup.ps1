# Prepara uma máquina Windows para rodar e testar o portfólio. Pode rodar quantas vezes quiser:
# só faz o que ainda falta. Uso (na raiz do projeto): powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

$NodeMinimo = [version]"22.12.0"
$NodeMaiorPermitido = 22

function Escrever-Etapa([string]$Texto) { Write-Host "==> $Texto" -ForegroundColor Cyan }

function Confirmar-Node {
  Escrever-Etapa "Conferindo o Node.js"
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js nao encontrado. Instale o Node $NodeMaiorPermitido (>= $NodeMinimo) e rode de novo."
  }
  $versao = [version]((node --version).TrimStart("v"))
  if ($versao -lt $NodeMinimo -or $versao.Major -ne $NodeMaiorPermitido) {
    throw "Node $versao encontrado; o projeto exige $NodeMaiorPermitido.x >= $NodeMinimo (veja .nvmrc)."
  }
}

function Confirmar-Docker {
  Escrever-Etapa "Conferindo o Docker"
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Warning "Docker nao encontrado. Testes de integracao e banco local nao vao rodar ate instalar o Docker Desktop."
    return
  }
  docker info --format "{{.ServerVersion}}" *> $null
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Docker instalado mas parado. Abra o Docker Desktop antes de rodar pnpm test:integracao."
  }
}

function Instalar-Dependencias {
  Escrever-Etapa "Ativando o pnpm fixado no package.json (Corepack)"
  corepack enable
  $env:COREPACK_ENABLE_DOWNLOAD_PROMPT = "0"
  Escrever-Etapa "Instalando dependencias (lockfile congelado)"
  pnpm install --frozen-lockfile
  if ($LASTEXITCODE -ne 0) { throw "pnpm install falhou com codigo $LASTEXITCODE." }
  Escrever-Etapa "Instalando navegadores do Playwright"
  pnpm exec playwright install chromium firefox webkit
  if ($LASTEXITCODE -ne 0) { throw "Instalacao dos navegadores falhou com codigo $LASTEXITCODE." }
}

function Criar-Env {
  if (Test-Path ".env") {
    Escrever-Etapa ".env ja existe; mantido como esta"
    return
  }
  Escrever-Etapa "Criando .env a partir do .env.example"
  Copy-Item ".env.example" ".env"
}

Confirmar-Node
Confirmar-Docker
Instalar-Dependencias
Criar-Env
Escrever-Etapa "Pronto. Proximo passo: pnpm check"
