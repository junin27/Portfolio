// Hook PostToolUse (Edit|Write): roda os testes unitários e de componente relacionados ao arquivo
// editado e devolve um resumo ao agente. Não bloqueia: no TDD o vermelho logo após escrever o
// teste é esperado. Autorizado pelo dono a rodar sem pedir permissão (CLAUDE.md do projeto).
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { caminhoRelativoAoProjeto, lerEntradaPadrao, raizDoCheckoutDe } from "./caminhos-do-projeto";
import { lerCaminhoEditado } from "./entrada-do-hook";

const PASTAS_TESTADAS = ["src/", "tests/", "scripts/"];
const PASTAS_FORA_DO_HOOK = ["tests/integracao/", "tests/e2e/"];
const EXTENSOES_TESTADAS = [".ts", ".tsx"];
const TEMPO_LIMITE_SEGUNDOS = 60;
const MILISSEGUNDOS_POR_SEGUNDO = 1000;

interface ResultadoDosTestes {
  saida: string;
  codigoDeSaida: number | null;
  estourouTempo: boolean;
}

/**
 * Diz se a edição deste arquivo deve disparar os testes relacionados.
 *
 * @example
 * deveTestar("C:/p/src/dominio/projeto.ts", "C:/p"); // true
 */
export function deveTestar(caminho: string, raizDoProjeto: string): boolean {
  const relativo = caminhoRelativoAoProjeto(caminho, raizDoProjeto);
  if (relativo === null) {
    return false;
  }
  const naPastaCerta = PASTAS_TESTADAS.some((pasta) => relativo.startsWith(pasta));
  const foraDoHook = PASTAS_FORA_DO_HOOK.some((pasta) => relativo.startsWith(pasta));
  return naPastaCerta && !foraDoHook && EXTENSOES_TESTADAS.some((extensao) => relativo.endsWith(extensao));
}

function linhaQueContem(saida: string, trecho: string): string | undefined {
  return saida
    .split("\n")
    .map((linha) => linha.trim())
    .find((linha) => linha.includes(trecho));
}

/**
 * Resume a saída do Vitest em uma linha para o agente ler.
 *
 * @example
 * resumirResultado({ saida: "Tests  5 passed (5)", codigoDeSaida: 0, estourouTempo: false });
 * // "Testes relacionados: verdes. Tests  5 passed (5)"
 */
export function resumirResultado({ saida, codigoDeSaida, estourouTempo }: ResultadoDosTestes): string {
  if (estourouTempo) {
    return `Testes relacionados: tempo limite de ${TEMPO_LIMITE_SEGUNDOS} s estourado; rode pnpm test para ver o resultado.`;
  }
  // "No test files found" até o Vitest 4; "No affected test files found" no `vitest related` do 5.
  if (saida.includes("No test files found") || saida.includes("No affected test files found")) {
    return "Testes relacionados: nenhum teste cobre este arquivo ainda.";
  }
  const contagem = linhaQueContem(saida, "Tests ") ?? "sem contagem";
  if (codigoDeSaida === 0) {
    return `Testes relacionados: verdes. ${contagem}`;
  }
  const primeiraFalha = linhaQueContem(saida, "FAIL") ?? "veja pnpm test";
  return `Testes relacionados: VERMELHOS. ${contagem}. Primeira falha: ${primeiraFalha}`;
}

function rodarTestesRelacionados(raiz: string, relativo: string): ResultadoDosTestes {
  const vitest = join(raiz, "node_modules", "vitest", "vitest.mjs");
  const argumentos = [vitest, "related", "--run", "--project", "unit", "--project", "componentes", relativo];
  const execucao = spawnSync(process.execPath, argumentos, {
    cwd: raiz,
    encoding: "utf8",
    timeout: TEMPO_LIMITE_SEGUNDOS * MILISSEGUNDOS_POR_SEGUNDO,
    env: { ...process.env, NO_COLOR: "1" },
  });
  const estourouTempo = execucao.error !== undefined && execucao.signal === "SIGTERM";
  return { saida: `${execucao.stdout}\n${execucao.stderr}`, codigoDeSaida: execucao.status, estourouTempo };
}

async function executarHook(): Promise<void> {
  const caminho = lerCaminhoEditado(await lerEntradaPadrao());
  if (caminho === null) {
    return;
  }
  const raiz = raizDoCheckoutDe(dirname(caminho));
  if (!deveTestar(caminho, raiz)) {
    return;
  }
  const relativo = caminhoRelativoAoProjeto(caminho, raiz) ?? caminho;
  // Worktree novo não herda o node_modules: avisar em vez de falhar em silêncio.
  const resumo = existsSync(join(raiz, "node_modules", "vitest"))
    ? resumirResultado(rodarTestesRelacionados(raiz, relativo))
    : `Testes relacionados: não rodaram, falta node_modules em ${raiz}; rode pnpm install nesse checkout.`;
  const saidaDoHook = { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: resumo } };
  process.stdout.write(JSON.stringify(saidaDoHook));
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await executarHook();
}
