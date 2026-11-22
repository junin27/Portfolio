import { decidirArchive, extrairChangeDoArchive } from "./bloquear-archive";

const RELATORIO_APROVADO = "**Resultado: APROVADO**\n\nCommit: abc1234\n";
const RELATORIO_REPROVADO = "**Resultado: REPROVADO**\n\nCommit: abc1234\n";

describe("extrairChangeDoArchive", () => {
  it("ignora comandos que não arquivam change", () => {
    expect(extrairChangeDoArchive("pnpm test")).toEqual({ ehArchive: false });
  });

  it("reconhece o archive com o nome da change, direto ou via pnpm", () => {
    expect(extrairChangeDoArchive("openspec archive setup-dev-harness -y")).toEqual({
      ehArchive: true,
      change: "setup-dev-harness",
    });
    expect(extrairChangeDoArchive("pnpm exec openspec archive add-dominio")).toEqual({
      ehArchive: true,
      change: "add-dominio",
    });
  });

  it("reconhece o archive sem nome de change", () => {
    expect(extrairChangeDoArchive("openspec archive")).toEqual({ ehArchive: true, change: null });
  });
});

describe("decidirArchive", () => {
  const base = { change: "exemplo", commitAtual: "abc1234", arquivosAlteradosForaDaChange: [] };

  it("libera com relatório aprovado do commit atual e nada alterado", () => {
    expect(decidirArchive({ ...base, relatorio: RELATORIO_APROVADO })).toEqual({ permitir: true });
  });

  it("bloqueia sem nome de change, porque não dá para achar o relatório", () => {
    expect(decidirArchive({ ...base, change: null, relatorio: null })).toEqual({
      permitir: false,
      motivo:
        "Informe a change: openspec archive <nome>. O portão precisa saber qual verificacao.md conferir.",
    });
  });

  it("bloqueia sem relatório", () => {
    expect(decidirArchive({ ...base, relatorio: null })).toEqual({
      permitir: false,
      motivo: "Sem openspec/changes/exemplo/verificacao.md. Rode pnpm portao --change exemplo --numero <n>.",
    });
  });

  it("bloqueia com portão reprovado", () => {
    expect(decidirArchive({ ...base, relatorio: RELATORIO_REPROVADO })).toEqual({
      permitir: false,
      motivo: "O portão da change exemplo está REPROVADO. Corrija e rode o portão de novo.",
    });
  });

  it("bloqueia relatório de outro commit", () => {
    expect(decidirArchive({ ...base, commitAtual: "zzz9999", relatorio: RELATORIO_APROVADO })).toEqual({
      permitir: false,
      motivo: "O verificacao.md é do commit abc1234, mas o HEAD é zzz9999. Rode o portão de novo.",
    });
  });

  it("bloqueia com código alterado e não commitado fora da change", () => {
    expect(
      decidirArchive({
        ...base,
        relatorio: RELATORIO_APROVADO,
        arquivosAlteradosForaDaChange: ["src/app/page.tsx"],
      }),
    ).toEqual({
      permitir: false,
      motivo: "Há alterações depois do portão: src/app/page.tsx. Commite e rode o portão de novo.",
    });
  });
});
