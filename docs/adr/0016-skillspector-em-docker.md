# ADR-0016: SkillSpector em Docker, só análise estática

- **Status:** aceita (2026-11-22); complementa o ADR-0012

## Contexto
O ADR-0012 previa instalar o SkillSpector com `uv tool install` e usar o provedor `claude_cli` para a análise com IA. Na máquina do dono, a instalação pelo `uv` falhou três vezes com "arquivo em uso por outro processo" ao remover pastas temporárias (provável antivírus; não confirmado) e deixou uma instalação incompleta em `AppData\Roaming\uv\tools\skillspector`.

## Decisão
- Rodar o SkillSpector numa imagem Docker construída a partir da tag fixa: `docker build -t skillspector:2.13.4 https://github.com/NVIDIA/skillspector.git#v2.13.4`. O Dockerfile foi lido antes (base `python:3.12-slim` fixada por hash, instala só o pacote, `git` e certificados).
- `pnpm skillspector <pasta> [relatorio.json]` monta a pasta só para leitura e roda `--no-llm --recursive`.
- Sem análise por IA: dentro do container não há login do Claude Code. A análise estática é a opção que o ADR-0012 já previa para conteúdo sensível.
- O critério "nota ≤ 20" vale **depois da triagem**: a nota bruta soma padrões textuais que, nos alvos de hoje, eram falsos positivos documentados. Uma skill só é liberada com cada achado alto ou crítico triado com prova.

## Consequências
- Igual no Windows e no CI, sem instalar Python na máquina.
- Cobertura menor que com a IA ligada; compensada pela leitura do código exigida pelo ADR-0012.
- A pasta incompleta do `uv` fica para o dono apagar quando o bloqueio passar.
