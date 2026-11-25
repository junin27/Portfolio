// pnpm segredos: procura segredos vazados em todo o histórico do git com o gitleaks, dentro de um
// container Docker (nada instalado na máquina). Versão fixa da imagem oficial; atualizar só por decisão.
import { execFileSync, spawnSync } from "node:child_process";
import { relative } from "node:path";
import { pathToFileURL } from "node:url";

const IMAGEM_GITLEAKS = "ghcr.io/gitleaks/gitleaks:v8.30.1";
const PASTA_NO_CONTAINER = "/repo";
const GIT_COMUM_NO_CONTAINER = "/git-comum";
const NENHUM_COMMIT_LIDO = /\b0 commits scanned\b/;
const CODIGO_DE_FALHA = 1;

interface RepositorioLocal {
  /** Raiz do checkout (principal ou worktree). */
  readonly topo: string;
  /** Pasta git deste checkout (num worktree: <comum>/worktrees/<nome>). */
  readonly gitDir: string;
  /** Pasta .git compartilhada por todos os checkouts. */
  readonly gitComum: string;
}

/**
 * Argumentos de montagem do Docker para o gitleaks ler o histórico, só para leitura.
 * Num worktree o .git é um arquivo que aponta para fora do checkout, então o .git comum também é montado.
 *
 * @example
 * montagensDoRepositorio({ topo: "C:/p", gitDir: "C:/p/.git", gitComum: "C:/p/.git" }); // ["-v", "C:/p:/repo:ro"]
 */
export function montagensDoRepositorio(repositorio: RepositorioLocal): string[] {
  const checkout = ["-v", `${repositorio.topo}:${PASTA_NO_CONTAINER}:ro`];
  if (repositorio.gitDir === repositorio.gitComum) {
    return checkout;
  }
  const gitDirNoContainer = `${GIT_COMUM_NO_CONTAINER}/${relative(repositorio.gitComum, repositorio.gitDir).replaceAll("\\", "/")}`;
  return [
    ...checkout,
    "-v",
    `${repositorio.gitComum}:${GIT_COMUM_NO_CONTAINER}:ro`,
    "-e",
    `GIT_DIR=${gitDirNoContainer}`,
    "-e",
    `GIT_WORK_TREE=${PASTA_NO_CONTAINER}`,
  ];
}

/**
 * Código de saída da verificação. O gitleaks sai com 0 mesmo quando o git falha e nada é lido,
 * então uma varredura de 0 commits conta como falha.
 *
 * @example
 * codigoDeSaidaDoGitleaks("INF 0 commits scanned.", 0); // 1
 */
export function codigoDeSaidaDoGitleaks(saida: string, codigo: number | null): number {
  if (codigo !== 0) {
    return codigo ?? CODIGO_DE_FALHA;
  }
  return NENHUM_COMMIT_LIDO.test(saida) ? CODIGO_DE_FALHA : 0;
}

function lerRepositorioLocal(): RepositorioLocal {
  const perguntar = (opcao: string): string =>
    execFileSync("git", ["rev-parse", "--path-format=absolute", opcao], { encoding: "utf8" }).trim();
  return {
    topo: perguntar("--show-toplevel"),
    gitDir: perguntar("--git-dir"),
    gitComum: perguntar("--git-common-dir"),
  };
}

function executarVarredura(): void {
  const execucao = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      ...montagensDoRepositorio(lerRepositorioLocal()),
      IMAGEM_GITLEAKS,
      "git",
      PASTA_NO_CONTAINER,
      "--redact",
      "--no-banner",
    ],
    { encoding: "utf8" },
  );
  if (execucao.error !== undefined) {
    throw new Error(
      `não consegui rodar o Docker para o gitleaks (${execucao.error.message}); o Docker Desktop está aberto?`,
      { cause: execucao.error },
    );
  }
  const saida = `${execucao.stdout}${execucao.stderr}`;
  process.stdout.write(saida);
  process.exitCode = codigoDeSaidaDoGitleaks(saida, execucao.status);
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  executarVarredura();
}
