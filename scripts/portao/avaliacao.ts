import { lerRevisaoExterna } from "./leitura-de-relatorios";
import type { ConsultaGit, ExecutorDeProcessos, LeitorDeArquivos } from "./portas";
import type { ResultadoDaVerificacao, ResultadoDoPortao, Verificacao } from "./tipos";

export interface ContextoDaAvaliacao {
  readonly numeroDaChange: number;
  readonly pastaDaChange: string;
  readonly executor: ExecutorDeProcessos;
  readonly leitor: LeitorDeArquivos;
  readonly git: ConsultaGit;
}

const LINHAS_DE_SAIDA_NO_DETALHE = 5;

function resultado(
  verificacao: Verificacao,
  situacao: ResultadoDaVerificacao["situacao"],
  detalhe: string,
): ResultadoDaVerificacao {
  return { verificacao, situacao, detalhe };
}

function fimDaSaida(saida: string): string {
  const linhas = saida
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha !== "");
  return linhas.slice(-LINHAS_DE_SAIDA_NO_DETALHE).join(" / ");
}

function avaliarAutomatica(verificacao: Verificacao, contexto: ContextoDaAvaliacao): ResultadoDaVerificacao {
  if (verificacao.comando === null) {
    return resultado(verificacao, "reprovado", "verificação ativa sem comando definido na matriz");
  }
  const execucao = contexto.executor.executar(verificacao.comando);
  if (execucao.codigoDeSaida === 0) {
    return resultado(verificacao, "aprovado", "ok");
  }
  return resultado(
    verificacao,
    "reprovado",
    `código ${execucao.codigoDeSaida ?? "?"}: ${fimDaSaida(execucao.saida)}`,
  );
}

function mudancasForaDaChange(commitRevisado: string, contexto: ContextoDaAvaliacao): readonly string[] {
  if (commitRevisado === contexto.git.commitAtual()) {
    return [];
  }
  return contexto.git
    .arquivosAlteradosDesde(commitRevisado)
    .filter((arquivo) => !arquivo.startsWith(`${contexto.pastaDaChange}/`));
}

function avaliarRevisaoExterna(
  verificacao: Verificacao,
  contexto: ContextoDaAvaliacao,
): ResultadoDaVerificacao {
  const caminho = `${contexto.pastaDaChange}/${verificacao.arquivoDoRelatorio ?? ""}`;
  const conteudo = contexto.leitor.ler(caminho);
  if (conteudo === null) {
    return resultado(verificacao, "reprovado", `relatório não encontrado: ${caminho}`);
  }
  const revisao = lerRevisaoExterna(conteudo);
  const mudancas = mudancasForaDaChange(revisao.commitRevisado, contexto);
  if (mudancas.length > 0) {
    return resultado(
      verificacao,
      "reprovado",
      `relatório desatualizado: mudou depois da revisão: ${mudancas.join(", ")}`,
    );
  }
  if (revisao.pendentes > 0) {
    return resultado(verificacao, "reprovado", `${revisao.pendentes} pendência(s) no relatório`);
  }
  return resultado(verificacao, "aprovado", `revisado no commit ${revisao.commitRevisado}`);
}

/**
 * Avalia uma verificação da matriz para a change em andamento.
 *
 * @example
 * avaliarVerificacao(lint, contexto); // { situacao: "aprovado", detalhe: "ok", ... }
 */
export function avaliarVerificacao(
  verificacao: Verificacao,
  contexto: ContextoDaAvaliacao,
): ResultadoDaVerificacao {
  if (verificacao.ativaDesdeAChange > contexto.numeroDaChange) {
    return resultado(
      verificacao,
      "nao-aplicavel",
      `vale a partir da change ${verificacao.ativaDesdeAChange}`,
    );
  }
  if (verificacao.tipo === "somente-ci") {
    return resultado(verificacao, "nao-aplicavel", "roda só no CI (GitHub Actions)");
  }
  if (verificacao.tipo === "revisao-externa") {
    return avaliarRevisaoExterna(verificacao, contexto);
  }
  return avaliarAutomatica(verificacao, contexto);
}

/** O portão só passa com tudo aprovado (ou não aplicável) e o checklist manual inteiro marcado. */
export function portaoAprovado(resultadoDoPortao: ResultadoDoPortao): boolean {
  const semReprovacao = resultadoDoPortao.verificacoes.every((item) => item.situacao !== "reprovado");
  const checklistCompleto = resultadoDoPortao.checklistManual.every((item) => item.marcado);
  return semReprovacao && checklistCompleto;
}
