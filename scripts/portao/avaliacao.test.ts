import { FakeConsultaGit, FakeExecutorDeProcessos, FakeLeitorDeArquivos } from "@tests/fakes/portao";
import { avaliarVerificacao, completarChecklistManual, portaoAprovado } from "./avaliacao";
import type { ResultadoDoPortao, Verificacao } from "./tipos";

const PASTA_DA_CHANGE = "openspec/changes/exemplo";

const lint: Verificacao = {
  id: "lint",
  nome: "Lint",
  tipo: "automatica",
  criterio: "zero erros",
  ativaDesdeAChange: 0,
  comando: ["pnpm", "lint"],
};

const mantis: Verificacao = {
  id: "mantis",
  nome: "Mantis",
  tipo: "revisao-externa",
  criterio: "zero achados confirmados pendentes",
  ativaDesdeAChange: 0,
  comando: null,
  arquivoDoRelatorio: "revisoes/mantis.md",
};

function contexto(opcoes?: {
  executor?: FakeExecutorDeProcessos;
  leitor?: FakeLeitorDeArquivos;
  git?: FakeConsultaGit;
}) {
  return {
    numeroDaChange: 0,
    pastaDaChange: PASTA_DA_CHANGE,
    executor: opcoes?.executor ?? new FakeExecutorDeProcessos(),
    leitor: opcoes?.leitor ?? new FakeLeitorDeArquivos(),
    git: opcoes?.git ?? new FakeConsultaGit("head123"),
  };
}

describe("avaliarVerificacao: aplicabilidade", () => {
  it("marca como não aplicável a verificação de uma change futura, com o motivo", () => {
    const futura: Verificacao = { ...lint, ativaDesdeAChange: 3, comando: null };

    const resultado = avaliarVerificacao(futura, contexto());

    expect(resultado).toMatchObject({ situacao: "nao-aplicavel", detalhe: "vale a partir da change 3" });
  });

  it("marca como não aplicável localmente o que só roda no CI", () => {
    const codeql: Verificacao = { ...lint, id: "codeql", tipo: "somente-ci", comando: null };

    const resultado = avaliarVerificacao(codeql, contexto());

    expect(resultado).toMatchObject({ situacao: "nao-aplicavel", detalhe: "roda só no CI (GitHub Actions)" });
  });
});

describe("avaliarVerificacao: automáticas", () => {
  it("aprova quando o comando sai com código 0", () => {
    const executor = new FakeExecutorDeProcessos().responder(["pnpm", "lint"], {
      codigoDeSaida: 0,
      saida: "",
    });

    const resultado = avaliarVerificacao(lint, contexto({ executor }));

    expect(resultado.situacao).toBe("aprovado");
  });

  it("reprova mostrando o fim da saída quando o comando falha", () => {
    const saida = "linha 1\nlinha 2\nerro: regra quebrada em src/a.ts";
    const executor = new FakeExecutorDeProcessos().responder(["pnpm", "lint"], { codigoDeSaida: 1, saida });

    const resultado = avaliarVerificacao(lint, contexto({ executor }));

    expect(resultado).toMatchObject({
      situacao: "reprovado",
      detalhe: expect.stringContaining("regra quebrada"),
    });
  });

  it("reprova verificação ativa que ainda não tem comando definido", () => {
    const semComando: Verificacao = { ...lint, comando: null };

    const resultado = avaliarVerificacao(semComando, contexto());

    expect(resultado).toMatchObject({
      situacao: "reprovado",
      detalhe: "verificação ativa sem comando definido na matriz",
    });
  });
});

