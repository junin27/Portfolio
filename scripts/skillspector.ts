// pnpm skillspector <pasta> [relatorio.json]: análise estática de segurança de skills e plugins
// (ADR-0012) com o NVIDIA SkillSpector num container Docker, sem LLM e com a pasta montada só para leitura.
// A imagem é construída uma vez a partir da tag fixa:
//   docker build -t skillspector:2.13.4 https://github.com/NVIDIA/skillspector.git#v2.13.4
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const IMAGEM_SKILLSPECTOR = "skillspector:2.13.4";
const PASTA_NO_CONTAINER = "/scan";
const PASTA_DE_SAIDA_NO_CONTAINER = "/saida";

// process.argv traz o node e o script nas duas primeiras posições.
const INDICE_DO_PRIMEIRO_ARGUMENTO = 2;
const [pastaAlvo, relatorioJson] = process.argv.slice(INDICE_DO_PRIMEIRO_ARGUMENTO);
if (pastaAlvo === undefined) {
  throw new Error("uso: pnpm skillspector <pasta-com-skills> [relatorio.json]; nenhuma pasta foi informada");
}

const argumentosDeSaida =
  relatorioJson === undefined
    ? []
    : [
        "--format",
        "json",
        "--output",
        `${PASTA_DE_SAIDA_NO_CONTAINER}/${relatorioJson.split(/[\\/]/).pop() ?? "relatorio.json"}`,
      ];
const montagemDeSaida =
  relatorioJson === undefined ? [] : ["-v", `${resolve(relatorioJson, "..")}:${PASTA_DE_SAIDA_NO_CONTAINER}`];

const execucao = spawnSync(
  "docker",
  [
    "run",
    "--rm",
    "-v",
    `${resolve(pastaAlvo)}:${PASTA_NO_CONTAINER}:ro`,
    ...montagemDeSaida,
    IMAGEM_SKILLSPECTOR,
    "scan",
    PASTA_NO_CONTAINER,
    "--no-llm",
    "--recursive",
    ...argumentosDeSaida,
  ],
  { stdio: "inherit" },
);

if (execucao.error !== undefined) {
  throw new Error(
    `não consegui rodar o Docker para o SkillSpector (${execucao.error.message}); o Docker está aberto?`,
    {
      cause: execucao.error,
    },
  );
}
process.exitCode = execucao.status ?? 1;
