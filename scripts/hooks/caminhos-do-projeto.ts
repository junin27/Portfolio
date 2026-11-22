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

/** Lê toda a entrada padrão (o JSON que o Claude Code manda para o hook). */
export async function lerEntradaPadrao(): Promise<string> {
  const pedacos: Buffer[] = [];
  for await (const pedaco of process.stdin) {
    pedacos.push(Buffer.isBuffer(pedaco) ? pedaco : Buffer.from(String(pedaco)));
  }
  return Buffer.concat(pedacos).toString("utf8");
}
