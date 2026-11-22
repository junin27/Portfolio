# Convenção de testes

Problema que resolve: testes que leem como especificação, falham por um único motivo e rodam sozinhos, sem configuração manual. Estratégia completa e portão em `docs/estrategia-de-testes.md`.

## Onde fica cada teste

| Tipo | Onde | Comando |
|---|---|---|
| Unitário | ao lado do código (`*.test.ts`) ou em `tests/` | `pnpm test` |
| Componente | ao lado do componente (`*.test.tsx`), roda em jsdom | `pnpm test` |
| Integração | `tests/integracao/` (Postgres real via Testcontainers; precisa do Docker) | `pnpm test:integracao` |
| Ponta a ponta | `tests/e2e/*.spec.ts` (Playwright) | `pnpm test:e2e` |

## Regras

- **Nome lê como spec:** `describe` com o sujeito, `it` com o comportamento ("recusa avanço negativo, porque o tempo não volta").
- **Arrange / act / assert** separados por uma linha em branco. Um motivo para falhar por teste.
- **Sem lógica no teste:** nada de `if`, laço ou cálculo decidindo a asserção.
- **Sem estado compartilhado mutável** entre testes; cada teste monta o que precisa.
- **Determinístico:** sem hora real (`FakeRelogio`), sem rede real, sem `sleep`, aleatoriedade com semente.
- **I/O externo só por fakes nomeados** em `tests/fakes/` (`FakeRelogio`, depois `FakeProjetoRepository`...), que implementam a mesma porta de `src/aplicacao/portas/`. Nada de stub inline.
- **Testar comportamento, não implementação:** asserções sobre o que é observável (retorno, tela, banco), não sobre detalhes internos.
- **Bordas, não só o caminho feliz:** vazio, limite, unicode, fuso horário, erro de cada dependência.
- **Teste instável é falha:** encontrar a causa e corrigir. Nunca repetir até passar (`retries: 0`).
- **Nunca enfraquecer ou apagar um teste para o build passar.** Teste errado é corrigido de propósito, com o motivo no commit.
- **E2E:** marque com `@smoke` os testes do caminho crítico; eles formam o smoke pós-deploy.
