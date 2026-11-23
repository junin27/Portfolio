import { deveTestar, resumirResultado } from "./testar-relacionados";

const RAIZ = "C:/Projetos/portfolio-v2";

describe("deveTestar", () => {
  it("testa arquivos TypeScript de src, tests e scripts", () => {
    expect(deveTestar(`${RAIZ}/src/dominio/projeto.ts`, RAIZ)).toBe(true);
    expect(deveTestar(`${RAIZ}/src/ui/botao.tsx`, RAIZ)).toBe(true);
    expect(deveTestar(`${RAIZ}/tests/fakes/fake-relogio.ts`, RAIZ)).toBe(true);
    expect(deveTestar(`${RAIZ}/scripts/hooks/formatar-arquivo.ts`, RAIZ)).toBe(true);
  });

  it("não roda testes de integração nem e2e, que dependem de Docker e navegador", () => {
    expect(deveTestar(`${RAIZ}/tests/integracao/postgres.test.ts`, RAIZ)).toBe(false);
    expect(deveTestar(`${RAIZ}/tests/e2e/home.spec.ts`, RAIZ)).toBe(false);
  });

  it("ignora arquivos que não são TypeScript", () => {
    expect(deveTestar(`${RAIZ}/src/app/globals.css`, RAIZ)).toBe(false);
    expect(deveTestar(`${RAIZ}/docs/roadmap.md`, RAIZ)).toBe(false);
  });

  it("ignora arquivo fora do projeto", () => {
    expect(deveTestar("C:/Outro/src/a.ts", RAIZ)).toBe(false);
  });
});

describe("resumirResultado", () => {
  it("resume sucesso com a contagem de testes", () => {
    const saida = " Test Files  2 passed (2)\n      Tests  5 passed (5)\n";

    expect(resumirResultado({ saida, codigoDeSaida: 0, estourouTempo: false })).toBe(
      "Testes relacionados: verdes. Tests  5 passed (5)",
    );
  });

  it("resume falha com a primeira linha de erro", () => {
    const saida = [
      " FAIL  |unit| tests/fakes/fake-relogio.test.ts > FakeRelogio > avança",
      "AssertionError: expected '2026' to be '2027'",
      "      Tests  1 failed | 4 passed (5)",
    ].join("\n");

    expect(resumirResultado({ saida, codigoDeSaida: 1, estourouTempo: false })).toBe(
      "Testes relacionados: VERMELHOS. Tests  1 failed | 4 passed (5). Primeira falha: FAIL  |unit| tests/fakes/fake-relogio.test.ts > FakeRelogio > avança",
    );
  });

  it("avisa quando não há teste relacionado ao arquivo", () => {
    const saida = "No test files found, exiting with code 0\n";

    expect(resumirResultado({ saida, codigoDeSaida: 0, estourouTempo: false })).toBe(
      "Testes relacionados: nenhum teste cobre este arquivo ainda.",
    );
  });

  it("avisa quando o vitest related não acha teste afetado (mensagem do Vitest 5)", () => {
    const saida = "No affected test files found, exiting with code 0\n";

    expect(resumirResultado({ saida, codigoDeSaida: 0, estourouTempo: false })).toBe(
      "Testes relacionados: nenhum teste cobre este arquivo ainda.",
    );
  });

  it("avisa sem falhar quando o tempo limite estoura", () => {
    expect(resumirResultado({ saida: "", codigoDeSaida: null, estourouTempo: true })).toBe(
      "Testes relacionados: tempo limite de 60 s estourado; rode pnpm test para ver o resultado.",
    );
  });
});
