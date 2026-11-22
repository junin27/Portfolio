# ADR-0014: Front primeiro, com adaptador em memória no lugar do backend

- **Status:** aceita (2026-11-22)

## Contexto
O front (site público com animações e painel) é a parte com mais horas e mais ajustes. O dono quer terminar todo o front com dados de exemplo e só depois fazer o backend, para não reeditar o front a cada mudança de dados.

## Decisão
- Antes do front, a change `add-dominio-e-portas` define entidades, regras, casos de uso e portas (ADR-0013). Esses são os contratos que o front consome.
- Os dados de exemplo vivem num **adaptador em memória** que implementa as mesmas portas que o Prisma vai implementar, ligado no `src/servidor/container.ts`. Nada de array de dados dentro de componente.
- O painel é construído completo sobre o adaptador em memória e uma porta `Sessao` em memória. Em desenvolvimento, o painel fica aberto.
- Cada porta tem uma **suíte de testes de contrato** compartilhada: roda contra o adaptador em memória agora e contra o adaptador Prisma depois. Se os dois passam na mesma suíte, a troca não muda o comportamento do front.
- Nenhum deploy público antes da change de login real (`add-admin-auth`).

## Consequências
- O front fica pronto e testável sem banco, e o backend vira só troca de adaptadores no `container.ts`.
- Verificações que dependem de backend (cache e invalidação, login, Drive, migrações) ficam "não aplicáveis" no portão das changes de front, com esse motivo, e passam a valer nas changes de backend.
- Risco: o adaptador em memória esconder diferenças do banco real (ordenação, unicidade, transações). A suíte de contrato é a proteção: toda regra que o front usa vira um teste de contrato.
- O roadmap foi reordenado: front nas changes 2 a 6, backend nas 7 a 10. Números de change citados em ADRs anteriores seguem o roteiro antigo (ADRs não são editados): a change 8 do ADR-0005 (Drive) agora é a 9; os marcos do ADR-0011 ("depois da 5" e "depois da 9") agora são o marco do front (depois da 6) e o marco de lançamento (depois da 10).
