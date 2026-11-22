# ADR-0009: Harness de desenvolvimento e versões fixadas

- **Status:** aceita (2026-11-22)

## Contexto
A change 0 montou o harness: testes, qualidade, hooks do agente, setup e CI. Algumas escolhas do design tiveram que mudar ao encontrar incompatibilidades reais, e o projeto precisa saber por que cada versão está onde está.

## Decisão
- **Versões exatas** (sem `^`, com `save-exact`), escolhidas como a última estável publicada há mais de duas semanas em 2026-11-22: Next 16.4.5, React 19.3.1, Tailwind 4.3.5, Vitest 5.1.0, Playwright 1.65.0, Testcontainers 12.2.1, dependency-cruiser 18.7.2, knip 6.44.2, Prettier 3.9.10, tsx 4.23.15, OpenSpec 1.16.1.
- **Exceções por compatibilidade:**
  - pnpm **11.28.11**, não 12: o Corepack 0.33 do Node 22 não roda o pnpm 12.
  - ESLint **9.39.5**, não 10: os plugins do `eslint-config-next` 16.4 ainda não suportam o 10.
  - TypeScript **5.9.3**, não 7: o `typescript-eslint` exige < 6.1.
- **pnpm** como gerenciador (ADR na change 0, decisão 8), com scripts de instalação liberados um a um em `pnpm-workspace.yaml`: só `esbuild`.
- **Testes:** Vitest com projetos `unit` (node), `componentes` (jsdom) e `integracao` (Testcontainers); Playwright em 3 motores no CI, `retries: 0`.
- **Arquitetura imposta por ferramenta:** ESLint `no-restricted-imports` por camada + dependency-cruiser (ADR-0013).
- **Hooks do Claude Code** (`.claude/settings.json`): formatação do arquivo editado e testes relacionados, não bloqueantes. O hook de testes roda sem pedir permissão, por autorização do dono.
- **Permissões:** comandos de rotina liberados; instalação, commit, push, comandos de git que descartam algo e deploy pedem confirmação; `push --force` e leitura do `.env` bloqueados.
- **Setup idempotente** em `scripts/setup.ps1` e `scripts/setup.sh`; CI no GitHub Actions com os mesmos passos, mais gitleaks, `pnpm audit` e CodeQL.
- **Postgres local na porta 55432**, porque a máquina do dono já tem Postgres instalados na 5432 e na 5433.

## Consequências
- Atualizar uma dependência é uma decisão explícita, com o mesmo critério das duas semanas.
- As exceções de versão são revistas quando a incompatibilidade que as causou acabar (Corepack novo, `eslint-config-next` com ESLint 10, `typescript-eslint` com TS 7).
- O CI só é verificado quando o repositório existir no GitHub.
