import { codigoDeSaidaDoGitleaks, montagensDoRepositorio } from "./segredos";

const PRINCIPAL = "C:/p/portfolio-v2";

describe("montagensDoRepositorio", () => {
  it("monta só o checkout, somente leitura, quando ele tem o próprio .git", () => {
    const montagens = montagensDoRepositorio({
      topo: PRINCIPAL,
      gitDir: `${PRINCIPAL}/.git`,
      gitComum: `${PRINCIPAL}/.git`,
    });

    expect(montagens).toEqual(["-v", `${PRINCIPAL}:/repo:ro`]);
  });

  // Regressão (Mantis, pass 1): no worktree o .git é um arquivo que aponta para fora da montagem.
  it("num worktree, monta também o .git comum e aponta o GIT_DIR para o worktree", () => {
    const worktree = `${PRINCIPAL}/.claude/worktrees/s1`;

    const montagens = montagensDoRepositorio({
      topo: worktree,
      gitDir: `${PRINCIPAL}/.git/worktrees/s1`,
      gitComum: `${PRINCIPAL}/.git`,
    });

    expect(montagens).toEqual([
      "-v",
      `${worktree}:/repo:ro`,
      "-v",
      `${PRINCIPAL}/.git:/git-comum:ro`,
      "-e",
      "GIT_DIR=/git-comum/worktrees/s1",
      "-e",
      "GIT_WORK_TREE=/repo",
    ]);
  });
});

describe("codigoDeSaidaDoGitleaks", () => {
  it("aprova varredura com commits lidos e sem vazamento", () => {
    expect(codigoDeSaidaDoGitleaks("INF 9 commits scanned.\nINF no leaks found", 0)).toBe(0);
  });

  it("mantém a falha quando o gitleaks acha vazamento", () => {
    expect(codigoDeSaidaDoGitleaks("WRN leaks found: 1", 1)).toBe(1);
  });

  // Regressão (Mantis, pass 1): o gitleaks saía com 0 depois de ler 0 commits.
  it("reprova quando nenhum commit foi lido, mesmo com código 0", () => {
    expect(
      codigoDeSaidaDoGitleaks(
        "ERR fatal: not a git repository\nINF 0 commits scanned.\nINF no leaks found",
        0,
      ),
    ).toBe(1);
  });
});
