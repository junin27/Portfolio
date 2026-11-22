import { MATRIZ_DE_VERIFICACOES } from "./matriz";

const ids = MATRIZ_DE_VERIFICACOES.map((verificacao) => verificacao.id);

describe("MATRIZ_DE_VERIFICACOES", () => {
  it("não repete identificadores", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("toda verificação automática ativa na change 0 tem comando", () => {
    const semComando = MATRIZ_DE_VERIFICACOES.filter(
      (verificacao) =>
        verificacao.tipo === "automatica" &&
        verificacao.ativaDesdeAChange === 0 &&
        verificacao.comando === null,
    );

    expect(semComando).toEqual([]);
  });

  it("toda revisão externa aponta para um arquivo de relatório", () => {
    const semRelatorio = MATRIZ_DE_VERIFICACOES.filter(
      (verificacao) => verificacao.tipo === "revisao-externa" && verificacao.arquivoDoRelatorio === undefined,
    );

    expect(semRelatorio).toEqual([]);
  });

  it("contém os três blocos fixos do portão desde a change 0", () => {
    const blocosFixos = ["specs", "mantis", "ponytail-review"];

    expect(ids).toEqual(expect.arrayContaining(blocosFixos));
  });
});
