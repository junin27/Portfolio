# Portfólio v2

Site pessoal para mostrar projetos de software, pesquisas, eventos e experiência profissional, com um painel administrativo próprio para editar todo o conteúdo sem mexer no código.

Objetivo: conseguir vagas melhores e clientes freelance, mostrando os trabalhos no formato certo (apps num celular, sites num monitor, pesquisas num leitor de PDF).

## Estado atual

Harness de desenvolvimento em construção (change 0). O site ainda é uma página provisória.

- Roteiro das entregas: [docs/roadmap.md](docs/roadmap.md)
- Arquitetura (Clean Architecture): [docs/arquitetura.md](docs/arquitetura.md)
- Decisões: [docs/adr/](docs/adr/)
- Estratégia de testes e portão de qualidade: [docs/estrategia-de-testes.md](docs/estrategia-de-testes.md)
- Change em andamento: [openspec/changes/setup-dev-harness/](openspec/changes/setup-dev-harness/)

O protótipo visual de referência é o projeto `../site` (versão 1, sem testes).

## Pré-requisitos

- Node.js 22 (>= 22.12; veja `.nvmrc`). O pnpm vem pelo Corepack, na versão fixada no `package.json`.
- Docker Desktop, para os testes de integração e o banco local.

## Como rodar

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1   # Windows
```

```bash
bash scripts/setup.sh   # Linux/macOS e CI
```

O setup confere Node e Docker, instala as dependências com o lockfile congelado, baixa os navegadores do Playwright e cria o `.env` a partir do `.env.example` (sem sobrescrever um `.env` existente). Pode rodar de novo quando quiser.

| Comando | O que faz |
|---|---|
| `pnpm dev` | site em http://localhost:3000 |
| `pnpm check` | lint, formatação, tipos, arquitetura e testes unitários/componentes |
| `pnpm test:integracao` | testes com Postgres real (Testcontainers; Docker ligado) |
| `pnpm test:e2e` | Playwright; `TODOS_OS_NAVEGADORES=1` roda Chromium, Firefox e WebKit |
| `pnpm codigo-morto` | knip |
| `pnpm specs` | valida as specs do OpenSpec |
| `docker compose up -d` | Postgres local na porta 55432 (ajustável em `POSTGRES_PORTA_HOST`) |

## Estrutura

```
src/
  dominio/          entidades e regras (TypeScript puro)
  aplicacao/        casos de uso e portas
  infraestrutura/   adaptadores (banco, Drive, sessão)
  servidor/         raiz de composição
  app/              rotas Next.js
  ui/               componentes visuais
tests/              fakes, integração, e2e e convenções (tests/README.md)
scripts/            setup, hooks do Claude Code e portão de qualidade
openspec/           specs e changes
docs/               arquitetura, roteiro, ADRs e registros de qualidade
```

## Trabalhando com o Claude Code

Abra a sessão **dentro desta pasta**: só assim carregam os hooks (formatação e testes relacionados a cada edição) e as permissões de `.claude/settings.json`. Regras do projeto em [CLAUDE.md](CLAUDE.md).
