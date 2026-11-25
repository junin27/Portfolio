# Portfólio: "Índice"

Portfólio elegante (claro, serifado, azul bebê) com animações em **GSAP** e referências nerds espalhadas pelos detalhes. Feito em **Next.js 16 + React 19 + TypeScript + Tailwind 4**.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # confere se tudo compila antes de publicar
```

## Onde editar o conteúdo

Nada de banco de dados: todo o conteúdo fica em `src/content/`, com tipos que avisam se faltar algum campo.

| Arquivo | O que tem |
|---|---|
| `perfil.ts` | nome, e-mail, links, palavras do hero, manifesto, stack |
| `projetos.ts` | projetos (cada um vira `/projetos/<slug>`) |
| `pesquisa.ts` | TCC, artigo, IC, livro |
| `eventos.ts` | eventos e experiência profissional |

## Mapa dos efeitos

| Efeito | Arquivo |
|---|---|
| Título que sobe por linhas + palavra em itálico que troca com desfoque | `components/home/Hero.tsx` |
| Aura azul bebê respirando + grade milimetrada | `components/home/Hero.tsx`, `globals.css` |
| `$ whoami` digitando + selos "build passing" | `components/home/Hero.tsx` |
| Faixa de `import` da stack | `components/home/Marquee.tsx` |
| Índice com filtros `ls ./pesquisa` e cartão que segue o mouse | `components/home/Indice.tsx` |
| Celular passando as telas do app | `components/devices/Phone.tsx` |
| Monitor rolando o site | `components/devices/Monitor.tsx` |
| Leitor de PDF que folheia as páginas | `components/devices/PdfReader.tsx` |
| Eventos como `git log --graph` | `components/home/Eventos.tsx` |
| Manifesto que acende com a rolagem + stack em `package.json` | `components/home/Sobre.tsx` |
| Links do menu que "decodificam" | `components/fx/ScrambleText.tsx` |
| Código Konami + mensagem no console | `components/fx/EasterEggs.tsx` |
| Página 404 com `git blame` | `app/not-found.tsx` |

Para usar imagens reais: coloque os arquivos em `public/` e preencha `telas` (app), `captura` (site) ou `pdf` (pesquisa) no conteúdo.

Todos os efeitos respeitam `prefers-reduced-motion`.

## Publicar na Vercel

1. Crie um repositório no GitHub e envie este projeto (`git push`).
2. Em vercel.com → **Add New → Project**, importe o repositório. A Vercel detecta o Next.js sozinha, sem nenhuma configuração.
3. Cada `git push` na branch principal publica de novo; cada pull request ganha uma URL de preview.
