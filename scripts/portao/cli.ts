// Entrada do portão: pnpm portao --change <nome> --numero <n>
// Liga as portas aos adaptadores reais, avalia a matriz e grava verificacao.md na pasta da change.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
  avaliarVerificacao,
  completarChecklistManual,
  portaoAprovado,
  type ContextoDaAvaliacao,
} from "./avaliacao";
import { lerChecklistManual } from "./leitura-de-relatorios";
import { MATRIZ_DE_VERIFICACOES } from "./matriz";
import type { ConsultaGit, ExecutorDeProcessos, LeitorDeArquivos } from "./portas";
import { gerarRelatorio } from "./relatorio";
import type { ResultadoDoPortao } from "./tipos";

// 30 minutos: o e2e nos três motores com build é a verificação mais lenta.
const TEMPO_LIMITE_POR_VERIFICACAO_MS = 1_800_000;
// 64 MiB: saída do build e do Playwright cabe com folga.
const SAIDA_MAXIMA_EM_BYTES = 67_108_864;

const executorReal: ExecutorDeProcessos = {
  executar(comando) {
    const [programa, ...argumentos] = comando;
    // No Windows o pnpm é um .cmd, que só roda através do shell.
    const execucao = spawnSync(programa ?? "", argumentos, {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: TEMPO_LIMITE_POR_VERIFICACAO_MS,
      maxBuffer: SAIDA_MAXIMA_EM_BYTES,
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    });
    return { codigoDeSaida: execucao.status, saida: `${execucao.stdout ?? ""}\n${execucao.stderr ?? ""}` };
  },
};

const leitorReal: LeitorDeArquivos = {
  ler(caminho) {
    try {
      return readFileSync(caminho, "utf8");
    } catch (erro) {
      if ((erro as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw erro;
    }
  },
};

const gitReal: ConsultaGit = {
  commitAtual: () => execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  arquivosAlteradosDesde: (commit) =>
    execFileSync("git", ["diff", "--name-only", commit, "HEAD"], { encoding: "utf8" })
      .split("\n")
      .filter((linha) => linha !== ""),
};

function lerArgumentos(): { change: string; numero: number } {
  const { values } = parseArgs({ options: { change: { type: "string" }, numero: { type: "string" } } });
  const numero = Number(values.numero);
  if (values.change === undefined || !Number.isInteger(numero) || numero < 0) {
    throw new Error(
      `uso: pnpm portao --change <nome> --numero <n>; recebeu change="${values.change}" numero="${values.numero}"`,
    );
  }
  return { change: values.change, numero };
}

function executarPortao(): void {
  const { change, numero } = lerArgumentos();
  const pastaDaChange = `openspec/changes/${change}`;
  const contexto: ContextoDaAvaliacao = {
    numeroDaChange: numero,
    pastaDaChange,
    executor: executorReal,
    leitor: leitorReal,
    git: gitReal,
  };
  const verificacoes = MATRIZ_DE_VERIFICACOES.map((verificacao) => {
    process.stdout.write(`- ${verificacao.nome}... `);
    const avaliacao = avaliarVerificacao(verificacao, contexto);
    process.stdout.write(`${avaliacao.situacao}\n`);
    return avaliacao;
  });
  const resultado: ResultadoDoPortao = {
    change,
    numeroDaChange: numero,
    commit: gitReal.commitAtual(),
    geradoEm: new Date(),
    verificacoes,
    checklistManual: completarChecklistManual(
      lerChecklistManual(leitorReal.ler(`${pastaDaChange}/checklist-manual.md`) ?? ""),
      numero,
    ),
  };
  writeFileSync(`${pastaDaChange}/verificacao.md`, gerarRelatorio(resultado), "utf8");
  const aprovado = portaoAprovado(resultado);
  process.stdout.write(`\nPortão ${aprovado ? "APROVADO" : "REPROVADO"}: ${pastaDaChange}/verificacao.md\n`);
  process.exitCode = aprovado ? 0 : 1;
}

executarPortao();
