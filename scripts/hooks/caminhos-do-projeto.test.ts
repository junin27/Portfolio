import { FakeConsultaDeRepositorio } from "@tests/fakes/repositorio";
import { raizDoProjetoPara } from "./caminhos-do-projeto";

const PRINCIPAL = "C:/Projetos/portfolio-v2";
const GIT_COMUM = `${PRINCIPAL}/.git`;
const WORKTREE = `${PRINCIPAL}/.claude/worktrees/sessao-1`;

describe("raizDoProjetoPara", () => {
  it("usa o worktree quando a pasta está num worktree do mesmo repositório", () => {
    const repositorio = new FakeConsultaDeRepositorio()
      .comCheckout(PRINCIPAL, GIT_COMUM)
      .comCheckout(WORKTREE, GIT_COMUM);

    expect(raizDoProjetoPara(`${WORKTREE}/scripts/hooks`, PRINCIPAL, repositorio)).toBe(WORKTREE);
  });

  it("usa o checkout principal quando a pasta está nele", () => {
    const repositorio = new FakeConsultaDeRepositorio().comCheckout(PRINCIPAL, GIT_COMUM);

    expect(raizDoProjetoPara(`${PRINCIPAL}/src`, PRINCIPAL, repositorio)).toBe(PRINCIPAL);
  });

  it("fica com a raiz padrão quando a pasta é de outro repositório, para não rodar o node_modules dele", () => {
    const outro = "C:/Outro/projeto";
    const repositorio = new FakeConsultaDeRepositorio()
      .comCheckout(PRINCIPAL, GIT_COMUM)
      .comCheckout(outro, `${outro}/.git`);

    expect(raizDoProjetoPara(`${outro}/src`, PRINCIPAL, repositorio)).toBe(PRINCIPAL);
  });

  it("fica com a raiz padrão quando a pasta está fora de qualquer repositório", () => {
    const repositorio = new FakeConsultaDeRepositorio().comCheckout(PRINCIPAL, GIT_COMUM);

    expect(raizDoProjetoPara("C:/Temp/solto", PRINCIPAL, repositorio)).toBe(PRINCIPAL);
  });

  it("compara caminhos ignorando barra invertida e caixa, como o Windows", () => {
    const repositorio = new FakeConsultaDeRepositorio()
      .comCheckout(PRINCIPAL, GIT_COMUM)
      .comCheckout(WORKTREE, "c:\\projetos\\portfolio-v2\\.git");

    expect(raizDoProjetoPara(`${WORKTREE}/src`, PRINCIPAL, repositorio)).toBe(WORKTREE);
  });
});
