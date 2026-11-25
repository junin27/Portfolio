import { readFileSync } from "node:fs";
import { join } from "node:path";

// Regressão (Mantis, pass 1): a tarefa 5.1 exige deny para remoção recursiva e comandos destrutivos
// de git; no modo de permissão "auto" só o deny é garantido (o "ask" não pediu confirmação).
const configuracao = JSON.parse(readFileSync(join(process.cwd(), ".claude", "settings.json"), "utf8")) as {
  permissions: { deny: string[] };
};
const deny = configuracao.permissions.deny;

describe("permissões do agente: deny", () => {
  it.each(["Bash(rm -r*)", "Bash(rm -R*)", "Bash(rm -fr*)", "Bash(rm -rf*)", "Bash(rm --recursive*)"])(
    "nega remoção recursiva: %s",
    (regra) => {
      expect(deny).toContain(regra);
    },
  );

  it.each([
    "Bash(git restore*)",
    "Bash(git reset*)",
    "Bash(git checkout*)",
    "Bash(git clean*)",
    "Bash(git revert*)",
    "Bash(git stash drop*)",
    "Bash(git stash clear*)",
    "Bash(git branch -D*)",
    "Bash(git worktree remove*)",
    "Bash(git -C*)",
  ])("nega git que descarta trabalho: %s", (regra) => {
    expect(deny).toContain(regra);
  });
});
