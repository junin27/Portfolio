import type {
  ConsultaGit,
  ExecutorDeProcessos,
  LeitorDeArquivos,
  ResultadoDeProcesso,
} from "../../scripts/portao/portas";

/** Executor que devolve respostas combinadas por comando e registra o que foi pedido. */
export class FakeExecutorDeProcessos implements ExecutorDeProcessos {
  readonly comandosExecutados: string[] = [];
  private readonly respostas = new Map<string, ResultadoDeProcesso>();

  responder(comando: readonly string[], resposta: ResultadoDeProcesso): this {
    this.respostas.set(comando.join(" "), resposta);
    return this;
  }

  executar(comando: readonly string[]): ResultadoDeProcesso {
    const chave = comando.join(" ");
    this.comandosExecutados.push(chave);
    const resposta = this.respostas.get(chave);
    if (resposta === undefined) {
      throw new Error(`FakeExecutorDeProcessos sem resposta combinada para o comando: "${chave}"`);
    }
    return resposta;
  }
}

/** Sistema de arquivos em memória: só existe o que o teste colocar. */
export class FakeLeitorDeArquivos implements LeitorDeArquivos {
  private readonly arquivos = new Map<string, string>();

  com(caminho: string, conteudo: string): this {
    this.arquivos.set(caminho, conteudo);
    return this;
  }

  ler(caminho: string): string | null {
    return this.arquivos.get(caminho) ?? null;
  }
}

/** Git com HEAD fixo e lista combinada de arquivos alterados por commit de origem. */
export class FakeConsultaGit implements ConsultaGit {
  private readonly alteracoes = new Map<string, readonly string[]>();

  constructor(private readonly head: string) {}

  comAlteracoesDesde(commit: string, arquivos: readonly string[]): this {
    this.alteracoes.set(commit, arquivos);
    return this;
  }

  commitAtual(): string {
    return this.head;
  }

  arquivosAlteradosDesde(commit: string): readonly string[] {
    if (commit === this.head) {
      return [];
    }
    const arquivos = this.alteracoes.get(commit);
    if (arquivos === undefined) {
      throw new Error(`FakeConsultaGit não conhece o commit: "${commit}"`);
    }
    return arquivos;
  }
}
