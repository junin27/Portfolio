# Design

## Context

Veja proposal.md (Why). Estado atual: os componentes da home importam direto de `src/content/*.ts` (`perfil`, `projetos`, `publicacoes`, `eventos`, `experiencias`), e `src/content/indice.ts` monta a lista combinada do índice. A maioria dos componentes da home é Client Component (`"use client"`) por causa do GSAP. O projeto usa Next.js 16 com `cacheComponents: true`: dados lidos no servidor fora de `"use cache"` tornam a rota dinâmica e exigem `<Suspense>`.

## Goals / Non-Goals

**Goals:**
- Um único ponto de leitura de conteúdo no servidor, tipado, com cache e etiquetas de invalidação já prontas para o painel usar.
- Componentes visuais sem acesso a dados: recebem tudo por props, para continuarem Client Components.
- Banco local reproduzível com um comando e seed idempotente.

**Non-Goals:**
- Escrita de conteúdo pela interface (vem no `add-admin-panel`). Aqui a escrita existe só no seed e nas funções de validação que o painel vai reaproveitar.
- Otimizar consultas além do necessário: o volume é pequeno (dezenas de registros).

## Decisions

### 1. Prisma 7 com adaptador de driver `pg`
Prisma 7 exige `prisma.config.ts` e um adaptador de driver. Usaremos `@prisma/adapter-pg`, que funciona igual no Docker local e no Supabase.
- *Alternativa:* Drizzle. Descartado por decisão do dono; Prisma tem migrações declarativas parecidas com JPA, que ele já conhece.
- Versão fixa: `prisma@7.10.1` (a 8 é release candidate).

### 2. Supabase: pooler para o app, conexão direta para migrações
Na Vercel, cada função serverless abre conexões. O app usa a URL do pooler do Supabase (modo transação, porta 6543) em `DATABASE_URL`. As migrações usam a conexão direta (porta 5432) em `DIRECT_URL`, configurada no `prisma.config.ts`.
- *Risco evitado:* esgotar o limite de conexões do plano grátis.

### 3. Modelo de dados
- `Profile` (linha única, `id = 1`): nome, cargo, cidade, email, `links` (JSON: github, linkedin, lattes), `rotatingWords` (text[]), `manifesto`.
- `StackGroup` (nome, ordem) 1-N `StackItem` (nome, ordem).
- `Project`: slug (único), título, resumo, categoria (enum web/mobile/api/ml/geo), ano, stack (text[]), problema, solução, resultado, repoUrl, demoUrl, `screens` (text[] de URLs), `captureUrl`, `featured`, `order`, `status` (enum DRAFT/PUBLISHED), timestamps.
- `Publication`: slug, tipo (enum), título, resumo, status acadêmico (enum EM_ANDAMENTO/SUBMETIDO/PUBLICADO), ano, link, `pdfUrl` (Drive), keywords (text[]), coautores (text[]), `order`, `status`.
- `Event`: slug, nome, data (`AAAA-MM` como string validada), papel (enum), descrição, prêmio, `order`, `status`.
- `Experience`: empresa, cargo, início, fim (opcional), entregas (text[]), treinamentos (text[]), `order`, `status`.
- Listas simples como `text[]` do Postgres em vez de tabelas: menos joins, e a edição no painel será por lista.
- *Alternativa:* JSONB para tudo. Descartado: perde a validação por coluna e consultas por campo.

### 4. Validação com Zod compartilhada
Schemas Zod em `src/lib/data/schemas.ts` são a fonte das regras da spec (slug, ano, URL, datas). O seed já valida por eles; o painel vai reutilizar os mesmos schemas nas Server Actions. O banco ainda garante unicidade e enums.

### 5. Leitura com `"use cache"` + `cacheTag`
`src/lib/data/` expõe funções como `getProfile()`, `getPublishedProjects()`, `getProjectBySlug()`, `getPublications()`, `getEvents()`, `getExperiences()`, cada uma com `"use cache"`, `cacheLife("max")` e etiquetas: `content:profile`, `content:projects`, `content:project:<slug>`, `content:publications`, `content:events`, `content:experiences`. O painel vai chamar `updateTag` depois de gravar. Isso atende a invalidação seletiva da spec e mantém a home estática.
- Fallback de perfil ausente: `getProfile()` devolve um objeto neutro em vez de lançar erro.

### 6. Componentes recebem props
`src/app/page.tsx` (Server Component) chama a camada de dados e passa os dados para `Hero`, `Indice`, `EmAcao`, `Pesquisa`, `Eventos`, `Sobre` e `Contato`. `buildIndice()` (hoje `indice.ts`) vira uma função pura que recebe os dados. Os tipos de `src/content/types.ts` passam a ser derivados dos tipos do Prisma e do Zod.

### 7. `generateStaticParams` lendo o banco
As páginas de projeto continuam geradas no build com os slugs publicados. Um slug publicado depois do build é renderizado sob demanda e entra no cache; um slug inexistente ou em rascunho chama `notFound()`.

## Risks / Trade-offs

- [O build da Vercel precisa alcançar o Supabase] → `DATABASE_URL` configurada nos ambientes Production e Preview; documentar no README.
- [Seed rodando contra produção por engano] → o seed recusa rodar se `NODE_ENV=production` sem a flag `--confirm-prod`.
- [Cache servindo conteúdo antigo] → todo caminho de escrita (seed agora, painel depois) invalida as etiquetas afetadas; há o script `npm run cache:clear` para emergências.
- [Prisma 7 com Next 16 e Turbopack] → gerar o client num caminho fixo (`src/generated/prisma`) e importá-lo só em código de servidor (`import "server-only"`).
- [Mudar todos os componentes de import para props] → feito seção por seção, com verificação visual após cada uma.

## Migration Plan

1. Subir o Postgres local (`docker compose up -d`), rodar `prisma migrate dev` e o seed.
2. Trocar as leituras seção por seção, comparando com o visual atual.
3. Na Vercel: criar o projeto no Supabase, configurar `DATABASE_URL` e `DIRECT_URL`, rodar `prisma migrate deploy` e o seed uma vez.
4. Rollback: o commit anterior continua funcionando, porque `src/content/*.ts` não é apagado nesta change.

## Open Questions

- Nome do projeto e região no Supabase (preferência: São Paulo, `sa-east-1`, mais perto do público). Não muda specs nem tarefas.
