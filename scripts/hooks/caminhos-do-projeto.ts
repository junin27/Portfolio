import { execFileSync } from "node:child_process";

/** Troca barras invertidas do Windows por "/" para comparar caminhos do mesmo jeito em qualquer sistema. */
function normalizarCaminho(caminho: string): string {
  return caminho.replaceAll("\\", "/");
}

/**
 * Caminho relativo à raiz do projeto, ou null se o arquivo estiver fora dela.
 *
 * @example
 * caminhoRelativoAoProjeto("C:/p/src/a.ts", "C:/p"); // "src/a.ts"
 */
export function caminhoRelativoAoProjeto(caminho: string, raizDoProjeto: string): string | null {
  const arquivo = normalizarCaminho(caminho);
  const raiz = normalizarCaminho(raizDoProjeto).replace(/\/$/, "");
  if (!arquivo.toLowerCase().startsWith(`${raiz.toLowerCase()}/`)) {
    return null;
  }
  return arquivo.slice(raiz.length + 1);
}

/** Raiz do projeto: a que o Claude Code informa ao hook, ou a pasta atual. */
export function raizDoProjetoAtual(): string {
  return process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
}

/** Consulta ao git sobre a pasta; os dois métodos devolvem null fora de um repositório. */
export interface ConsultaDeRepositorio {
  /** Raiz do checkout (principal ou worktree) que contém a pasta. */
  topo(pasta: string): string | null;
  /** Pasta .git compartilhada pelo checkout principal e por todos os seus worktrees. */
  gitComum(pasta: string): string | null;
}

function mesmoCaminho(a: string, b: string): boolean {
  return normalizarCaminho(a).toLowerCase() === normalizarCaminho(b).toLowerCase();
}

/**
 * Raiz do checkout que contém a pasta, se for o mesmo repositório da raiz padrão; senão a raiz padrão.
 * Existe porque o app desktop do Claude Code passa o checkout principal em CLAUDE_PROJECT_DIR mesmo
 * quando a sessão roda num worktree, e aí os hooks ignoravam toda edição feita no worktree.
 *
 * @example
 * raizDoProjetoPara("C:/p/.claude/worktrees/s1/src", "C:/p", repositorio); // "C:/p/.claude/worktrees/s1"
 */
export function raizDoProjetoPara(
  pasta: string,
  raizPadrao: string,
  repositorio: ConsultaDeRepositorio,
): string {
  const topo = repositorio.topo(pasta);
  const gitComumDoTopo = topo === null ? null : repositorio.gitComum(topo);
  const gitComumPadrao = repositorio.gitComum(raizPadrao);
  if (topo === null || gitComumDoTopo === null || gitComumPadrao === null) {
    return raizPadrao;
  }
  return mesmoCaminho(gitComumDoTopo, gitComumPadrao) ? topo : raizPadrao;
}

function perguntarAoGit(pasta: string, argumentos: readonly string[]): string | null {
  try {
    return execFileSync("git", ["rev-parse", "--path-format=absolute", ...argumentos], {
      cwd: pasta,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    // Fora de um repositório (ou pasta inexistente) o git sai com erro: é o caso "null" do contrato.
    return null;
  }
}

const repositorioGit: ConsultaDeRepositorio = {
  topo: (pasta) => perguntarAoGit(pasta, ["--show-toplevel"]),
  gitComum: (pasta) => perguntarAoGit(pasta, ["--git-common-dir"]),
};

/** Raiz do checkout (worktree incluído) que contém a pasta, usando o git real. */
export function raizDoCheckoutDe(pasta: string): string {
  return raizDoProjetoPara(pasta, raizDoProjetoAtual(), repositorioGit);
}

/** Lê toda a entrada padrão (o JSON que o Claude Code manda para o hook). */
export async function lerEntradaPadrao(): Promise<string> {
  const pedacos: Buffer[] = [];
  for await (const pedaco of process.stdin) {
    pedacos.push(Buffer.isBuffer(pedaco) ? pedaco : Buffer.from(String(pedaco)));
  }
  return Buffer.concat(pedacos).toString("utf8");
}
