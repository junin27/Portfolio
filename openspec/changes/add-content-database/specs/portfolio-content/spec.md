# Spec Delta

## Purpose

Define como o conteúdo do portfólio (perfil, stack, projetos, publicações, eventos e experiências) é guardado de forma persistente, validado, ordenado, filtrado por visibilidade e entregue ao site público.

## ADDED Requirements

### Requirement: Conteúdo persistido fora do código
O sistema SHALL guardar perfil, links, stack, projetos, publicações, eventos e experiências num banco de dados persistente, e o site público SHALL ler o conteúdo desse banco, não de arquivos de código.

#### Scenario: Conteúdo alterado no banco aparece sem novo deploy
- **GIVEN** um projeto publicado com o título "API de gestão"
- **WHEN** o título é alterado no banco para "API de pedidos" e o cache do conteúdo é invalidado
- **THEN** a home e a página do projeto mostram "API de pedidos" sem novo build nem deploy

### Requirement: Perfil único
O sistema SHALL manter exatamente um registro de perfil com nome, cargo, cidade, e-mail, links externos, palavras rotativas do hero, manifesto e grupos de stack.

#### Scenario: Site lê o perfil
- **WHEN** a home é renderizada
- **THEN** o nome, o cargo, as palavras rotativas, o manifesto e a stack exibidos vêm do registro de perfil

#### Scenario: Perfil ausente
- **GIVEN** um banco sem registro de perfil
- **WHEN** a home é renderizada
- **THEN** o site exibe valores neutros de reserva (nome "Portfólio", listas vazias) e não retorna erro 500

### Requirement: Slug único e estável por projeto
Cada projeto SHALL ter um slug único, em minúsculas, com letras, números e hífens, usado na URL `/projetos/<slug>`.

#### Scenario: Slug duplicado é rejeitado
- **GIVEN** um projeto com slug "api-gestao"
- **WHEN** outro projeto é gravado com o slug "api-gestao"
- **THEN** a gravação falha com erro de unicidade e nenhum dado é alterado

#### Scenario: Slug inválido é rejeitado
- **WHEN** um projeto é gravado com o slug "API Gestão!"
- **THEN** a gravação falha com erro de validação indicando o formato aceito

### Requirement: Visibilidade de rascunho e publicado
Projetos, publicações, eventos e experiências SHALL ter estado "rascunho" ou "publicado". O site público MUST exibir somente itens publicados.

#### Scenario: Rascunho não aparece no site
- **GIVEN** um projeto em rascunho com slug "projeto-secreto"
- **WHEN** um visitante abre a home ou `/projetos/projeto-secreto`
- **THEN** o projeto não aparece no índice e a URL retorna a página 404

### Requirement: Ordem de exibição controlável
Cada item SHALL ter um campo de ordem numérica. Listas do site SHALL ordenar por esse campo e, em empate, pela data ou ano mais recente.

#### Scenario: Ordem manual prevalece
- **GIVEN** dois projetos publicados, A com ordem 2 (2026) e B com ordem 1 (2024)
- **WHEN** a seção "em ação" ou a lista de projetos é renderizada
- **THEN** B aparece antes de A

### Requirement: Validação dos dados gravados
O sistema MUST validar cada registro antes de gravar: campos obrigatórios preenchidos, ano entre 1990 e o ano atual mais 1, datas no formato AAAA-MM, URLs absolutas com http ou https, e status de publicação dentro dos valores permitidos.

#### Scenario: URL inválida
- **WHEN** um projeto é gravado com o link de demonstração "meusite"
- **THEN** a gravação falha informando que o campo deve ser uma URL http(s)

#### Scenario: Status de publicação fora da lista
- **WHEN** uma publicação é gravada com status "quase pronto"
- **THEN** a gravação falha listando os valores aceitos: "em andamento", "submetido", "publicado"

### Requirement: Referências a arquivos externos
Projetos e publicações SHALL aceitar referências a arquivos externos (por exemplo, PDFs e vídeos no Google Drive) guardadas como URL. O sistema MUST NOT armazenar o conteúdo binário desses arquivos no banco.

#### Scenario: PDF de publicação no Drive
- **GIVEN** uma publicação com a URL de um PDF no Google Drive
- **WHEN** a seção de pesquisa é renderizada
- **THEN** o botão "Abrir publicação completa" aponta para essa URL

### Requirement: Site público rápido com cache invalidável
O conteúdo lido pelo site público SHALL ser servido a partir de cache, e o cache de cada tipo de conteúdo SHALL poder ser invalidado de forma independente quando aquele conteúdo muda.

#### Scenario: Invalidação seletiva
- **GIVEN** o cache de projetos e o de eventos preenchidos
- **WHEN** somente o conteúdo de eventos é invalidado
- **THEN** a próxima renderização busca eventos novamente no banco e reaproveita o cache de projetos

#### Scenario: Banco indisponível com cache preenchido
- **GIVEN** o conteúdo em cache e o banco temporariamente fora do ar
- **WHEN** um visitante abre a home
- **THEN** a página é exibida a partir do cache, sem erro

### Requirement: Migração sem mudança visível
Depois da migração inicial, o site público SHALL exibir o mesmo conteúdo, na mesma ordem e com o mesmo visual de antes da change.

#### Scenario: Seed reproduz o conteúdo atual
- **GIVEN** um banco vazio
- **WHEN** o seed inicial é executado
- **THEN** a home e as páginas `/projetos/<slug>` exibem os mesmos itens, títulos e textos de antes da change

#### Scenario: Seed é idempotente
- **GIVEN** um banco que já recebeu o seed
- **WHEN** o seed é executado de novo
- **THEN** nenhum registro é duplicado
