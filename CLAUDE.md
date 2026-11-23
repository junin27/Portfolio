# Portfólio v2: regras do projeto

Regras gerais: `../CLAUDE.md` (XP, execução controlada, TDD). Este arquivo só traz o que é específico deste projeto.

## Execução
- Só testes podem ser rodados, e só depois de pedir permissão. Todo o resto (install, build, migrations, git, scripts) vai como comando para o dono rodar.
- Exceção autorizada pelo dono (2026-11-21): o hook `PostToolUse` roda `vitest related` no arquivo editado sem pedir permissão. Testes rodados à mão continuam pedindo.
- Autorização permanente do dono (2026-11-22), sem pedir nem confirmar a cada execução: testes (`pnpm test*`, `pnpm check`), `pnpm portao`, scripts de desenvolvimento do `package.json` (lint, typecheck, format, build, dev), CLI do OpenSpec, etapas do Mantis, comandos do ponytail e as ferramentas do portão (Playwright, Lighthouse, gitleaks, knip, dependency-cruiser, Stryker, ZAP).
- Pedir autorização antes, a cada vez (comandos irreversíveis ou que saem da máquina): instalar/remover dependências, `git commit`, `git push`, migrações em banco real, deploy.
- `git restore`, `reset`, `checkout`, `clean` e `revert` estão em `deny` (2026-11-23): só o dono roda, à mão. Motivo: no modo de permissão `auto` as regras `ask` não pediram confirmação.
- Todo o resto roda sem pedir.
- Gerenciador: pnpm (Corepack). Verificação única: `pnpm check` (lint + tipos + unitários). Integração: `pnpm test:integracao` (Docker). E2E: `pnpm test:e2e`.

## Fluxo de trabalho
- Spec primeiro: uma change OpenSpec por vez (`openspec/changes/`). Só implementar depois da aprovação do dono.
- Roteiro em `docs/roadmap.md`. Decisões em `docs/adr/`. Uma decisão nova vira um ADR novo.
- Cada change termina com o Definition of Done do `../CLAUDE.md` e com o portão verde (ADR-0008, `docs/estrategia-de-testes.md`).
- Portão: matriz de testes + `openspec validate --strict` + Mantis. Todo problema: triagem com evidência → falso positivo registrado em `docs/qualidade/falsos-positivos.md`, ou confirmado → teste de regressão → correção mínima → portão inteiro de novo. Repetir até zerar.
- Parar e chamar o dono: mesma falha 3 vezes, correção que muda escopo/spec/arquitetura, arquivo fora da change, dúvida sobre falso positivo.
- Nunca baixar limite, pular, enfraquecer ou apagar teste para passar. Teste instável é falha.
- Ponytail (ADR-0010): modo `lite`; `/ponytail-review` é o bloco 4 do portão. Em conflito vale este arquivo e o `../CLAUDE.md` (TDD completo; sem comentários `shortcut:`, usar `TODO(issue #N)`). Não usar `ultra`. Não sugerir a statusline dele.
- Skill ou plugin de terceiros (instalar ou atualizar): SkillSpector com nota ≤ 20 + leitura do código antes de recomendar a instalação (ADR-0012). Ferramenta nova no harness só com problema concreto que ela resolva.
- impeccable (ADR-0015, a partir da change 2): detector no portão + `critique`/`audit` por change de front. Telemetria desligada. Modo live e "Apply" proibidos. Outros comandos só a pedido do dono.
- `mantis-patch` não é usado; estado do Mantis em `../.mantis-estado/`, nunca no repositório.

## Exceção de idioma (ADR-0006)
- Identificadores, comentários e nomes de arquivo de domínio em pt-BR (ex.: `Projeto`, `listarProjetosPublicados`).
- Termos técnicos sem tradução natural ficam em inglês (`Repository`, `useCase`, `props`, `slug`).
- Mensagens de commit em inglês.

## Clean Architecture (ADR-0013, `docs/arquitetura.md`)
- Só importar para dentro: `dominio` ← `aplicacao` ← `app` / `infraestrutura`. `ui` não importa `aplicacao` nem `infraestrutura`.
- `dominio` e `aplicacao`: TypeScript puro, sem Next, React, Prisma, Zod, GSAP ou I/O.
- Dependência externa = porta em `aplicacao/portas/` + adaptador em `infraestrutura/` + fake em `tests/fakes/`.
- Um caso de uso por ação, dependências por parâmetro; composição só em `src/servidor/container.ts`.
- Erro esperado volta como `Resultado`; exceção só para bug.
- Server Actions e páginas são controladores finos: Zod, chamar caso de uso, mapear para props.

## Next.js 16
- APIs mudaram: ler `node_modules/next/dist/docs/` antes de usar qualquer API do Next.
- `cacheComponents` ligado: leitura de dados com `"use cache"` + `cacheTag`; escrita no painel chama `updateTag`.
- `dynamicParams` não é compatível com `cacheComponents`; rotas totalmente estáticas usam `export const instant = false`.

## Pegadinhas já encontradas
- GSAP SplitText dentro de títulos com elementos animados internos quebra as referências: usar máscaras próprias (`overflow-hidden` por linha).
- `fromTo` dentro de timeline renderiza o estado inicial na hora: usar `immediateRender: false` em ciclos.
- Prisma 8 ainda é RC: fixar Prisma 7.x.
- Corepack 0.33 (Node 22) não roda pnpm 12 (procura `bin/pnpm.cjs`, que mudou): fixado pnpm 11.28.11.
- `eslint-config-next` 16.4 só suporta ESLint 9 (plugins import, jsx-a11y, react): fixado ESLint 9.39.5.
- `typescript-eslint` 8.72 exige TypeScript < 6.1: fixado TypeScript 5.9.3 (o 7 é a reescrita nativa).
- pnpm bloqueia scripts de instalação: liberar um a um em `pnpm-workspace.yaml` (`allowBuilds`); só `esbuild` está liberado.
- Máquina do dono tem PostgreSQL 17 na 5432 e 13 na 5433 instalados no Windows: Docker usa a 55432.
- Shell Bash do agente não vê o `docker` no PATH; usar PowerShell recarregando o PATH da máquina.
- Hooks e permissões de `.claude/settings.json` só carregam em sessão aberta **dentro de `portfolio-v2/`**, não na pasta `Portfólio/`.
- Sessão em worktree do app desktop: settings, hooks e `CLAUDE_PROJECT_DIR` vêm do checkout **principal**. Os hooks acham o worktree pelo git (`raizDoCheckoutDe`), mas mudança em `settings.json` ou em `scripts/hooks/` só vale depois de chegar ao `master` do checkout principal.
- Worktree novo não tem `node_modules`: rodar `pnpm install --frozen-lockfile` nele antes de qualquer teste.
- Para testar hook à mão no Git Bash, mandar caminhos no formato Windows (`cygpath -w`); `$PWD` gera `/c/...`, que o Node não resolve.
- `vitest related` no projeto `unit` roda a suíte unitária inteira, não só o teste ligado ao arquivo (rápido hoje; rever se a suíte crescer).
