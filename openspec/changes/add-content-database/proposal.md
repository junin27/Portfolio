# Proposal

## Why

Hoje todo o conteúdo do portfólio (perfil, projetos, publicações, eventos, experiências e stack) está escrito no código, em `src/content/*.ts`. Qualquer mudança exige editar TypeScript e fazer um novo deploy. O dono quer editar tudo por um painel administrativo próprio. Esta change é a fundação do painel: o conteúdo passa a morar num banco Postgres e o site público passa a ler dele, sem mudar nada do que o visitante vê.

## What Changes

- Novo banco Postgres com um modelo de dados para perfil, links, stack, projetos, publicações, eventos e experiências.
- Camada de acesso a dados no servidor (`src/lib/data/`) que o site público usa para ler o conteúdo, com cache por etiqueta (cache tag) para o site continuar rápido.
- Script de seed que copia o conteúdo atual de `src/content/*.ts` para o banco, para o site ficar idêntico depois da migração.
- Os componentes da home e a página `/projetos/[slug]` passam a receber o conteúdo por props vindas do banco, em vez de importar os arquivos `.ts`.
- Campos novos já previstos no modelo para as próximas changes: ordem de exibição, visibilidade (publicado ou rascunho) e links de arquivos externos (Google Drive). O site público só mostra itens publicados.
- **BREAKING (interno)**: `src/content/*.ts` deixa de ser a fonte de verdade. Os arquivos ficam só como dados do seed e são removidos numa change futura.

## Capabilities

### New Capabilities
- `portfolio-content`: como o conteúdo do portfólio é guardado, validado, ordenado, filtrado por visibilidade e entregue ao site público, incluindo a invalidação do cache quando o conteúdo muda.

### Modified Capabilities
(nenhuma: ainda não existem specs no projeto)

## Fora de escopo

- O painel administrativo em si (telas, formulários, CRUD): fica para a change `add-admin-panel`.
- Login e autenticação do painel: change `add-admin-auth`.
- Integração com a API do Google Drive (upload, listagem, pré-visualização). Esta change só guarda o link ou o ID do arquivo como texto.
- Qualquer mudança visual no site.
- Internacionalização (PT/EN).

## Decisões do dono (confirmadas)

- **Postgres em produção:** Supabase (Postgres serverless, acessado pelo pooler de conexões).
- **Postgres local:** Docker com `docker compose`.
- **ORM:** Prisma 7 (última versão estável; a 8 ainda é release candidate).
- **Arquivos pesados:** Google Drive, guardados no banco só como URL.

## Impact

- **Dependências novas:** `prisma`, `@prisma/client` e o adaptador de driver do Postgres; `zod` para validar os dados.
- **Código afetado:** `src/app/page.tsx`, `src/app/projetos/[slug]/page.tsx`, `src/components/home/*` (passam a receber props), `src/content/indice.ts` (vira função sobre os dados do banco).
- **Infra:** variável de ambiente `DATABASE_URL` local e na Vercel; `docker-compose.yml` para o banco local.
- **Build:** a geração das páginas de projeto (`generateStaticParams`) passa a consultar o banco, então o build precisa de acesso a ele.
- **Roteiro das próximas changes:** `add-admin-auth` → `add-admin-panel` → `add-drive-files`.
