import { arquivosForaDaChange, decidirArchive, extrairChangeDoArchive } from "./bloquear-archive";

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

  // Regressão (Mantis, pass 1): o /opsx:archive arquiva com mv, sem chamar o CLI.
  it("reconhece o archive feito movendo a pasta da change, como faz a skill /opsx:archive", () => {
    const comando =
      'mkdir -p "openspec/changes/archive" && mv "openspec/changes/add-x" "openspec/changes/archive/2026-11-23-add-x"';

    expect(extrairChangeDoArchive(comando)).toEqual({ ehArchive: true, change: "add-x" });
  });

  it("reconhece o archive por Move-Item com barras do Windows e caminho absoluto", () => {
    const comando =
      "Move-Item C:\\p\\openspec\\changes\\add-x C:\\p\\openspec\\changes\\archive\\2026-11-23-add-x";

    expect(extrairChangeDoArchive(comando)).toEqual({ ehArchive: true, change: "add-x" });
  });

  it("tira a data do destino quando o comando só cita a pasta de archive", () => {
    expect(extrairChangeDoArchive("cp -r tmp openspec/changes/archive/2026-11-23-add-x")).toEqual({
      ehArchive: true,
      change: "add-x",
    });
  });

  it("usa a change do destino quando o comando cita outra change antes", () => {
    const comando =
      "cat openspec/changes/verde/tasks.md && mv openspec/changes/b openspec/changes/archive/2026-11-23-b";

    expect(extrairChangeDoArchive(comando)).toEqual({ ehArchive: true, change: "b" });
  });

  it("não trata como archive só criar a pasta de archive", () => {
    expect(extrairChangeDoArchive('mkdir -p "openspec/changes/archive"')).toEqual({ ehArchive: false });
  });
});

describe("arquivosForaDaChange", () => {
  it("lista o que mudou fora da pasta da change", () => {
    const status = " M src/a.ts\n?? openspec/changes/x/nota.md\n";

    expect(arquivosForaDaChange(status, "x")).toEqual(["src/a.ts"]);
  });

  // Regressão (Mantis, pass 1): "R  origem -> destino" começava com a pasta da change e passava.
  it("conta o destino de um rename que sai da pasta da change", () => {
    const status = "R  openspec/changes/x/nota.md -> src/nota.md\n";

    expect(arquivosForaDaChange(status, "x")).toEqual(["src/nota.md"]);
  });

  it("ignora rename dentro da própria change", () => {
    expect(arquivosForaDaChange("R  openspec/changes/x/a.md -> openspec/changes/x/b.md\n", "x")).toEqual([]);
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
