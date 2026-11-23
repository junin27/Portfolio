# SkillSpector: skills e plugins de terceiros (2026-11-22)

SkillSpector v2.13.4 em Docker, análise estática (`--no-llm`), conforme ADR-0012 e ADR-0016. Relatórios JSON completos em `reports/skillspector/` (fora do git). Cada achado que pesou na nota foi conferido no texto real; as provas estão em `docs/qualidade/falsos-positivos.md`.

## Resultado

| Alvo | Versão | Nota bruta | Achados reais | Decisão |
|---|---|---|---|---|
| Mantis (`~/.agents/skills/mantis-*`) | instalada | 95 (pipeline-adapter), 30 (meta-agent), demais ≤ 9 | LP3: sem `allowed-tools` declarado | **liberado**; LP3 em riscos aceitos |
| OpenSpec (`.claude/skills/openspec-*`) | 1.16.1 | 78 (propose), 17 (explore), demais 0 | LP1: capacidade de rede não declarada | **liberado**; LP1 em riscos aceitos |
| ponytail, skills (`skills/`) | v5.3.3 | 0 em todas | nenhum | **liberado** |
| ponytail, repositório inteiro (hooks, adaptadores, benchmarks, testes) | v5.3.3 | 100 (CRÍTICO) | nenhum no que roda na instalação | **liberado com condições** (ADR-0010: `webhookUrl` vazio, `ledger` desligado, sem statusline) |

## Observações

- A nota bruta não reflete risco real aqui: o SkillSpector soma achados de padrões textuais (proibições como "NEVER run git reset --hard", fixtures de teste de injeção, scripts de benchmark, tabelas Markdown alinhadas).
- No ponytail, o código que roda ao instalar no Claude Code é só o de `hooks/claude-codex-hooks.json` (três hooks) e `hooks/band/`. Ele foi lido inteiro em 2026-11-22 (ADR-0010) e o único achado nele (OH1 em `metrics.ts:93`) é `RegExp.exec`.
- O plugin instala o repositório inteiro, incluindo `benchmarks/agentic/judge.py`, que envia uma chave de API à Anthropic **se alguém rodar o benchmark à mão**. Nada no plugin o executa. Registrado em riscos aceitos.
- A skill `find-skills` em `~/.agents/skills` (nota 15) não faz parte do harness; tem comandos `npx` sem versão fixa (RP1). Fica para o dono decidir.
