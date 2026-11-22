import { FakeRelogio } from "./fake-relogio";

describe("FakeRelogio", () => {
  it("devolve sempre o instante congelado", () => {
    const relogio = new FakeRelogio(new Date("2026-11-22T10:00:00.000Z"));

    expect(relogio.agora().toISOString()).toBe("2026-11-22T10:00:00.000Z");
  });

  it("avança o tempo só quando o teste pede", () => {
    const relogio = new FakeRelogio(new Date("2026-11-22T10:00:00.000Z"));

    relogio.avancar(90_000);

    expect(relogio.agora().toISOString()).toBe("2026-11-22T10:01:30.000Z");
  });

  it("não deixa quem chama alterar o instante guardado", () => {
    const relogio = new FakeRelogio(new Date("2026-11-22T10:00:00.000Z"));

    relogio.agora().setFullYear(1999);

    expect(relogio.agora().getUTCFullYear()).toBe(2026);
  });

  it("recusa avanço negativo, porque o tempo não volta", () => {
    const relogio = new FakeRelogio(new Date("2026-11-22T10:00:00.000Z"));

    expect(() => relogio.avancar(-1)).toThrow("avancar espera milissegundos >= 0, recebeu -1");
  });
});
