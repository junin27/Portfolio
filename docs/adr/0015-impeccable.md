# ADR-0015: impeccable como detector e revisor de design do front

- **Status:** aceita (2026-11-22)

## Contexto
O front é o produto deste portfólio, e a primeira versão foi reprovada pelo dono no visual. O impeccable (pbakaus/impeccable, Apache-2.0, v4.10.0, motor 0.1.27) traz uma skill de design com 24 comandos (`audit`, `critique`, `polish`, `typeset`, `layout`, `animate`, `overdrive`...), um detector determinístico de 62 regras (sem IA, saída SARIF) e hooks que só avisam, sem bloquear nem editar.

Riscos encontrados na leitura do repositório:
- Telemetria ligada por padrão (direções visuais mostradas e escolhidas, enviadas ao impeccable.style); o catálogo de direções é baixado mesmo com ela desligada.
- O botão "Apply" do modo live pode rodar o `claude` com `--permission-mode bypassPermissions`.
- O motor é um binário baixado das releases do GitHub na primeira execução (com SHA-256 conferido) e roda sem isolamento.
- Os hooks usam sintaxe POSIX; no Windows precisam do Git Bash (não verificado).

Conflitos com a identidade aprovada (estilo "Índice" com referências nerds): proibições absolutas do impeccable contra rótulo acima do título ("eyebrow"), numeração de seção 01/02/03, fonte mono como "fantasia de técnico" e fundo quadriculado. Esses elementos são escolhas de identidade do projeto.

## Decisão
- Adotar a partir da change 2 (`add-design-system`), não antes.
- Instalação: passar pelo SkillSpector + leitura do código (ADR-0012); `npx impeccable install` com escopo de projeto e versão fixa.
- Telemetria desligada (`DO_NOT_TRACK=1` e `"telemetry": false` em `.impeccable/config.json`).
- Modo live proibido (`IMPECCABLE_LIVE_COPY_AGENT=off`); nada de "Apply".
- O detector (`npx impeccable detect --sarif`) vira bloco do portão ("qualidade de design") a partir da change 2, com a mesma triagem dos outros blocos.
- `critique` e `audit` rodam como revisão de design em cada change de front; os demais comandos só a pedido do dono, dentro de uma change com spec.
- Hook por edição ligado se funcionar no Windows; senão, só o detector no portão.
- As regras que conflitam com a identidade (eyebrow, numeração, mono, grade) são desligadas no próprio impeccable por um ADR de identidade escrito na change 2, que lista cada uma e o porquê. Não são registradas como falso positivo.

## Consequências
- Lint de design determinístico, coisa que nenhum outro bloco do portão faz.
- Sobreposição parcial com axe/Lighthouse (`audit`) e com o `/ponytail-review`; em conflito, valem o portão e o `CLAUDE.md`.
- Mais um binário de terceiros rodando na máquina; atualizações só depois de repetir a auditoria.
