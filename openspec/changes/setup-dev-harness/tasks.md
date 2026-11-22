# Tasks

## 1. Projeto base

- [x] 1.1 Escrever `package.json` (versões fixas, `packageManager` com o pnpm fixado, scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:integracao`, `test:e2e`, `check`, `format`), `.nvmrc`, `.npmrc` do pnpm, `.gitignore`, `.editorconfig` e `.env.example`; verificar por revisão do dono
- [x] 1.2 [DONO] Rodar `corepack enable`, `pnpm install` e `git init`; verificar que o `pnpm-lock.yaml` foi criado sem avisos de dependência faltando
- [x] 1.3 Escrever `tsconfig.json` (strict, `noUncheckedIndexedAccess`, alias `@/*`), `next.config.ts` (`cacheComponents`; Tailwind pelo loader `@tailwindcss/turbopack`, sem `postcss.config.mjs`), `src/app/layout.tsx`, `src/app/globals.css` e uma `src/app/page.tsx` mínima, e criar as pastas vazias de `docs/arquitetura.md` com `.gitkeep`; verificar com [DONO] `pnpm build` passando

## 2. Testes unitários e de componente

- [x] 2.1 Configurar Vitest (`vitest.config.ts` com projetos `unit` em node e `componentes` em jsdom, setup do Testing Library); verificar com um teste de componente da home mínima passando em `pnpm test` (pedir permissão para rodar)
- [x] 2.2 Criar a porta `Relogio` em `src/aplicacao/portas/relogio.ts` (local ajustado pelo ADR-0013) e o `FakeRelogio` em `tests/fakes/`, com teste que congela uma data e confere o valor; verificar com `pnpm test` verde
- [x] 2.3 Documentar a convenção de testes (nomes, arrange/act/assert, fakes nomeados, sem lógica em teste) em `tests/README.md`; verificar por revisão do dono

## 3. Testes de integração e e2e

- [x] 3.1 Criar `docker-compose.yml` (Postgres 17, volume nomeado) para desenvolvimento; verificar com [DONO] `docker compose up -d` e `docker compose ps` saudável
- [x] 3.2 Configurar `pnpm test:integracao` com Testcontainers e um teste que sobe Postgres e executa `SELECT 1`; verificar com o teste passando (pedir permissão; exige Docker rodando)
- [x] 3.3 Configurar Playwright (`playwright.config.ts` subindo `next start`, só Chromium localmente) e um e2e que abre a home e confere o título; verificar com [DONO] `pnpm exec playwright install chromium` e depois `pnpm test:e2e` verde

## 4. Qualidade

- [x] 4.1 Configurar ESLint estrito (sem `any`, retorno explícito em `dominio`/`aplicacao`, sem números mágicos, limites de tamanho, `no-restricted-paths` entre camadas) e Prettier; verificar com um arquivo de teste proposital em `dominio` importando `@/infraestrutura`, que o lint precisa acusar, e depois apagado
- [x] 4.2 Fechar o `pnpm check` (lint + typecheck + test); verificar com [DONO] rodando no terminal e saindo com código 0

## 5. Harness do agente

- [x] 5.1 Escrever `.claude/settings.json` com `deny` para comandos destrutivos de git e remoção recursiva, `ask` para o resto e o hook de Prettier pós-edição; verificar pedindo ao Claude Code um `git restore` de teste e vendo o bloqueio
- [x] 5.2 Escrever primeiro o teste do `scripts/hooks/testar-relacionados.mjs` (arquivo fora de `src`/`tests` é ignorado, resumo de sucesso, resumo de falha com a primeira mensagem, tempo limite estourado sai sem erro) e depois o script; registrar o hook `PostToolUse` não bloqueante no `.claude/settings.json`; verificar editando um arquivo com teste e vendo o resumo devolvido ao agente
- [x] 5.3 [DONO] Rodar `pnpm dlx @fission-ai/openspec@1.16.1 init --tools claude --language pt-BR` para instalar os comandos `/opsx:*`; verificar que o `openspec/config.yaml` deste projeto foi preservado

## 6. Setup e CI

- [x] 6.1 Escrever `scripts/setup.ps1` e `scripts/setup.sh` idempotentes; verificar com [DONO] rodando duas vezes seguidas sem erro e sem duplicar o `.env`
- [ ] 6.2 Escrever `.github/workflows/ci.yml` (pnpm com cache; jobs de qualidade, integração, e2e e build); verificação adiada até o dono criar o repositório no GitHub: [DONO] push e todos os jobs verdes
- [x] 6.3 Atualizar o README (como rodar, como testar, estrutura) e escrever o ADR-0009 (harness, pnpm, hook de testes autorizado, versões fixadas); verificar seguindo o README num clone limpo

## 7. Portão de qualidade

- [ ] 7.1 Adicionar as ferramentas ativas desde a change 0 (dependency-cruiser, knip, gitleaks, Playwright com Firefox e WebKit) e ligar cada uma a um script `pnpm`; verificar com [DONO] `pnpm install` e cada script rodando isolado
- [ ] 7.2 Escrever primeiro os testes de `scripts/portao/` (matriz tipada, verificação não aplicável com motivo, reprovação por limite, relatório reprovado sem checklist manual) usando `FakeExecutorDeProcessos`, e depois a implementação de `matriz.ts`, `executor.ts`, `relatorio.ts` e `cli.ts`; verificar com `pnpm test` verde
- [ ] 7.3 Escrever primeiro os testes de `scripts/hooks/bloquear-archive.mjs` (bloqueia com item reprovado, com checklist desmarcado e com relatório mais velho que o último commit; libera com tudo verde) e depois o script; registrar o hook `PreToolUse` no `.claude/settings.json`; verificar tentando arquivar a change com relatório reprovado e vendo o bloqueio
- [ ] 7.4 Configurar o Mantis com estado em `../.mantis-estado/` e rodar a campanha completa inicial sobre o projeto; verificar que `THREAT_MODEL.md` e o relatório foram gerados e que o `pnpm portao` reconhece o relatório
- [ ] 7.5 Adicionar ao `.github/workflows/ci.yml` as mesmas verificações do portão (incluindo CodeQL e Playwright nos 3 navegadores); verificação junto com a 6.2, quando o repositório existir
- [ ] 7.5a [DONO] Instalar o SkillSpector (`uv tool install --python 3.13 git+https://github.com/NVIDIA/skillspector.git`, versão registrada no ADR-0012); depois escanear Mantis, OpenSpec e o ponytail antes de instalá-lo, triando os achados; verificar com o relatório de cada um anexado em `docs/qualidade/skills/` e todos com nota ≤ 20
- [ ] 7.5b [DONO] Instalar o ponytail (só depois da 7.5a liberar) com `webhookUrl` vazio e registro local desligado, e recusar a sugestão de statusline (ADR-0010); verificar com `/ponytail lite` ativo e nenhum arquivo novo em `~/.config/ponytail/band/`
- [ ] 7.5c Incluir o `/ponytail-review` no `pnpm portao` como bloco 4 (o script confere se a revisão da change existe, é mais nova que o último commit e não tem "Must fix"/"Should fix" pendente) com testes do critério; verificar com `pnpm test` verde
- [ ] 7.6 Atualizar o `CLAUDE.md` do projeto e o `openspec/config.yaml` para exigir o portão em toda change; verificar por revisão do dono

## 8. Portão desta change

- [ ] 8.1 Rodar `pnpm portao` e aplicar o ciclo de correção de `docs/estrategia-de-testes.md` até uma execução completa sem nenhum problema pendente; verificar com `verificacao.md` 100% verde
- [ ] 8.2 [DONO] Revisar o `verificacao.md` e os falsos positivos registrados

## Workflow follow-up

- Arquivar a change só depois da 8.1 e 8.2 (as tarefas 6.2 e 7.5 podem ficar pendentes até o repositório existir, registradas no relatório como não aplicáveis com esse motivo).
- Depois, começar a `add-dominio-e-portas` (change 1 do roadmap).
