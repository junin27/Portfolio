import { gerarRelatorio, lerResumoDoRelatorio } from "./relatorio";
import type { ResultadoDoPortao, Verificacao } from "./tipos";

const lint: Verificacao = {
  id: "lint",
  nome: "Lint",
  tipo: "automatica",
  criterio: "zero erros",
  ativaDesdeAChange: 0,
  comando: ["pnpm", "lint"],
};

const resultado: ResultadoDoPortao = {
  change: "setup-dev-harness",
  numeroDaChange: 0,
  commit: "abc1234",
  geradoEm: new Date("2026-11-22T10:00:00.000Z"),
  verificacoes: [
    { verificacao: lint, situacao: "aprovado", detalhe: "ok" },
    {
      verificacao: { ...lint, id: "lighthouse", nome: "Lighthouse" },
      situacao: "nao-aplicavel",
      detalhe: "vale a partir da change 3",
    },
  ],
  checklistManual: [],
};

describe("gerarRelatorio", () => {
  it("abre com o resultado geral, a change e o commit", () => {
    const texto = gerarRelatorio(resultado);

    expect(texto).toContain("**Resultado: APROVADO**");
    expect(texto).toContain("Commit: abc1234");
    expect(texto).toContain("Change: setup-dev-harness (número 0)");
  });

  it("lista cada verificação com situação e detalhe, inclusive as não aplicáveis", () => {
    const texto = gerarRelatorio(resultado);

    expect(texto).toContain("| Lint | zero erros | aprovado | ok |");
    expect(texto).toContain("| Lighthouse | zero erros | não aplicável | vale a partir da change 3 |");
  });

  it("marca REPROVADO quando algo falhou", () => {
    const comFalha = {
      ...resultado,
      verificacoes: [{ verificacao: lint, situacao: "reprovado" as const, detalhe: "2 erros" }],
    };

    expect(gerarRelatorio(comFalha)).toContain("**Resultado: REPROVADO**");
  });

  it("escapa barras verticais do detalhe para não quebrar a tabela", () => {
    const comBarra = {
      ...resultado,
      verificacoes: [{ verificacao: lint, situacao: "reprovado" as const, detalhe: "a | b" }],
    };

    expect(gerarRelatorio(comBarra)).toContain("a \\| b");
  });
});

describe("lerResumoDoRelatorio", () => {
  it("lê de volta o resultado e o commit de um relatório gerado", () => {
    expect(lerResumoDoRelatorio(gerarRelatorio(resultado))).toEqual({ aprovado: true, commit: "abc1234" });
  });

  it("devolve null para texto que não é relatório do portão", () => {
    expect(lerResumoDoRelatorio("qualquer coisa")).toBeNull();
  });
});
