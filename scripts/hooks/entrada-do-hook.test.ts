import { lerCaminhoEditado } from "./entrada-do-hook";

describe("lerCaminhoEditado", () => {
  it("devolve o caminho do arquivo editado pelo Edit ou Write", () => {
    const entrada = JSON.stringify({ tool_name: "Edit", tool_input: { file_path: "C:/projeto/src/a.ts" } });

    expect(lerCaminhoEditado(entrada)).toBe("C:/projeto/src/a.ts");
  });

  it("devolve null quando a ferramenta não traz caminho de arquivo", () => {
    const entrada = JSON.stringify({ tool_name: "Bash", tool_input: { command: "ls" } });

    expect(lerCaminhoEditado(entrada)).toBeNull();
  });

  it("devolve null para entrada vazia", () => {
    expect(lerCaminhoEditado("")).toBeNull();
  });

  it("lança erro explicando o formato esperado quando a entrada não é JSON", () => {
    expect(() => lerCaminhoEditado("isto não é json")).toThrow(
      'entrada do hook deve ser JSON com tool_input.file_path, recebeu: "isto não é json"',
    );
  });

  it("aceita caminhos com espaço e acento", () => {
    const caminho = "C:/Projetos Software/Portfólio/src/página.tsx";
    const entrada = JSON.stringify({ tool_name: "Write", tool_input: { file_path: caminho } });

    expect(lerCaminhoEditado(entrada)).toBe(caminho);
  });
});
