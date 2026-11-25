// Dados pessoais e textos gerais. Troque os campos marcados com [ ].

export const perfil = {
  nome: "[Seu Nome]",
  cargo: "Engenheiro de software & pesquisador",
  cidade: "[Cidade], Brasil",
  email: "seu@email.com",
  links: {
    github: "https://github.com/seu-usuario",
    linkedin: "https://www.linkedin.com/in/seu-usuario",
    lattes: "https://lattes.cnpq.br/",
  },
  /** Palavras que trocam no hero: "Eu construo ___" */
  rotativas: ["APIs", "Apps mobile", "Redes neurais", "Plugins QGIS", "Pesquisa"],
  manifesto:
    "Escrevo o teste antes do código, a especificação antes do teste e a pergunta de pesquisa antes de tudo. Do back-end em Spring Boot ao app em Flutter, do modelo em Keras à revisão sistemática, o método é o mesmo: entender o problema até ele ficar simples.",
  stack: {
    "Front-end": ["React", "TypeScript", "Tailwind", "shadcn/ui"],
    Mobile: ["Flutter", "React Native", "Kotlin"],
    "Back-end": ["Spring Boot", "FastAPI", "Django", "Express", "NestJS"],
    Dados: ["PostgreSQL", "PostGIS", "MySQL", "MongoDB"],
    "Machine learning": ["Keras", "Regressão", "Classificação", "K-means"],
    Práticas: ["TDD (F.I.R.S.T)", "SDD com OpenSpec", "Testes de API automatizados", "Revisão de segurança"],
  },
} as const;
