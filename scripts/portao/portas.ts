// Portas do portão: tudo que toca processo, disco ou git entra por aqui,
// para os testes usarem fakes nomeados (tests/fakes/).

export interface ResultadoDeProcesso {
  readonly codigoDeSaida: number | null;
  readonly saida: string;
}

export interface ExecutorDeProcessos {
  executar(comando: readonly string[]): ResultadoDeProcesso;
}

export interface LeitorDeArquivos {
  /** Conteúdo do arquivo, ou null se ele não existir. */
  ler(caminho: string): string | null;
}

export interface ConsultaGit {
  /** Hash do commit atual (HEAD). */
  commitAtual(): string;
  /** Arquivos que mudaram entre o commit informado e o HEAD (caminhos relativos à raiz). */
  arquivosAlteradosDesde(commit: string): readonly string[];
}
