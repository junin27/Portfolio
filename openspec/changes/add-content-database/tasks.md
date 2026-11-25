# Tasks

## 1. Ambiente e dependências

- [ ] 1.1 Criar `docker-compose.yml` com Postgres 17 (volume nomeado, porta 5432) e `.env.example` com `DATABASE_URL` e `DIRECT_URL`; verificar com `docker compose up -d` e `docker compose ps` mostrando o banco saudável
- [ ] 1.2 Instalar `prisma@7.10.1`, `@prisma/client@7.10.1`, `@prisma/adapter-pg`, `pg`, `zod`, `server-only`, `vitest` e `tsx` com versões fixas; verificar que `npm ls` não mostra conflitos e que `npm run build` continua passando
- [ ] 1.3 Criar `prisma.config.ts` (schema, migrações, `DIRECT_URL` para migrar) e gerar o client em `src/generated/prisma`; verificar com `npx prisma validate`
- [ ] 1.4 Configurar Vitest (`vitest.config.ts`, script `npm test`) com um teste de exemplo; verificar que `npm test` roda e passa

## 2. Modelo de dados e validação (TDD)

- [ ] 2.1 Escrever primeiro os testes dos schemas Zod (slug válido e inválido, ano fora do intervalo, data `AAAA-MM`, URL sem http, status acadêmico inválido) e vê-los falhar; verificar com `npm test` mostrando as falhas esperadas
- [ ] 2.2 Implementar `src/lib/data/schemas.ts` até os testes de 2.1 passarem; verificar com `npm test` todo verde
- [ ] 2.3 Escrever `prisma/schema.prisma` com Profile, StackGroup, StackItem, Project, Publication, Event e Experience (enums, `order`, `status`, slug único) conforme o design; verificar com `npx prisma migrate dev --name init` criando as tabelas
- [ ] 2.4 Criar `src/lib/db.ts` (client com adaptador `pg`, singleton em dev, `import "server-only"`); verificar com um teste de integração que abre conexão e faz `SELECT 1` no banco do Docker

## 3. Seed a partir do conteúdo atual

- [ ] 3.1 Escrever `prisma/seed.ts` que lê `src/content/*.ts`, valida com os schemas Zod e grava com upsert (perfil `id = 1`, itens por slug), tudo como `PUBLISHED` e com a `order` atual; verificar com `npx prisma db seed` e contagem de registros igual à dos arquivos
- [ ] 3.2 Garantir idempotência e trava de produção (recusa `NODE_ENV=production` sem `--confirm-prod`); verificar com um teste de integração que roda o seed duas vezes e compara contagens, e outro que confirma a recusa em produção

## 4. Camada de leitura com cache (TDD)

- [ ] 4.1 Escrever testes de integração para as funções de leitura: só itens publicados, ordenação por `order` e depois pelo mais recente, `getProjectBySlug` de rascunho retornando `null`, `getProfile` sem registro retornando o fallback neutro; verificar que falham antes da implementação
- [ ] 4.2 Implementar `src/lib/data/` (`getProfile`, `getPublishedProjects`, `getProjectBySlug`, `getPublications`, `getEvents`, `getExperiences`) com `"use cache"`, `cacheLife` e as etiquetas `content:*` do design; verificar com `npm test` verde
- [ ] 4.3 Criar `src/lib/data/invalidate.ts` com a lista de etiquetas por tipo de conteúdo e o script `npm run cache:clear`; verificar alterando um título no banco, rodando o script e vendo o título novo no site em dev
- [ ] 4.4 Transformar `src/content/indice.ts` em `buildIndice(dados)` pura e cobrir com teste unitário (ordem, contagens por filtro, hash estável); verificar com `npm test`

## 5. Site lendo do banco

- [ ] 5.1 Fazer `src/app/page.tsx` buscar os dados e passar por props para `Hero`, `Marquee` e `Contato` (perfil e links); verificar no navegador que o hero e o contato estão idênticos ao visual atual
- [ ] 5.2 Passar por props os dados de `Indice`, `EmAcao` e `Pesquisa`; verificar no navegador os filtros, o celular, o monitor e o leitor de PDF com o mesmo conteúdo de antes
- [ ] 5.3 Passar por props os dados de `Eventos` e `Sobre` (stack e experiências); verificar no navegador o `git log` e o alternador `package.json`
- [ ] 5.4 Atualizar `src/app/projetos/[slug]/page.tsx` para usar `getProjectBySlug` e `generateStaticParams` com os slugs publicados, com `notFound()` para rascunho ou slug inexistente; verificar abrindo um slug válido, um em rascunho (404) e um inexistente (404)
- [ ] 5.5 Garantir que nenhum componente em `src/components` importa mais de `src/content/`; verificar com uma busca por `@/content/` retornando só tipos e o seed
- [ ] 5.6 Verificar no navegador, no desktop e no celular, que a home e as páginas de projeto estão iguais às de antes da change, e que `npm run build` e `npm run lint` passam

## 6. Documentação e deploy

- [ ] 6.1 Atualizar o README: subir o banco local, migrar, rodar o seed, variáveis de ambiente e como limpar o cache; verificar seguindo o README do zero num clone limpo
- [ ] 6.2 Documentar o passo a passo no Supabase (criar o projeto em `sa-east-1`, copiar as URLs do pooler e direta, configurar na Vercel, `prisma migrate deploy`, seed com `--confirm-prod`); verificar com uma revisão do dono antes do primeiro deploy

## Workflow follow-up

- O dono revisa e aprova as specs antes de `/opsx:apply`.
- Depois de implementada e verificada, arquivar a change com `/opsx:archive` para criar `openspec/specs/portfolio-content/spec.md`.
- Próximas changes do roteiro: `add-admin-auth` → `add-admin-panel` → `add-drive-files`.
