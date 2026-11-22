interface EntradaDeHookDeFerramenta {
  tool_input?: { file_path?: unknown };
}

/**
 * Extrai o caminho do arquivo editado do JSON que o Claude Code envia a um hook PostToolUse.
 * Devolve null quando a ferramenta não mexeu em arquivo (ou a entrada veio vazia).
 *
 * @example
 * lerCaminhoEditado('{"tool_input":{"file_path":"C:/p/src/a.ts"}}'); // "C:/p/src/a.ts"
 */
export function lerCaminhoEditado(entradaJson: string): string | null {
  if (entradaJson.trim() === "") {
    return null;
  }
  let entrada: EntradaDeHookDeFerramenta;
  try {
    entrada = JSON.parse(entradaJson) as EntradaDeHookDeFerramenta;
  } catch (erro) {
    throw new Error(`entrada do hook deve ser JSON com tool_input.file_path, recebeu: "${entradaJson}"`, {
      cause: erro,
    });
  }
  const caminho = entrada.tool_input?.file_path;
  return typeof caminho === "string" ? caminho : null;
}
