// Tipos de todo o conteúdo do portfólio.
// Para publicar algo novo, adicione um item no arquivo da coleção certa.
// O TypeScript avisa se faltar algum campo obrigatório.

export type CategoriaProjeto = "web" | "mobile" | "api" | "ml" | "geo";

export interface Projeto {
  slug: string; // vira a URL: /projetos/<slug>
  titulo: string;
  resumo: string;
  categoria: CategoriaProjeto;
  ano: number;
  stack: string[];
  /** Case completo: problema → solução → resultado */
  problema: string;
  solucao: string;
  resultado: string;
  repo?: string;
  demo?: string;
  /** App: imagens das telas em /public (ex.: "/projetos/app/tela1.png"). O celular da home passa por elas. */
  telas?: string[];
  /** Site: print de página inteira em /public. O monitor da home rola por ele. */
  captura?: string;
  destaque?: boolean;
}

export type TipoPublicacao = "tcc" | "artigo" | "ic" | "livro";
export type StatusPublicacao = "em andamento" | "submetido" | "publicado";

export interface Publicacao {
  slug: string;
  tipo: TipoPublicacao;
  titulo: string;
  resumo: string;
  status: StatusPublicacao;
  ano: number;
  link?: string; // DOI, ScienceDirect, repositório
  /** PDF em /public (ex.: "/pesquisa/tcc.pdf") para o botão de abrir/baixar */
  pdf?: string;
  /** Palavras-chave mostradas na página de resumo do leitor */
  palavrasChave?: string[];
  coautores?: string[];
}

export type PapelEvento = "participante" | "palestrante" | "vencedor" | "organizador";

export interface Evento {
  slug: string;
  nome: string;
  data: string; // AAAA-MM
  papel: PapelEvento;
  descricao: string;
  premio?: string;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  inicio: string; // AAAA-MM
  fim?: string; // vazio = atual
  entregas: string[];
  treinamentos?: string[];
}
