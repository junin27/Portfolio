import type { Publicacao } from "./types";

// EXEMPLOS: substitua pelos títulos e links reais.
export const publicacoes: Publicacao[] = [
  {
    slug: "tcc",
    tipo: "tcc",
    titulo: "Revisão sistemática da literatura",
    resumo: "Monografia de conclusão de curso em Engenharia de Software: protocolo, busca, seleção e síntese dos estudos.",
    status: "em andamento",
    ano: 2026,
  },
  {
    slug: "artigo",
    tipo: "artigo",
    titulo: "Artigo científico",
    resumo: "Artigo derivado da pesquisa, em preparação para submissão a periódico indexado.",
    status: "em andamento",
    ano: 2026,
  },
  {
    slug: "ic",
    tipo: "ic",
    titulo: "Iniciação científica",
    resumo: "Projeto de iniciação científica desenvolvido na graduação.",
    status: "publicado",
    ano: 2025,
  },
  {
    slug: "livro",
    tipo: "livro",
    titulo: "Livro em escrita",
    resumo: "Um livro em andamento. Capítulos aparecem aqui conforme ficam prontos.",
    status: "em andamento",
    ano: 2026,
  },
];

export const rotuloTipo: Record<Publicacao["tipo"], string> = {
  tcc: "TCC",
  artigo: "Artigo",
  ic: "Iniciação científica",
  livro: "Livro",
};
