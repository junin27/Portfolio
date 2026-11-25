# Revisão de qualidade (ponytail): setup-dev-harness

Não aplicável: ponytail não instalado na máquina do dono (tarefa 7.5b pendente, conferido em 2026-11-23: nada em `~/.claude/plugins` nem em `~/.config/ponytail/`)

- O portão lê a linha acima e marca o bloco 4 como "não aplicável" com o motivo (`scripts/portao/avaliacao.ts`, teste em `avaliacao.test.ts`).
- Quando o ponytail for instalado: rodar `/ponytail-review` no diff da change, trocar a linha "Não aplicável" por "Commit revisado: <hash>" e "Pendentes: <n>" (n = "Must fix" + "Should fix" sem correção), e registrar a decisão de cada "Nice to have".
- O formato de saída do `/ponytail-review` não foi verificado (plugin ausente); confirmar ao instalar se precisa de leitura específica.
