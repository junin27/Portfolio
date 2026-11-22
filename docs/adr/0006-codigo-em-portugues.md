# ADR-0006: Identificadores e comentários em português neste projeto

- **Status:** aceita (2026-11-21)

## Contexto
A regra geral do dono (`../CLAUDE.md`, Rule 0) pede código em inglês. Para este projeto ele escolheu manter português.

## Decisão
Exceção local: identificadores de domínio, comentários e nomes de arquivo em pt-BR. Termos técnicos sem tradução natural ficam em inglês (`Repository`, `props`, `slug`, `useCase`). Mensagens de commit seguem em inglês.

## Consequências
- O vocabulário do domínio fica igual ao das specs (que já são em pt-BR), sem tradução no meio.
- Identificadores sem acento (`publicacao`, não `publicação`) para evitar problemas de ferramenta.
