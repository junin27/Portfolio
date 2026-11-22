# Design

## Context

Pasta nova, só com documentação (`CLAUDE.md`, `docs/`, `openspec/`). O protótipo `../site` serve de referência para versões que já funcionaram juntas (Next 16.4.6, React 19.3, Tailwind 4.3, GSAP 3.15). Regras do dono: execução controlada (a IA só roda testes, com permissão), TDD, fakes nomeados, testes autônomos sem configuração manual.

## Goals / Non-Goals

**Goals:**
- Um clone novo chega a "testes verdes" com `scripts/setup.ps1` seguido de `pnpm check`.
- Toda regra crítica do `CLAUDE.md` que dá para impor por ferramenta é imposta por ferramenta (permissões, lint, CI), não só por texto.

**Non-Goals:**
- Cobertura mínima obrigatória no CI agora: sem código de produção, o número não diz nada. Entra na change 1.
- Storybook ou testes visuais por screenshot: avaliar depois do design system.

## Decisions

### 1. Arquivos de configuração escritos à mão em vez de `create-next-app`
O `create-next-app` recusa pastas com arquivos que não estejam na lista dele (README, CLAUDE.md, openspec), e geraria versões não fixas e exemplos que seriam apagados. Os arquivos (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`) são escritos com base no protótipo, que já provou essas versões juntas.
- *Alternativa:* gerar em pasta temporária e copiar. Mais passos para o dono, mesmo resultado.

### 2. Versões fixas (sem `^`)
`next@16.4.6`, `react@19.3.0`, `react-dom@19.3.0`, `typescript@5.x` (a mesma do protótipo), `tailwindcss@4.3.3`, `vitest`, `@testing-library/react`, `jsdom`, `@playwright/test`, `testcontainers`, `prettier`, `@fission-ai/openspec@1.16.1`. As versões exatas das ferramentas de teste são conferidas no registro do npm na implementação, sempre a última estável publicada há mais de duas semanas, e anotadas no ADR-0009.

### 3. Três níveis de teste e scripts separados
- `pnpm test`: unitários e componentes (Vitest, ambiente `jsdom` só para arquivos `*.test.tsx`), rápidos e sem Docker.
- `pnpm test:integracao`: Vitest com Testcontainers (Postgres 17), separado porque precisa do Docker.
- `pnpm test:e2e`: Playwright contra `next start`.
- `pnpm check`: lint + tipos + `pnpm test`. É o comando do dia a dia e o que o `CLAUDE.md` cita.

### 4. Convenção de fakes
`tests/fakes/` contém classes nomeadas (`FakeRelogio`, depois `FakeProjetoRepository`...) que implementam as mesmas interfaces do domínio. Esta change cria só `FakeRelogio` (relógio congelado), já que toda regra com data vai precisar dele, e um teste que prova a convenção.

### 5. ESLint estrito
Base `eslint-config-next` + `typescript-eslint` com `no-explicit-any`, `explicit-function-return-type` em código de `dominio`/`aplicacao`, `no-magic-numbers` (com exceções 0, 1, -1), `max-lines` 500 e `max-lines-per-function` ~40 como aviso. Regra `import/no-restricted-paths` para impedir `dominio` de importar `infraestrutura`, `app` ou bibliotecas de I/O, o que garante a direção das dependências do `docs/arquitetura.md`.

### 6. Permissões do Claude Code como reforço do CLAUDE.md
`.claude/settings.json`:
- `deny`: `git restore`, `git reset`, `git checkout --`, `git clean`, `git revert`, `rm -rf`, `Remove-Item -Recurse`.
- `ask`: qualquer outro Bash/PowerShell (incluindo os testes, como o CLAUDE.md pede).
- Hook `PostToolUse` em Edit/Write rodando `prettier --write` só no arquivo alterado.
- Hook de testes: ver decisão 7.

### 7. Hook de testes relacionados (autorizado pelo dono)
Depois de cada Edit/Write em `src/` ou `tests/` (`.ts`/`.tsx`), um script `scripts/hooks/testar-relacionados.mjs` roda `vitest related --run <arquivo>` só no projeto `unit`/`componentes` e devolve um resumo curto (testes que passaram ou falharam, com a primeira mensagem de erro) como contexto para o agente.
- **Não bloqueia:** no ciclo de TDD, o teste vermelho é esperado logo depois de escrever o teste, e bloquear atrapalharia o fluxo. O resultado só informa.
- **Tempo limite** de 60 s; se estourar, o hook avisa e sai sem erro.
- Testes de integração (Docker) e e2e nunca rodam pelo hook.
- *Alternativa rejeitada:* hook de `Stop` rodando `pnpm check` e bloqueando o fim do turno. Lento e impede parar com um teste vermelho de propósito no meio do TDD.

### 8. pnpm como gerenciador de pacotes
O dono delegou a escolha. pnpm em vez de npm porque:
- Não deixa o código importar dependências que não estão no `package.json` (as "dependências fantasmas"), o que reforça a regra de justificar toda dependência.
- Instala mais rápido, inclusive no CI, e ocupa menos disco com o armazenamento compartilhado.
- A Vercel e o GitHub Actions suportam nativamente.
- *Custo:* mais uma ferramenta. A versão fica fixada no campo `packageManager` do `package.json` e é ativada pelo Corepack, que vem com o Node 22, sem instalação global manual.
- *Alternativa:* npm. Funciona, mas sem a proteção contra dependências fantasmas.

### 9. CI no GitHub Actions
Um workflow com jobs `qualidade` (lint, tipos, unitários), `integracao` (Docker disponível no runner Ubuntu) e `e2e` (Playwright com navegadores em cache), mais `build`. Node fixado pela `.nvmrc` (22.x, a mesma do ambiente atual).

### 10. Setup no Windows
`scripts/setup.ps1` (o ambiente do dono é Windows/PowerShell 5.1): confere versão do Node e Docker, ativa o Corepack, roda `pnpm install --frozen-lockfile`, instala o Chromium do Playwright, copia `.env.example` para `.env` se não existir. Pode rodar de novo sem efeito colateral. Um `scripts/setup.sh` equivalente serve ao CI e a Linux/macOS.

### 11. Portão de qualidade como código testado
`scripts/portao/` em TypeScript (rodado com `tsx`), dividido por responsabilidade:
- `matriz.ts`: a matriz de `docs/estrategia-de-testes.md` como dados tipados (verificação, comando, critério, change em que ativa).
- `executor.ts`: roda cada verificação ativa e coleta o resultado. Recebe o executor de processos por parâmetro, para os testes usarem um `FakeExecutorDeProcessos`.
- `relatorio.ts`: gera `verificacao.md` a partir dos resultados, do checklist manual e dos falsos positivos.
- `cli.ts`: lê a change ativa e chama os três.
Como é código que decide se uma change está pronta, ele tem testes unitários próprios (critério de aprovação, "não aplicável" com motivo, relatório reprovado se faltar checklist).
- *Alternativa rejeitada:* um shell script com a sequência de comandos. Não dá para testar, e a matriz ficaria espalhada.

### 12. Bloqueio do archive
Hook `PreToolUse` em Bash/PowerShell do Claude Code: se o comando contém `openspec archive`, o script `scripts/hooks/bloquear-archive.mjs` lê o `verificacao.md` da change e bloqueia (código de saída 2, com o motivo) se houver item reprovado, item manual desmarcado ou relatório mais antigo que o último commit. Tem testes próprios.
- *Limite:* o hook só protege archives feitos pelo Claude Code. Um archive feito à mão pelo dono no terminal não passa pelo hook; o CI acusa depois.

### 13. Mantis
- Os skills ficam em `~/.agents/skills/mantis-*`, fora do projeto. O estado do Mantis (`workspace/`) fica em `../.mantis-estado/` (fora do repositório, exigência do próprio Mantis para não misturar estado com o código).
- A change 0 roda a campanha completa uma vez (etapas 0 a 14 sem a de correção automática) para gerar a base de conhecimento e o modelo de ameaças.
- Nas changes seguintes, o `pnpm portao` chama o Mantis em modo incremental com os arquivos alterados. Como o Mantis é uma análise feita por IA e não um binário, essa etapa roda dentro da sessão do Claude Code. O script só confere se o relatório do Mantis da change existe, é mais novo que o último commit e não tem achado confirmado pendente.
- `mantis-patch` não é usado: correções seguem o ciclo de TDD (ver `docs/estrategia-de-testes.md`).
- Confiança mais baixa: ainda não usei o Mantis neste projeto. A tarefa 7.4 é um teste de verdade da integração antes de confiar nela.

## Risks / Trade-offs

- [Portão lento desestimula rodar] → `pnpm check` continua rápido para o dia a dia; o portão roda só ao fechar a change e no CI.
- [Regressão visual variando entre Windows e o CI] → screenshots sempre gerados no contêiner oficial do Playwright.
- [Mantis não determinístico] → critério é "nenhum achado confirmado pendente"; falsos positivos ficam registrados com prova.
- [Ciclo de correção sem fim] → parada obrigatória para o dono na terceira volta da mesma falha.

- [Testcontainers no Windows exige Docker Desktop rodando] → o setup avisa com mensagem clara; testes de integração ficam fora do `pnpm check`.
- [Hook de testes deixando a edição lenta] → só testes relacionados ao arquivo, tempo limite de 60 s, sem integração nem e2e.
- [Corepack sendo removido de versões futuras do Node] → a `.nvmrc` fixa o Node 22; se migrar de Node, instalar o pnpm pela forma oficial e registrar num ADR.
- [Regras de lint estritas atrapalhando o código de animação (números de tempo, easing)] → constantes nomeadas em `ui/movimento.ts`; exceções só por arquivo e com comentário do porquê.
- [Hook de formatação falhando em arquivo que o Prettier não entende] → o hook ignora extensões fora da lista e nunca bloqueia a edição.
- [Versões novas demais] → regra das duas semanas e versões anotadas no ADR-0008.

## Migration Plan

Não há migração: pasta nova. O protótipo `../site` continua intocado como referência visual até a change 4 terminar.
