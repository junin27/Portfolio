# ADR-0003: Postgres no Supabase com Prisma 7, Docker no desenvolvimento

- **Status:** aceita (2026-11-21)

## Contexto
O conteúdo precisa ser editável pelo painel e persistido. O dono escolheu Postgres, Supabase em produção, Docker local e Prisma.

## Decisão
- Produção: Postgres no Supabase. O app conecta pelo pooler (modo transação) em `DATABASE_URL`; migrações usam a conexão direta em `DIRECT_URL`.
- Desenvolvimento: Postgres 17 em Docker (`docker compose`).
- Testes de integração: Postgres efêmero via Testcontainers, sem configuração manual.
- ORM: Prisma 7.x com adaptador `pg`. A 8.x ainda é release candidate.

## Consequências
- O build na Vercel precisa alcançar o banco.
- O Prisma fica atrás das interfaces de repositório do domínio, então trocar de ORM afeta só `infraestrutura`.
- Migrações só para frente; migração já aplicada nunca é editada.
