# Riscos aceitos

Problemas reais que ficam abaixo do critério do portão e foram avaliados como não exploráveis no contexto do projeto. Diferente de falso positivo: aqui o problema existe, mas o risco foi aceito com motivo. Revisar a cada change e remover quando houver correção disponível sem quebrar nada.

| Data | Origem | Problema | Onde entra | Por que o risco é aceito | Revisar quando |
|---|---|---|---|---|---|
| 2026-11-22 | `pnpm audit` (moderada) | `glob` 9 a 14.0.1: cancelamento por AbortSignal ignorado | só desenvolvimento: `@testcontainers/postgresql` → `archiver-utils` | não vai para o site publicado; só processa padrões escritos por nós nos testes | o Testcontainers atualizar o `archiver` |
| 2026-11-22 | SkillSpector (média) | LP3/LP1: skills do Mantis e do OpenSpec não declaram `allowed-tools` nem capacidade de rede | `~/.agents/skills/mantis-*`, `.claude/skills/openspec-*` | só metadados; as permissões do `.claude/settings.json` continuam decidindo o que roda | o fornecedor declarar as ferramentas |
| 2026-11-22 | SkillSpector (crítica, fora de uso) | `benchmarks/agentic/judge.py` do ponytail envia uma chave de API à Anthropic | instalado junto com o plugin (que copia o repositório inteiro) | nada no plugin executa o benchmark; só roda se alguém chamar o script à mão com a chave | a cada atualização do ponytail (repetir o scan) |
| 2026-11-22 | `pnpm audit` (moderada) | `minimatch` 7 a 11.0.0: negação de serviço com padrões muito grandes | só desenvolvimento: Testcontainers e plugins do ESLint | não vai para o site publicado; os padrões vêm da nossa configuração, nunca de usuário | o `eslint-config-next` ou o Testcontainers atualizarem |
