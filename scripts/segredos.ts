// pnpm segredos: procura segredos vazados em todo o histórico do git com o gitleaks, dentro de um
// container Docker (nada instalado na máquina). Versão fixa da imagem oficial; atualizar só por decisão.
import { spawnSync } from "node:child_process";

const IMAGEM_GITLEAKS = "ghcr.io/gitleaks/gitleaks:v8.30.1";
const PASTA_NO_CONTAINER = "/repo";

const execucao = spawnSync(
  "docker",
  [
    "run",
    "--rm",
    "-v",
    `${process.cwd()}:${PASTA_NO_CONTAINER}`,
    IMAGEM_GITLEAKS,
    "git",
    PASTA_NO_CONTAINER,
    "--redact",
    "--no-banner",
  ],
  { stdio: "inherit" },
);

if (execucao.error !== undefined) {
  throw new Error(
    `não consegui rodar o Docker para o gitleaks (${execucao.error.message}); o Docker Desktop está aberto?`,
    {
      cause: execucao.error,
    },
  );
}
process.exitCode = execucao.status ?? 1;
