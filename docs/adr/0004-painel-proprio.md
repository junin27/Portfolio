# ADR-0004: Painel administrativo próprio em vez de CMS pronto

- **Status:** aceita (2026-11-21)

## Contexto
O dono quer editar o conteúdo por um painel. Alternativas avaliadas: Payload CMS (pronto, dentro do Next), Keystatic (sem banco, salva no Git) e painel próprio.

## Decisão
Painel próprio em `/admin`, dentro do mesmo app Next, com um único usuário (o dono).

## Consequências
- Mais código para manter e testar: autenticação, autorização, formulários e validação são responsabilidade do projeto.
- O próprio painel vira mais uma peça full-stack do portfólio.
- A segurança do login exige revisão em mais de uma rodada (ver `../CLAUDE.md`, Segurança).
