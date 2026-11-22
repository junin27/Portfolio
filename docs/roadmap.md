# Roteiro

Uma change OpenSpec por vez. Cada uma só começa depois que a anterior é aprovada, implementada, passa no portão de qualidade (ADR-0008) e é arquivada. O portão de cada change inclui os testes de todas as anteriores.

**Front primeiro (ADR-0014):** todo o front (site público e painel) é feito com dados de exemplo servidos por um **adaptador em memória** das portas da aplicação. O backend vem depois e só troca os adaptadores no `src/servidor/container.ts`, sem reeditar o front. Nada é publicado na Vercel antes da change 8 (login real).

| # | Change | Fase | Entrega | Verificações que passam a valer (ver `estrategia-de-testes.md`) | Estado |
|---|---|---|---|---|---|
| 0 | `setup-dev-harness` | Base | Projeto Next, harness de testes, lint, CI, hooks do Claude Code, setup, portão de qualidade, Mantis inicial, ponytail, SkillSpector | unitários, componentes, arquitetura, lint, tipos, código morto, integração, e2e (3 navegadores), smoke, build, gitleaks, audit, CodeQL, OpenSpec, Mantis, SkillSpector, ponytail-review | **em planejamento** |
| 1 | `add-dominio-e-portas` | Base | Entidades, regras, casos de uso, portas, `Resultado`, fakes e adaptador em memória com os dados de exemplo | cobertura, propriedades, mutação, idempotência | a fazer |
| 2 | `add-design-system` | Front | Tokens (azul bebê, tipografia), componentes base e utilitários de animação; instalação do impeccable e ADR de exceções de identidade (ADR-0015) | qualidade e revisão de design (impeccable), acessibilidade (axe), regressão visual, movimento reduzido, teclado, responsividade, animação | a fazer |
| 3 | `add-public-home` | Front | Hero, índice filtrável e vitrines (celular, monitor, PDF) | hidratação, Lighthouse, bundle, SEO, links, cabeçalhos de segurança; checklist manual (exploratório, leitor de tela, zoom) | a fazer |
| 4 | `add-public-sections` | Front | Pesquisa, eventos (`git log`), sobre (stack/`package.json`), contato, easter eggs | as mesmas, nas seções novas | a fazer |
| 5 | `add-project-pages` | Front | Página de cada projeto e 404 | as mesmas, nas páginas novas | a fazer |
| 6 | `add-admin-panel-ui` | Front | Painel completo: CRUD de perfil, projetos, publicações, eventos e experiências, rascunho/publicado, ordenação, usando o adaptador em memória e uma `Sessao` em memória (painel aberto só em desenvolvimento) | checklist manual de usabilidade do painel | a fazer |
| — | **Marco do front** | — | Diagnóstico com o `untangle-codebase` (ADR-0011) + revisão visual do dono. Ajustes visuais e refatorações confirmadas viram changes próprias antes do backend | — | a fazer |
| 7 | `add-persistencia-postgres` | Back | Adaptadores Prisma, migrações, seed a partir dos dados de exemplo, troca no `container.ts`, cache com `cacheTag`/`updateTag` | migração, cache e invalidação, integração dos adaptadores contra as mesmas suítes de contrato do adaptador em memória | a fazer |
| 8 | `add-admin-auth` | Back | Login do dono, sessão real, limite de tentativas, painel protegido | autenticação/autorização, limite de tentativas, CSRF e injeção, DAST (ZAP); segunda revisão de segurança | a fazer |
| 9 | `add-drive-files` | Back | Arquivos pesados no Google Drive, pré-visualização de PDF | validação de URL (SSRF), resiliência de serviço externo | a fazer |
| 10 | `add-production-deploy` | Back | Supabase, Vercel, variáveis, migração em produção, checklist de lançamento | smoke pós-deploy, restauração de backup | a fazer |
| — | **Marco de lançamento** | — | `untangle-codebase` (diagnóstico) + campanha completa do Mantis no projeto inteiro | — | a fazer |

Ajustes visuais entram como changes pequenas próprias, quando o dono pedir.
