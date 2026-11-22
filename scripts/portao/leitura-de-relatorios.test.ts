import { lerChecklistManual, lerRevisaoExterna } from "./leitura-de-relatorios";

describe("lerRevisaoExterna", () => {
  it("lê o commit revisado e a quantidade de pendências", () => {
    const relatorio = "# Revisão: Mantis\n\nCommit revisado: abc1234\nPendentes: 0\n\nNada encontrado.";

    expect(lerRevisaoExterna(relatorio)).toEqual({ commitRevisado: "abc1234", pendentes: 0 });
  });

  it("aceita espaços extras e outras linhas no relatório", () => {
    const relatorio = "Intro\n  Commit revisado:   def5678  \n  Pendentes:  3 \nDetalhes";

    expect(lerRevisaoExterna(relatorio)).toEqual({ commitRevisado: "def5678", pendentes: 3 });
  });

  it("explica o formato quando falta a linha do commit", () => {
    expect(() => lerRevisaoExterna("Pendentes: 0")).toThrow(
      'relatório de revisão precisa da linha "Commit revisado: <hash>"',
    );
  });

  it("explica o formato quando falta a linha de pendências", () => {
    expect(() => lerRevisaoExterna("Commit revisado: abc1234")).toThrow(
      'relatório de revisão precisa da linha "Pendentes: <número>"',
    );
  });
});

describe("lerChecklistManual", () => {
  it("lê itens marcados e desmarcados", () => {
    const checklist = "# Checklist\n\n- [x] Teste exploratório\n- [ ] Leitor de tela\n- [X] Zoom de 200%";

    expect(lerChecklistManual(checklist)).toEqual([
      { descricao: "Teste exploratório", marcado: true },
      { descricao: "Leitor de tela", marcado: false },
      { descricao: "Zoom de 200%", marcado: true },
    ]);
  });

  it("devolve lista vazia quando não há itens", () => {
    expect(lerChecklistManual("# Checklist\n\nNada nesta change.")).toEqual([]);
  });
});
