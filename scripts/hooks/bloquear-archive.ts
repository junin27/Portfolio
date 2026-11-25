// Hook PreToolUse (Bash|PowerShell): impede arquivar uma change OpenSpec sem o portão aprovado
// (ADR-0008). Só protege archives pedidos pelo Claude Code; o CI pega o resto.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { lerResumoDoRelatorio } from "../portao/relatorio";
import { lerEntradaPadrao, raizDoCheckoutDe, raizDoProjetoAtual } from "./caminhos-do-projeto";

const COMANDO_DE_ARCHIVE = /\bopenspec\s+archive(?:\s+(?<change>[a-z0-9][a-z0-9-]*))?/;
// Destino "openspec/changes/archive/<AAAA-MM-DD->nome"; só a pasta "archive" (mkdir) não conta.
const DESTINO_NO_ARCHIVE = /openspec\/changes\/archive\/(?:\d{4}-\d{2}-\d{2}-)?(?<change>[a-z0-9][a-z0-9-]*)/;

type ComandoAnalisado = { ehArchive: false } | { ehArchive: true; change: string | null };

interface DadosDaDecisao {
  readonly change: string | null;
  readonly relatorio: string | null;
  readonly commitAtual: string;
  readonly arquivosAlteradosForaDaChange: readonly string[];
}

type Decisao = { permitir: true } | { permitir: false; motivo: string };

/**
 * Diz se o comando arquiva uma change e qual.
 *
 * @example
 * extrairChangeDoArchive("openspec archive add-x -y"); // { ehArchive: true, change: "add-x" }
 */
export function extrairChangeDoArchive(comando: string): ComandoAnalisado {
  const encontrado = COMANDO_DE_ARCHIVE.exec(comando);
  if (encontrado !== null) {
    return { ehArchive: true, change: encontrado.groups?.change ?? null };
  }
  // A skill /opsx:archive arquiva movendo a pasta (mv), sem chamar o CLI: detectar pelo efeito,
  // isto é, qualquer comando que cite um destino dentro de openspec/changes/archive/.
  const normalizado = comando.replaceAll("\\", "/");
  const destino = DESTINO_NO_ARCHIVE.exec(normalizado);
  if (destino === null) {
    return { ehArchive: false };
  }
  // O destino diz o que está sendo arquivado; outras changes citadas no mesmo comando não contam.
  return { ehArchive: true, change: destino.groups?.change ?? null };
}

/**
 * Arquivos alterados fora da pasta da change, a partir do `git status --porcelain`.
 * Num rename ("R  origem -> destino") vale o destino: é onde o arquivo passa a existir.
 *
 * @example
 * arquivosForaDaChange("R  openspec/changes/x/a.md -> src/a.md\n", "x"); // ["src/a.md"]
 */
export function arquivosForaDaChange(statusPorcelain: string, change: string): string[] {
  const PREFIXO_DO_STATUS = 3;
  const SEPARADOR_DE_RENAME = " -> ";
  return statusPorcelain
    .split("\n")
    .filter((linha) => linha.trim() !== "")
    .map((linha) => linha.slice(PREFIXO_DO_STATUS).split(SEPARADOR_DE_RENAME).pop() ?? "")
    .filter((arquivo) => !arquivo.startsWith(`openspec/changes/${change}/`));
}

/** Decide se o archive pode seguir, a partir do relatório do portão e do estado do git. */
export function decidirArchive(dados: DadosDaDecisao): Decisao {
  if (dados.change === null) {
    return {
      permitir: false,
      motivo:
        "Informe a change: openspec archive <nome>. O portão precisa saber qual verificacao.md conferir.",
    };
  }
  const resumo = dados.relatorio === null ? null : lerResumoDoRelatorio(dados.relatorio);
  if (resumo === null) {
    return {
      permitir: false,
      motivo: `Sem openspec/changes/${dados.change}/verificacao.md. Rode pnpm portao --change ${dados.change} --numero <n>.`,
    };
  }
  if (!resumo.aprovado) {
    return {
      permitir: false,
      motivo: `O portão da change ${dados.change} está REPROVADO. Corrija e rode o portão de novo.`,
    };
  }
  if (resumo.commit !== dados.commitAtual) {
    return {
      permitir: false,
      motivo: `O verificacao.md é do commit ${resumo.commit}, mas o HEAD é ${dados.commitAtual}. Rode o portão de novo.`,
    };
  }
  if (dados.arquivosAlteradosForaDaChange.length > 0) {
    const lista = dados.arquivosAlteradosForaDaChange.join(", ");
    return {
      permitir: false,
      motivo: `Há alterações depois do portão: ${lista}. Commite e rode o portão de novo.`,
    };
  }
  return { permitir: true };
}

function lerRelatorio(raiz: string, change: string): string | null {
  try {
    return readFileSync(join(raiz, "openspec", "changes", change, "verificacao.md"), "utf8");
  } catch {
    return null;
  }
}

function alteracoesForaDaChange(raiz: string, change: string): string[] {
  const status = execFileSync("git", ["status", "--porcelain"], { cwd: raiz, encoding: "utf8" });
  return arquivosForaDaChange(status, change);
}

async function executarHook(): Promise<void> {
  const entrada = JSON.parse(await lerEntradaPadrao()) as {
    cwd?: unknown;
    tool_input?: { command?: unknown };
  };
  const comando = typeof entrada.tool_input?.command === "string" ? entrada.tool_input.command : "";
  const analise = extrairChangeDoArchive(comando);
  if (!analise.ehArchive) {
    return;
  }
  // O cwd da sessão aponta para o worktree; CLAUDE_PROJECT_DIR, para o checkout principal.
  const raiz = raizDoCheckoutDe(typeof entrada.cwd === "string" ? entrada.cwd : raizDoProjetoAtual());
  const change = analise.change;
  const decisao = decidirArchive({
    change,
    relatorio: change === null ? null : lerRelatorio(raiz, change),
    commitAtual: execFileSync("git", ["rev-parse", "HEAD"], { cwd: raiz, encoding: "utf8" }).trim(),
    arquivosAlteradosForaDaChange: change === null ? [] : alteracoesForaDaChange(raiz, change),
  });
  if (decisao.permitir) {
    return;
  }
  const saida = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: decisao.motivo,
    },
  };
  process.stdout.write(JSON.stringify(saida));
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await executarHook();
}
