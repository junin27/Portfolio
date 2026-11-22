# ADR-0010: Ponytail como modo de minimalismo e revisão extra do portão

- **Status:** aceita (2026-11-22)

## Contexto
O dono pediu para avaliar o plugin ponytail (DietrichGebert/ponytail, MIT, v5.3.3). Ele injeta regras de "menor mudança que resolve" (YAGNI) e oferece `/ponytail-review`, um revisor de diff para bugs, segurança, carga, testes faltando e código desnecessário. Não tem specs, ADRs nem bloqueio por teste.

Auditoria do código em 2026-11-22 (hooks, manifesto, `hooks/band/*`):
- Sem dependências, sem scripts de instalação, sem `eval`, sem código ofuscado, sem download em tempo de execução.
- Hooks só em `SessionStart`, `SubagentStart` e `UserPromptSubmit`; só injetam contexto e nunca bloqueiam ferramentas.
- Única saída de rede: webhook opcional (`webhookUrl`, vazio por padrão), só HTTPS.
- Pontos de atenção: o registro local ("band ledger") vem ligado e grava em `~/.config/ponytail/band/*.csv` a primeira linha do primeiro prompt de cada sessão; na abertura da sessão, ele lê nomes de funções do projeto (até 4000 arquivos) e injeta no contexto; e sugere instalar uma statusline que roda PowerShell com `-ExecutionPolicy Bypass`.
- Não verificados: final do `logo.ts` (dados SVG) e o adaptador do SDK.

## Decisão
- Usar o ponytail no modo `lite` (constrói o que foi pedido e só aponta a alternativa menor). O modo `ultra` fica desligado, porque contesta partes do pedido e atrapalha o fluxo de specs.
- Configuração: `webhookUrl` vazio, registro local (`ledger`) **desligado** e sugestão de statusline **recusada**.
- `/ponytail-review` vira o bloco 4 do portão (ver `docs/estrategia-de-testes.md`).
- Em conflito, vale o `CLAUDE.md`: TDD e portão, não "um teste pequeno"; nada de comentários `shortcut:`, mas `TODO(issue #N)` como manda a regra do dono.
- Atualizações do plugin só depois de ler as notas da versão nova e repetir esta auditoria nos arquivos alterados.

## Consequências
- Mais um revisor no portão, focado em excesso de código e testes faltando, complementando o Mantis (segurança).
- As regras do ponytail também entram nos subagentes, inclusive nos do Mantis. Como a regra dele nunca corta segurança, isso é aceito. Se o Mantis piorar, restringir com `PONYTAIL_SUBAGENT_MATCHER`.
- O plugin é instalado a partir do repositório, então uma versão nova pode mudar o comportamento; daí a regra de auditar antes de atualizar.
