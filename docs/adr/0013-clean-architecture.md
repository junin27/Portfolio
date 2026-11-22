# ADR-0013: Clean Architecture

- **Status:** aceita (2026-11-22)

## Contexto
O dono quer o projeto em Clean Architecture. `docs/arquitetura.md` já tinha camadas e dependências para dentro, mas sem o nome, sem as regras completas e com o diagrama mostrando casos de uso dependendo direto do Prisma.

## Decisão
Clean Architecture com quatro círculos, do centro para fora:

| Círculo | Pasta | Contém | Pode importar |
|---|---|---|---|
| Entidades | `src/dominio/` | entidades, value objects, regras de negócio, erros de domínio | nada (só TypeScript puro) |
| Casos de uso | `src/aplicacao/` | um caso de uso por ação (`salvarProjeto`, `listarProjetosPublicados`), **portas** (interfaces de repositório, Drive, relógio, sessão), DTOs de entrada e saída | `dominio` |
| Adaptadores de interface | `src/app/` (rotas, Server Actions, mapeamento para props) e `src/ui/` (componentes) | controladores finos: validam a entrada com Zod, chamam o caso de uso e mapeiam o resultado para a tela | `aplicacao`, `dominio` (só tipos), `ui` |
| Frameworks e drivers | `src/infraestrutura/` | **adaptadores** que implementam as portas: Prisma, Google Drive, sessão, cache do Next | `aplicacao`, `dominio`, bibliotecas externas |

Regras:
- **Regra da dependência:** só se importa para dentro. `dominio` e `aplicacao` não conhecem Next, React, Prisma, Zod, GSAP nem nada de I/O.
- **Portas e adaptadores:** cada dependência externa é uma interface em `aplicacao/portas/`; a implementação fica em `infraestrutura/`; o fake nomeado fica em `tests/fakes/`.
- **Raiz de composição:** `src/servidor/container.ts` é o único lugar que liga portas a adaptadores. Casos de uso recebem dependências por parâmetro.
- **Casos de uso devolvem resultado, não lançam para erros esperados:** `Resultado<Sucesso, ErroEsperado>` (validação, não encontrado, conflito). Exceção fica só para bug.
- **Controladores finos:** Server Actions e páginas não têm regra de negócio. Autenticação e autorização ficam na borda e também são checadas no caso de uso que exige o dono.
- `ui` não importa `aplicacao` nem `infraestrutura`; recebe props já mapeadas.
- **Imposto por ferramenta:** ESLint `no-restricted-paths` e dependency-cruiser no portão (teste de arquitetura). Violação reprova o portão.

Adaptações pragmáticas ao Next.js (YAGNI):
- Sem camada de "presenter" separada: o mapeamento resultado → props fica numa função pura em `app/`, testada.
- O cache do Next (`"use cache"`, `cacheTag`, `updateTag`) é detalhe de infraestrutura, mas é chamado na borda (`app/`), porque só funciona dentro do runtime do Next. O caso de uso devolve quais etiquetas foram afetadas.

## Consequências
- Domínio e casos de uso testados só com fakes, sem banco nem Next: testes unitários rápidos.
- Trocar Prisma, Supabase ou Drive afeta só `infraestrutura` e o container.
- Mais arquivos e interfaces do que um app Next comum; o custo é aceito porque o painel tem regras de negócio reais.
- Substitui as partes de camadas de `docs/arquitetura.md`, que foi alinhado a este ADR.
