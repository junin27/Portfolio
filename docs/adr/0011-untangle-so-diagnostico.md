# ADR-0011: untangle-codebase só como diagnóstico em marcos do roadmap

- **Status:** aceita (2026-11-22)

## Contexto
O dono pediu para avaliar o skill `untangle-codebase` (caldoai/skills, MIT, só um `SKILL.md`, sem scripts nem hooks). Ele lista acoplamentos escondidos, acoplamentos desnecessários, código sobrando e casos especiais (ifs isolados, exceções engolidas, sleeps, testes desligados), propõe um redesenho e depois **corrige tudo sozinho até não sobrar nada**. Opcionalmente, também apaga comentários e "testes que não pegariam bug real".

A parte de correção conflita com o `CLAUDE.md`: menor mudança possível, commits de refatoração separados, nunca apagar teste para passar e plano aprovado antes de editar. Além disso, ela não tem limite de escopo.

## Decisão
- Usar só as etapas de diagnóstico: listar os problemas e propor o redesenho, **sem editar código**.
- Nunca usar as opções que apagam comentários e testes.
- Rodar nos marcos do roadmap: depois da change 5 (site público completo) e depois da change 9 (antes do lançamento), ou quando o dono pedir.
- O resultado vai para `docs/qualidade/untangle-<data>.md`. Cada problema confirmado vira uma change OpenSpec de refatoração própria, com portão, sem misturar com funcionalidade.
- Fica fora do portão de cada change: é amplo e caro demais para rodar toda vez.

## Consequências
- Um olhar periódico sobre a arquitetura inteira, que nem o Mantis (segurança) nem o `/ponytail-review` (só o diff) dão.
- Problemas apontados podem esperar até o marco; os graves aparecem antes, pelo portão.
- O skill é instalado pelo dono e só roda quando chamado (`disable-model-invocation: true`).
