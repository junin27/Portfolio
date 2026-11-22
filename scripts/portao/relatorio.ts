import { portaoAprovado } from "./avaliacao";
import type { ResultadoDoPortao, Situacao } from "./tipos";

const ROTULO_DA_SITUACAO: Record<Situacao, string> = {
  aprovado: "aprovado",
  reprovado: "REPROVADO",
  "nao-aplicavel": "não aplicável",
};

const LINHA_DO_RESULTADO = /\*\*Resultado: (APROVADO|REPROVADO)\*\*/;
const LINHA_DO_COMMIT = /^Commit: (\S+)$/m;

function celula(texto: string): string {
  return texto.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function tabelaDeVerificacoes(resultado: ResultadoDoPortao): string[] {
  return [
    "| Verificação | Critério | Situação | Detalhe |",
    "|---|---|---|---|",
    ...resultado.verificacoes.map(
      (item) =>
        `| ${celula(item.verificacao.nome)} | ${celula(item.verificacao.criterio)} | ${ROTULO_DA_SITUACAO[item.situacao]} | ${celula(item.detalhe)} |`,
    ),
  ];
}

function secaoDoChecklist(resultado: ResultadoDoPortao): string[] {
  if (resultado.checklistManual.length === 0) {
    return ["Nenhum item manual nesta change."];
  }
  return resultado.checklistManual.map((item) => `- [${item.marcado ? "x" : " "}] ${item.descricao}`);
}

/**
 * Monta o verificacao.md da change. A linha "**Resultado: ...**" e a linha "Commit: ..." são lidas
 * pelo hook que bloqueia o archive; não mude o formato delas sem mudar lerResumoDoRelatorio.
 */
export function gerarRelatorio(resultado: ResultadoDoPortao): string {
  const veredito = portaoAprovado(resultado) ? "APROVADO" : "REPROVADO";
  return [
    `# Verificação da change ${resultado.change}`,
    "",
    `**Resultado: ${veredito}**`,
    "",
    `Change: ${resultado.change} (número ${resultado.numeroDaChange})`,
    `Commit: ${resultado.commit}`,
    `Gerado em: ${resultado.geradoEm.toISOString()}`,
    "",
    "## Verificações",
    "",
    ...tabelaDeVerificacoes(resultado),
    "",
    "## Checklist manual",
    "",
    ...secaoDoChecklist(resultado),
    "",
  ].join("\n");
}

/** Lê de volta o veredito e o commit de um verificacao.md; null se o texto não for um relatório do portão. */
export function lerResumoDoRelatorio(conteudo: string): { aprovado: boolean; commit: string } | null {
  const veredito = LINHA_DO_RESULTADO.exec(conteudo)?.[1];
  const commit = LINHA_DO_COMMIT.exec(conteudo)?.[1];
  if (veredito === undefined || commit === undefined) {
    return null;
  }
  return { aprovado: veredito === "APROVADO", commit };
}
