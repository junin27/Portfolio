# ADR-0007: Desenvolvimento guiado por specs com OpenSpec

- **Status:** aceita (2026-11-21)

## Contexto
A primeira versão foi gerada de uma vez, sem specs nem testes, e o dono não aprovou o processo.

## Decisão
Cada entrega é uma change OpenSpec (proposal, specs, design, tasks) aprovada pelo dono antes da implementação. Implementação com TDD. Ao terminar, a change é arquivada e suas specs passam a ser a referência em `openspec/specs/`. Versão fixa do CLI: `@fission-ai/openspec@1.16.1`.

## Consequências
- Entregas menores e revisáveis; ritmo mais lento no início.
- As specs viram a documentação viva do comportamento do sistema.
