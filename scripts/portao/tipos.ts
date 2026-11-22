/** Como o portão decide se uma verificação passou (docs/estrategia-de-testes.md). */
type TipoDeVerificacao =
  /** Roda um comando; aprovada quando o código de saída é 0. */
  | "automatica"
  /** Revisão feita dentro da sessão (Mantis, ponytail, SkillSpector, impeccable), lida de um relatório. */
  | "revisao-externa"
  /** Só roda no GitHub Actions (CodeQL). */
  | "somente-ci";
// O checklist manual não entra na matriz: fica em checklist-manual.md, na pasta da change.

export interface Verificacao {
  readonly id: string;
  readonly nome: string;
  readonly tipo: TipoDeVerificacao;
  readonly criterio: string;
  /** Número da change do roadmap a partir da qual a verificação vale. */
  readonly ativaDesdeAChange: number;
  /** Comando das verificações automáticas; null enquanto a verificação não está ativa. */
  readonly comando: readonly string[] | null;
  /** Arquivo do relatório (relativo à pasta da change) das revisões externas. */
  readonly arquivoDoRelatorio?: string;
}

export type Situacao = "aprovado" | "reprovado" | "nao-aplicavel";

export interface ResultadoDaVerificacao {
  readonly verificacao: Verificacao;
  readonly situacao: Situacao;
  readonly detalhe: string;
}

export interface ItemDoChecklist {
  readonly descricao: string;
  readonly marcado: boolean;
}

export interface ResultadoDoPortao {
  readonly change: string;
  readonly numeroDaChange: number;
  readonly commit: string;
  readonly geradoEm: Date;
  readonly verificacoes: readonly ResultadoDaVerificacao[];
  readonly checklistManual: readonly ItemDoChecklist[];
}
