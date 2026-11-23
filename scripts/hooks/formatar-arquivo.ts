// Hook PostToolUse (Edit|Write): formata com o Prettier só o arquivo que acabou de ser editado.
// Nunca bloqueia a edição: se o Prettier falhar, o erro aparece no próximo pnpm check.
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { caminhoRelativoAoProjeto, lerEntradaPadrao, raizDoCheckoutDe } from "./caminhos-do-projeto";
import { lerCaminhoEditado } from "./entrada-do-hook";

const EXTENSOES_FORMATADAS = [".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".css", ".yml", ".yaml"];
const PASTAS_IGNORADAS = ["node_modules/", ".next/", "coverage/", "reports/", ".git/"];
const ARQUIVOS_IGNORADOS = ["pnpm-lock.yaml"];
const TEMPO_LIMITE_PRETTIER_MS = 15_000;

/**
 * Diz se o arquivo editado deve passar pelo Prettier.
 *
 * @example
 * deveFormatar("C:/p/src/a.ts", "C:/p"); // true
 */
export function deveFormatar(caminho: string, raizDoProjeto: string): boolean {
  const relativo = caminhoRelativoAoProjeto(caminho, raizDoProjeto);
  if (relativo === null) {
    return false;
  }
  if (PASTAS_IGNORADAS.some((pasta) => relativo.startsWith(pasta)) || ARQUIVOS_IGNORADOS.includes(relativo)) {
    return false;
  }
  return EXTENSOES_FORMATADAS.some((extensao) => relativo.endsWith(extensao));
}

async function executarHook(): Promise<void> {
  const caminho = lerCaminhoEditado(await lerEntradaPadrao());
  if (caminho === null) {
    return;
  }
  const raiz = raizDoCheckoutDe(dirname(caminho));
  if (!deveFormatar(caminho, raiz)) {
    return;
  }
  const prettier = join(raiz, "node_modules", "prettier", "bin", "prettier.cjs");
  spawnSync(process.execPath, [prettier, "--write", caminho], {
    cwd: raiz,
    timeout: TEMPO_LIMITE_PRETTIER_MS,
  });
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await executarHook();
}
