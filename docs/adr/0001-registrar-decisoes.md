# ADR-0001: Registrar decisões de arquitetura

- **Status:** aceita (2026-11-21)

## Contexto
O projeto é feito em par com IA, sessão a sessão. Sem registro, o "porquê" das escolhas se perde.

## Decisão
Toda decisão de arquitetura vira um ADR curto em `docs/adr/`, numerado em sequência, no formato contexto → decisão → consequências. ADRs não são editados depois de aceitos: uma mudança de rumo gera um ADR novo que substitui o anterior.

## Consequências
- Cada change OpenSpec que toma uma decisão estrutural inclui o ADR correspondente.
- O `CLAUDE.md` aponta para cá em vez de repetir as decisões.
