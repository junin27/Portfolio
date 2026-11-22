# ADR-0012: SkillSpector como filtro de instalação de skills e plugins

- **Status:** aceita (2026-11-22)

## Contexto
O harness usa skills e plugins de terceiros (Mantis, ponytail, untangle-codebase, OpenSpec), que carregam instruções e às vezes scripts no agente. A auditoria do ponytail foi feita à mão. O NVIDIA SkillSpector (Apache-2.0, v2.12, Alpha) faz análise estática de skills: 71 padrões em 17 categorias (injeção de prompt, exfiltração, escalada de privilégio, cadeia de suprimentos, código perigoso, envenenamento de MCP). Nunca executa a skill, gera nota de risco (0 a 20 seguro; 21 a 50 cautela; acima de 50 não instalar), saída JSON/SARIF e código de saída.

Também foi avaliado o NVIDIA SkillEvaluator, que mede se uma skill melhora o agente. Ficou de fora: serve para quem distribui skills, a avaliação principal custa API a cada execução, as notas variam e o projeto é experimental.

## Decisão
- Nenhuma skill ou plugin de terceiros é instalado ou atualizado sem: (1) SkillSpector com nota ≤ 20 e (2) leitura do código pela IA, como foi feito com o ponytail. Achados passam pelo mesmo ciclo de triagem do portão.
- Rodar com o provedor `claude_cli` (reaproveita o login do Claude Code). Quando a skill tiver algo sensível, rodar com `--no-llm`, que é só local.
- Escanear uma vez, na change 0, as skills já em uso: Mantis (`~/.agents/skills/mantis-*`), ponytail, OpenSpec e as do projeto.
- O portão escaneia a pasta `.claude/` do projeto (hooks e skills próprios) a cada change.
- SkillEvaluator: não adotado. Reavaliar só se o projeto criar skills próprias, e então só as checagens estáticas gratuitas.

## Consequências
- Mais uma ferramenta (Python 3.12/3.13 via `uv`), instalada pelo dono.
- Mesmo com `--no-llm`, o SC4 consulta o OSV.dev com nome e versão das dependências, sem código.
- Ferramenta em Alpha: complementa a leitura humana, não substitui.
- Ferramentas novas no harness só entram quando houver um problema concreto que resolvam (YAGNI).
