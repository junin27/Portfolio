// Dados pessoais e textos gerais. Troque os campos marcados com [ ].

export const perfil = {
  nome: "Gilberto Junior",
  cargo: "Engenheiro de software & pesquisador",
  cidade: "Rio Verde, Goiás",
  email: "seu@email.com",
  links: {
    github: "https://github.com/junin27",
    linkedin: "https://www.linkedin.com/in/gilberto-junior-923330264/",
    lattes: "https://lattes.cnpq.br/",
  },
  /** Palavras que trocam no hero: "Eu construo ___" */
  rotativas: ["Sites", "Aplicativos", "Sistemas", "Inteligência artificial", "Mapas interativos"],
  manifesto:
    "Antes de construir, entendo o problema até ele ficar simples. Depois construo com cuidado: cada parte é testada, documentada e feita para durar. Vale para um aplicativo, para o sistema de uma empresa ou para uma pesquisa científica.",
  stack: {
    Sites: ["React", "TypeScript", "Tailwind", "shadcn/ui"],
    Aplicativos: ["Flutter", "React Native", "Kotlin"],
    "Sistemas e servidores": ["Spring Boot", "FastAPI", "Django", "Express", "NestJS"],
    "Bancos de dados": ["PostgreSQL", "PostGIS", "MySQL", "MongoDB"],
    "Inteligência artificial": ["Keras", "Regressão", "Classificação", "K-means"],
    "Como trabalho": ["Testes antes do código", "Planejamento antes de construir", "Testes automáticos", "Revisão de segurança"],
  },
} as const;
