import { deveFormatar } from "./formatar-arquivo";

const RAIZ = "C:/Projetos/portfolio-v2";

describe("deveFormatar", () => {
  it("formata arquivo TypeScript dentro do projeto", () => {
    expect(deveFormatar(`${RAIZ}/src/dominio/projeto.ts`, RAIZ)).toBe(true);
  });

  it("formata CSS, JSON e YAML do projeto", () => {
    expect(deveFormatar(`${RAIZ}/src/app/globals.css`, RAIZ)).toBe(true);
    expect(deveFormatar(`${RAIZ}/package.json`, RAIZ)).toBe(true);
    expect(deveFormatar(`${RAIZ}/docker-compose.yml`, RAIZ)).toBe(true);
  });

  it("não formata Markdown, que o projeto escreve à mão", () => {
    expect(deveFormatar(`${RAIZ}/docs/roadmap.md`, RAIZ)).toBe(false);
  });

  it("não formata arquivo fora do projeto", () => {
    expect(deveFormatar("C:/Outro/projeto/index.ts", RAIZ)).toBe(false);
  });

  it("não formata arquivos gerados ou de dependências", () => {
    expect(deveFormatar(`${RAIZ}/node_modules/pacote/index.js`, RAIZ)).toBe(false);
    expect(deveFormatar(`${RAIZ}/.next/server/page.js`, RAIZ)).toBe(false);
    expect(deveFormatar(`${RAIZ}/pnpm-lock.yaml`, RAIZ)).toBe(false);
  });

  it("trata barras invertidas do Windows como separador", () => {
    expect(deveFormatar("C:\\Projetos\\portfolio-v2\\src\\app\\page.tsx", RAIZ)).toBe(true);
  });
});