describe("avaliarVerificacao: revisões externas", () => {
  it("aprova relatório do commit atual sem pendências", () => {
    const leitor = new FakeLeitorDeArquivos().com(
      `${PASTA_DA_CHANGE}/revisoes/mantis.md`,
      "Commit revisado: head123\nPendentes: 0",
    );

    const resultado = avaliarVerificacao(mantis, contexto({ leitor }));

    expect(resultado.situacao).toBe("aprovado");
  });

  it("marca como não aplicável, com o motivo, a revisão declarada não aplicável no relatório", () => {
    const leitor = new FakeLeitorDeArquivos().com(
      `${PASTA_DA_CHANGE}/revisoes/mantis.md`,
      "Não aplicável: ponytail ainda não instalado (tarefa 7.5b)",
    );

    const resultado = avaliarVerificacao(mantis, contexto({ leitor }));

    expect(resultado).toMatchObject({
      situacao: "nao-aplicavel",
      detalhe: "ponytail ainda não instalado (tarefa 7.5b)",
    });
  });

  it("reprova quando o relatório não existe", () => {
    const resultado = avaliarVerificacao(mantis, contexto());

    expect(resultado).toMatchObject({
      situacao: "reprovado",
      detalhe: `relatório não encontrado: ${PASTA_DA_CHANGE}/revisoes/mantis.md`,
    });
  });

  it("reprova quando há pendências", () => {
    const leitor = new FakeLeitorDeArquivos().com(
      `${PASTA_DA_CHANGE}/revisoes/mantis.md`,
      "Commit revisado: head123\nPendentes: 2",
    );

    const resultado = avaliarVerificacao(mantis, contexto({ leitor }));

    expect(resultado).toMatchObject({ situacao: "reprovado", detalhe: "2 pendência(s) no relatório" });
  });

  it("aceita relatório de commit anterior se depois dele só mudaram arquivos da própria change", () => {
    const leitor = new FakeLeitorDeArquivos().com(
      `${PASTA_DA_CHANGE}/revisoes/mantis.md`,
      "Commit revisado: antigo1\nPendentes: 0",
    );
    const git = new FakeConsultaGit("head123").comAlteracoesDesde("antigo1", [`${PASTA_DA_CHANGE}/tasks.md`]);

    const resultado = avaliarVerificacao(mantis, contexto({ leitor, git }));

    expect(resultado.situacao).toBe("aprovado");
  });

  it("reprova relatório desatualizado quando código mudou depois da revisão", () => {
    const leitor = new FakeLeitorDeArquivos().com(
      `${PASTA_DA_CHANGE}/revisoes/mantis.md`,
      "Commit revisado: antigo1\nPendentes: 0",
    );
    const git = new FakeConsultaGit("head123").comAlteracoesDesde("antigo1", ["src/app/page.tsx"]);

    const resultado = avaliarVerificacao(mantis, contexto({ leitor, git }));

    expect(resultado).toMatchObject({
      situacao: "reprovado",
      detalhe: "relatório desatualizado: mudou depois da revisão: src/app/page.tsx",
    });
  });
});

// Regressão (Mantis, pass 1): sem checklist-manual.md o portão aprovava mesmo com itens manuais ativos.
describe("completarChecklistManual", () => {
  it("acrescenta desmarcados os itens manuais ativos que faltam no arquivo", () => {
    const completo = completarChecklistManual([{ descricao: "Zoom de 200%", marcado: true }], 3);

    expect(completo).toEqual([
      { descricao: "Zoom de 200%", marcado: true },
      { descricao: "Teste exploratório de 15 minutos", marcado: false },
      { descricao: "Leitor de tela (NVDA) nas páginas novas", marcado: false },
    ]);
  });

  it("não exige item manual antes da change em que ele passa a valer", () => {
    expect(completarChecklistManual([], 0)).toEqual([]);
  });
});

describe("portaoAprovado", () => {
  const base: ResultadoDoPortao = {
    change: "exemplo",
    numeroDaChange: 0,
    commit: "head123",
    geradoEm: new Date("2026-11-22T10:00:00.000Z"),
    verificacoes: [
      { verificacao: lint, situacao: "aprovado", detalhe: "ok" },
      {
        verificacao: { ...lint, id: "futura" },
        situacao: "nao-aplicavel",
        detalhe: "vale a partir da change 3",
      },
    ],
    checklistManual: [{ descricao: "Teste exploratório", marcado: true }],
  };

  it("aprova com tudo aprovado ou não aplicável e checklist marcado", () => {
    expect(portaoAprovado(base)).toBe(true);
  });

  it("reprova com qualquer verificação reprovada", () => {
    const comFalha = {
      ...base,
      verificacoes: [{ verificacao: lint, situacao: "reprovado" as const, detalhe: "x" }],
    };

    expect(portaoAprovado(comFalha)).toBe(false);
  });

  it("reprova com item do checklist manual desmarcado", () => {
    const comItemAberto = { ...base, checklistManual: [{ descricao: "Leitor de tela", marcado: false }] };

    expect(portaoAprovado(comItemAberto)).toBe(false);
  });
});
