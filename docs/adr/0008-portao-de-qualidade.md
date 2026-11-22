# ADR-0008: Portão de qualidade obrigatório para concluir uma change

- **Status:** aceita (2026-11-22)

## Contexto
O dono quer que uma change só seja considerada pronta quando todos os testes aplicáveis, a validação do OpenSpec e a revisão de segurança do Mantis não retornarem mais nenhum problema. Qualquer problema deve ser confirmado ou descartado com evidência, e os confirmados devem ser corrigidos e o portão rodado de novo até zerar.

## Decisão
- Um script único (`pnpm portao`) roda a matriz de `docs/estrategia-de-testes.md`, o `openspec validate --strict` e o Mantis, e gera `verificacao.md` na change.
- O archive da change é bloqueado por hook enquanto o relatório não estiver 100% verde.
- Verificações com nota (cobertura, mutação, Lighthouse) usam limites fixos: passar o limite conta como aprovado.
- Problemas passam pelo ciclo de triagem → teste de regressão → correção → portão inteiro de novo, com parada obrigatória para o dono nas situações listadas na estratégia.
- A correção automática do Mantis não é usada: toda correção vira teste.

## Consequências
- Cada change fica mais lenta para fechar (10 a 20 minutos de portão, mais o Mantis e as correções).
- Os resultados do Mantis não são determinísticos: "zero" significa nenhum achado confirmado pendente, com os falsos positivos registrados e justificados.
- Os limites só mudam com um novo ADR.
- Rodar o portão executa comandos que não são só testes (build, Lighthouse, ZAP, Mantis). O dono deu autorização permanente para a IA rodar o portão, os testes e o Mantis sem pedir a cada vez, para o ciclo de correção andar sozinho. Os demais comandos continuam com o dono.
