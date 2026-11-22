# Proposal

## Why

O portfólio vai ser refeito com TDD, specs e boas práticas (ver `../../../CLAUDE.md` e `docs/adr/0007`). Antes de qualquer funcionalidade, o projeto precisa de uma base onde testar é fácil e automático, a qualidade é checada a cada push e o agente de IA trabalha dentro das regras do dono. Sem essa base, cada change futura reinventaria a infraestrutura.

## What Changes

- **Projeto Next.js 16** criado à mão (arquivos de configuração com versões fixas), com TypeScript estrito, Tailwind 4 e a estrutura de pastas de `docs/arquitetura.md`, ainda sem páginas além de uma home mínima.
- **Harness de testes:**
  - Vitest para unitários e componentes (com Testing Library e jsdom).
  - Testcontainers para testes de integração com Postgres real, subido pelo próprio teste.
  - Playwright para ponta a ponta.
  - Pasta `tests/fakes` com a convenção de fakes nomeados.
  - Um comando único: `npm run check`.
- **Qualidade:** ESLint (regras do Next e do TypeScript em modo estrito, sem `any`), Prettier, verificação de tipos e `.editorconfig`.
- **Integração contínua:** GitHub Actions rodando lint, tipos, unitários, integração, e2e e build a cada push e pull request.
- **Harness do agente (Claude Code):**
  - `.claude/settings.json` com permissões que reforçam o `CLAUDE.md`: bloqueia `git restore/reset/checkout/clean/revert` e `rm -rf`, e pede confirmação para o resto.
  - Hook de formatação automática após edição.
  - Hook que roda os testes relacionados ao arquivo editado e devolve o resultado ao agente.
  - Comandos e skills do OpenSpec.
- **Setup reproduzível:**
  - `scripts/setup.ps1` idempotente: confere Node e Docker, instala dependências, cria o `.env` a partir do `.env.example`.
  - `docker-compose.yml` com o Postgres local.
- **Portão de qualidade (ADR-0008, `docs/estrategia-de-testes.md`):**
  - Script `pnpm portao` que roda as verificações ativas da matriz, `openspec validate --strict` e o Mantis, e gera `verificacao.md` na change.
  - Ferramentas ativas desde a change 0: as da matriz marcadas com "0" (inclui Playwright nos 3 navegadores, dependency-cruiser, knip, gitleaks, `pnpm audit`, CodeQL).
  - Hook que bloqueia `openspec archive` sem relatório 100% verde.
  - Mantis configurado com o estado fora do repositório e a primeira campanha completa.
  - SkillSpector como filtro de instalação de skills/plugins e verificação da pasta `.claude/` no portão (ADR-0012).
  - Ponytail instalado no modo `lite`, com `/ponytail-review` como revisão extra no portão (ADR-0010).
  - A própria change 0 só é arquivada passando pelo portão.
- **Documentação:** README com o passo a passo para rodar e testar; ADR-0009 sobre o harness.

## Capabilities

### New Capabilities
(nenhuma: esta change só cria ferramentas e configuração, sem comportamento para o visitante ou o dono. Marcada com `skip_specs: true`.)

### Modified Capabilities
(nenhuma)

## Fora de escopo

- Qualquer funcionalidade do site ou do painel (começa na change 1).
- Prisma e o modelo de dados (change 1). Aqui só sobe o Postgres e prova que o Testcontainers funciona.
- Deploy na Vercel e Supabase (change 10). O CI apenas constrói o projeto.
- Ajustes visuais.

## Decisões do dono (2026-11-21)

1. **Hook de testes: autorizado.** O dono libera o hook a rodar os testes relacionados ao arquivo editado sem pedir permissão a cada vez. A exceção vale só para o hook; testes rodados à mão pela IA continuam pedindo permissão. Fica registrada no `CLAUDE.md` do projeto e no ADR-0008.
2. **Repositório no GitHub:** o dono vai criar. Até lá, as tarefas de CI ficam escritas, mas a verificação delas espera o repositório. Visibilidade a definir pelo dono (recomendação: público).
3. **Gerenciador de pacotes:** escolha delegada à IA. Escolhido **pnpm** (ver design, decisão 8).
4. **Portão de qualidade:** todas as verificações aplicáveis, o OpenSpec e o Mantis precisam zerar. Problemas são confirmados ou descartados com evidência; os confirmados são corrigidos e o portão roda de novo até não sobrar nada (ADR-0008).

5. **Execução do portão: autorização permanente** (decisão de 2026-11-22, substitui a anterior de pedir a cada vez). A IA roda `pnpm portao`, os testes e as etapas do Mantis sem pedir permissão, quantas vezes o ciclo de correção precisar. Install, git, migrações, deploy e qualquer outro comando continuam com o dono.

## Impact

- Pasta nova `portfolio-v2/`; o protótipo `../site` não é alterado.
- Dependências de desenvolvimento novas: vitest, @testing-library/react, jsdom, @playwright/test, testcontainers, prettier, @fission-ai/openspec (todas com versão fixa no design).
- Exige Docker Desktop instalado para os testes de integração e o banco local.
