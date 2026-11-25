# Prompt para o Codex: redesenhar o rascunho do portfólio

Você vai trabalhar na pasta deste projeto (`site/`), que é um **rascunho visual** do meu portfólio pessoal. Leia este documento inteiro antes de mexer em qualquer arquivo.

## Quem sou eu e para que serve o site

- **Gilberto Junior**, estudante de Engenharia de Software na Universidade de Rio Verde (UNIRV, 2023–2026), em Rio Verde, Goiás.
- Estagiário de desenvolvimento na Terram Agro Conhecimento desde agosto de 2025: sites com formulários de cadastro e gestão (React), aplicativo de celular para equipes em campo na safra (React Native) e treinamento de inteligência artificial (chatbot e previsões, Python + FastAPI).
- Também faço pesquisa científica: TCC (revisão sistemática), artigo, iniciação científica e um livro em andamento.
- Tecnologias que uso: React, Next.js, Tailwind, React Native, Flutter, FastAPI, Django, Spring Boot, Express, PostgreSQL, MySQL, machine learning.
- Links: GitHub https://github.com/junin27 · LinkedIn https://www.linkedin.com/in/gilberto-junior-923330264/
- Projetos do GitHub que um leigo entende (bons para a vitrine):
  - **Flappy Head**: jogo no estilo Flappy Bird controlado pelo movimento do rosto (visão computacional).
  - **Quest-AI / Quiz com IA**: quizzes interativos gerados por inteligência artificial (demo: https://continuacao-quiz-llm.vercel.app).
  - **Sistema Administrativo Financeiro**: sistema financeiro que lê PDFs automaticamente com IA (demo: https://sistema-administrativo-financeiro.vercel.app).
  - **Automação para criadores de vídeo** (micro-SaaS que organiza a produção de vídeos).
  - Comparativos publicados: Big Data em nuvem (GCP, Azure, AWS) e LangChain vs. Agno.

**Objetivo do site: conseguir um emprego novo e clientes de freelance.** Quem vai visitar:
- **Clientes de freelance** que não entendem nada de programação e só querem o serviço. Para eles o texto precisa ser 100% compreensível.
- **Recrutadores**, que olham rápido e muitas vezes pelo celular.
- Pessoas da área, que vão reconhecer as referências.

## A ideia visual (o que eu pedi até agora)

- **Base:** claro, elegante, títulos com serifa (Newsreader), **azul bebê** como cor principal, com azul-marinho e um tom noturno para contraste.
- **Movimento forte e cinematográfico:** rolagem que conta uma história, seções que ficam presas na tela e animam, um momento "uau". Não quero um site comum.
- **Referências nerds de jogos, RPG, fliperama e PC antigo** (não de código): ficha de personagem, nível, XP, "PRESS START", conquistas desbloqueadas, "GAME OVER" no 404, pixel art nos detalhes. Elas são **decoração reconhecível**: quem não é da área precisa entender tudo, e quem é da área deve pensar "que legal, tem coisa de jogo". O site inteiro não pode virar um jogo.
- **Elementos no azul para chamar a atenção e entreter:** raios e trovões, neon, fumaça e névoa, brilho. Hoje existe uma tentativa disso (cena de "noite azul" no hero e ficha em neon), mas ficou fraca.
- **Textos em linguagem de cliente.** Nada de jargão como "pull request", "import react", "$ ls", "package.json" ou "back-end" no texto principal. Exemplo do que não pode: "Respondo rápido, sem precisar de pull request" (um cliente não sabe o que é isso). Termos técnicos só como etiqueta secundária, para recrutadores.

## Situação atual: eu ainda não gostei

O rascunho passou por algumas rodadas e **eu ainda não gostei do resultado: achei simples demais e feio.** Falta acabamento visual de site premiado, falta impacto e falta o "entretenimento" que eu pedi. Os efeitos de raio, neon e fumaça ficaram tímidos. Você tem liberdade para **redesenhar de verdade**: mudar composição, tipografia de apoio, espaçamento, componentes, a ordem das seções e o vocabulário de animação. Não fique preso ao que existe, só às regras abaixo. Mire em sites como os de awwwards.com, com um conceito de movimento claro e poucos efeitos muito bem feitos, e não em "fade-up em tudo".

Mantenha como âncoras da identidade: azul bebê, a minha foto (`public/foto.png`, fundo escuro com brilho azul), os dados reais acima e o tema de jogo/RPG como decoração.

## Regras obrigatórias

1. **Não pode travar em nenhum PC ou celular.** Se travar no aparelho de um recrutador, pega mal.
   - Anime só `transform` e `opacity`. **Nunca anime `filter: blur()`** nem sombras grandes; brilho e névoa devem ser gradientes radiais ou imagens leves.
   - Pause o que estiver fora da tela (ScrollTrigger, IntersectionObserver).
   - Nada de tela vazia esperando animação: o conteúdo principal aparece em menos de 1 segundo.
   - No celular, não prenda (pin) seções mais altas que a tela.
   - Se usar canvas, WebGL ou partículas, limite a resolução e a quantidade, pause fora da tela e tenha uma alternativa leve para celular.
   - Respeite `prefers-reduced-motion`: com ele ligado, o site fica estático e completo.
2. **Bom no celular** (a maior parte das visitas): toque confortável, sem rolagem horizontal, textos legíveis, nada cortado.
3. **Acessível:** contraste legível, navegação por teclado com foco visível, HTML semântico, `alt` nas imagens, conteúdo decorativo com `aria-hidden`.
4. **Texto em português do Brasil, em linguagem de cliente**, como explicado acima.
5. **Dependências:** prefira o que já está instalado (GSAP 3.15 com todos os plugins gratuitos, `@gsap/react`, Tailwind 4, `next/font`). Se for adicionar algo (por exemplo Lenis ou uma lib 3D), justifique o motivo, o peso e o impacto no celular antes.
6. **Sem imagens da internet** (hotlink). Use SVG, CSS, a minha foto ou arquivos novos em `public/`.
7. **Não apague nem altere** a pasta `_backup-antes-new-game-plus-2026-11-23/`.
8. **Git:** não rode `git reset`, `git checkout`, `git restore`, `git clean`, `git push` nem nada que descarte histórico. O ponto de restauração é a tag `antes-do-codex`.
9. Não coloque segredos, chaves ou e-mail pessoal no código. O e-mail de contato fica como está (`seu@email.com`) até eu definir.

## Como o projeto está montado

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + GSAP 3.15. Rode com `npm install` e `npm run dev` (http://localhost:3000).
- Next.js 16 tem APIs novas: confira a documentação em `node_modules/next/dist/docs/` antes de usar recursos do framework.
- Conteúdo em `src/content/` (`perfil.ts`, `ficha.ts`, `projetos.ts`, `pesquisa.ts`, `eventos.ts`, `indice.ts`).
- Seções da home em `src/components/home/` (Hero, FichaDePersonagem, Marquee, Indice, EmAcao, Pesquisa, Eventos, Sobre, Contato).
- Efeitos em `src/components/fx/` (Raio, SplitReveal, ScrambleText, Magnetic, ScrollProgress, EasterEggs) e vitrines em `src/components/devices/` (celular, monitor, leitor de PDF).
- GSAP registrado num ponto único: `src/lib/gsap.ts`. Tokens de cor e fontes em `src/app/globals.css` e `src/app/layout.tsx`.

**Este rascunho é descartável:** quando eu aprovar o visual, ele será refeito no projeto definitivo, com testes e Clean Architecture. Então **foque no visual, na experiência e no desempenho**, não na arquitetura. Código legível e comentado em português basta.

## O que entregar

1. O site rodando com o novo visual.
2. Um resumo do conceito visual e de movimento que você escolheu (uma frase de conceito e os momentos principais).
3. A lista de arquivos alterados e criados.
4. Um catálogo dos efeitos: efeito, onde aparece e como foi feito.
5. Como você verificou o desempenho (o que mediu e em que condições) e o que não conseguiu verificar.
6. O que ficou de fora e por quê.
