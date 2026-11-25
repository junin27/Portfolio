import type { Evento, Experiencia } from "./types";

// EXEMPLOS: substitua pelos eventos reais.
export const eventos: Evento[] = [
  {
    slug: "startup",
    nome: "[Nome do evento de startups]",
    data: "2025-09",
    papel: "vencedor",
    descricao: "Ideia, protótipo e pitch em equipe.",
    premio: "1º lugar",
  },
  {
    slug: "workshop",
    nome: "[Nome do workshop]",
    data: "2025-05",
    papel: "palestrante",
    descricao: "Workshop ministrado sobre [tema].",
  },
  {
    slug: "evento-3",
    nome: "[Outro evento]",
    data: "2024-11",
    papel: "participante",
    descricao: "O que você fez ou aprendeu lá.",
  },
];

// Experiência real (LinkedIn, 2026-11), em linguagem de cliente.
export const experiencias: Experiencia[] = [
  {
    empresa: "Terram Agro Conhecimento · Rio Verde (GO)",
    cargo: "Estagiário de desenvolvimento: sites, aplicativos e inteligência artificial",
    inicio: "2025-08",
    entregas: [
      "Sites com formulários de cadastro e gestão que transformam informações do campo em dados para decidir",
      "Aplicativo de celular que apoia as equipes em campo, com a gestão de relatórios durante a safra",
      "Treinamento de inteligência artificial: assistente virtual (chatbot) e previsões para apoiar decisões",
    ],
  },
];
