// Ficha de personagem (RPG) da home. EXEMPLOS: ajuste atributos e valores (0 a 100) ao seu perfil real.

export const ficha = {
  classe: "Engenheiro de software",
  subclasse: "Pesquisador",
  // "Guilda" = formação (termo de RPG que qualquer pessoa entende pelo contexto).
  guilda: "Engenharia de Software · Universidade de Rio Verde (UNIRV) · 2023–2026",
  nivel: 24,
  xpAtual: 7800,
  xpProximoNivel: 10000,
  atributos: [
    { nome: "Força", area: "Sistemas e servidores", valor: 88 },
    { nome: "Destreza", area: "Aplicativos de celular", valor: 76 },
    { nome: "Inteligência", area: "Inteligência artificial", valor: 72 },
    { nome: "Sabedoria", area: "Pesquisa científica", valor: 84 },
    { nome: "Constituição", area: "Qualidade e segurança", valor: 94 },
    { nome: "Carisma", area: "Palestras e eventos", valor: 64 },
  ],
} as const;
