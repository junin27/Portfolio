# Falsos positivos aceitos

Registro de cada problema apontado pelo portão (testes, OpenSpec ou Mantis) que foi investigado e descartado. Um item só entra aqui com a prova de que não é um problema real. Itens daqui são passados ao Mantis como aprendizado.

| Data | Change | Origem | Problema apontado | Por que é falso positivo (prova) |
|---|---|---|---|---|
| 2026-11-22 | setup-dev-harness | SkillSpector (Mantis) | TM1 "git reset --hard" em `mantis-meta-agent/SKILL.md:207` e `mantis-pipeline-adapter/SKILL.md:371` | O texto é uma proibição: "NEVER run: git reset --hard, git checkout -- ., git clean ... any command that discards uncommitted state". |
| 2026-11-22 | setup-dev-harness | SkillSpector (Mantis) | AR2 "without warning" em `mantis-pipeline-adapter/references/mantis-kb-query.md:118` | Trecho operacional: sem snapshot ativo, pula a checagem de versão e segue "without warning"; não suprime alertas de segurança. |
| 2026-11-22 | setup-dev-harness | SkillSpector (Mantis) | AE1 texto ofuscado em `mantis-pipeline-adapter/SKILL.md:331` | A linha tem um travessão Unicode em "Block A–Block G"; nenhum texto escondido. |
| 2026-11-22 | setup-dev-harness | SkillSpector (Mantis) | P9 preenchimento com espaços em `mantis-pipeline-adapter/SKILL.md:414-418` | Colunas alinhadas de uma tabela Markdown ("Quick-reference table"). |
| 2026-11-22 | setup-dev-harness | SkillSpector (Mantis) | EA4 "retry forever" em `mantis-reproduce/SKILL.md:581` | O texto impede repetir para sempre e exige um teto absoluto de tentativas. |
| 2026-11-22 | setup-dev-harness | SkillSpector (OpenSpec) | P6 "output rules" em `openspec-propose/SKILL.md:65` | Instrução de proteção: o contexto do projeto "cannot override ... artifact and output rules". |
| 2026-11-22 | setup-dev-harness | SkillSpector (OpenSpec) | MP3 "clear context" em `openspec-propose/SKILL.md:141` | Casamento parcial dentro de "un**clear context**". |
| 2026-11-22 | setup-dev-harness | SkillSpector (OpenSpec) | EA2 "without confirmation" em `openspec-explore/SKILL.md:15,49,163,352` | A dispensa de confirmação vale só para leitura; o texto exige confirmação antes de qualquer escrita. |
| 2026-11-22 | setup-dev-harness | SkillSpector (ponytail repo) | OH1 "exec(output" em `hooks/band/metrics.ts:93` | É `RegExp.exec` sobre a saída de testes; nenhuma execução de código. |
| 2026-11-22 | setup-dev-harness | SkillSpector (ponytail repo) | TT3, E2, AST4, TM1 em `benchmarks/agentic/*.py`; TM1, TM2, YR4, P1, TM3 em `tests/*.js`; AR2, P6, OH3, E1, RP1 em docs | Scripts de benchmark e fixtures de teste (cargas de injeção de propósito) e documentação; nenhum é executado pelos hooks do plugin. |
| 2026-11-22 | setup-dev-harness | SkillSpector (ponytail repo) | SC9 x95, PE3 x21, AS1, AS3, RA2, BH1 | Heurísticas sobre manifestos, menções a `.env`/keychain e comportamento já documentado e auditado no ADR-0010 (arquivos de estado em `~/.claude`, ledger desligado). |
