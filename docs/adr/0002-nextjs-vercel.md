# ADR-0002: Next.js 16 com React e TypeScript, deploy na Vercel

- **Status:** aceita (2026-11-21)

## Contexto
O dono quer React com TypeScript e deploy na Vercel. O site público precisa de SEO e de carregar rápido no celular; o painel precisa de lógica no servidor (login, escrita no banco).

## Decisão
Next.js 16 (App Router) num único projeto para site público e painel. `cacheComponents` ligado: páginas públicas servidas de cache e invalidadas por etiqueta quando o painel grava.

## Consequências
- Um deploy só, sem API separada.
- O Next 16 tem APIs novas e pouco cobertas por material antigo: consultar a documentação que vem em `node_modules/next/dist/docs/` antes de usar qualquer API. A confiança da IA nessas APIs é menor e o código precisa de revisão mais atenta.
- Rotas com dados de request exigem `<Suspense>`; rotas totalmente estáticas usam `instant = false`.
