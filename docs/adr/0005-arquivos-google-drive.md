# ADR-0005: Arquivos pesados no Google Drive

- **Status:** aceita (2026-11-21)

## Contexto
PDFs de pesquisa e vídeos de demonstração são pesados para guardar no banco e caros em armazenamento pago. O dono já usa o Google Drive.

## Decisão
Arquivos pesados ficam no Google Drive. O banco guarda só a referência (ID do arquivo ou URL). Imagens leves (telas de app, capturas de site) podem ficar no próprio projeto ou num storage, decisão adiada para a change `add-drive-files`.

## Consequências
- Disponibilidade dos arquivos depende do compartilhamento no Drive estar público.
- URLs aceitas são validadas contra domínios do Google para evitar links maliciosos e SSRF.
- A integração com a API do Drive (upload pelo painel) é opcional e fica para a change 8.
