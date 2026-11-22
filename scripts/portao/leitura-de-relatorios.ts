import type { ItemDoChecklist } from "./tipos";

export interface RevisaoExterna {
  readonly commitRevisado: string;
  readonly pendentes: number;
}

const LINHA_DO_COMMIT = /^\s*Commit revisado:\s*(\S+)\s*$/m;
const LINHA_DE_PENDENTES = /^\s*Pendentes:\s*(\d+)\s*$/m;
const ITEM_DE_CHECKLIST = /^\s*- \[(?<marca> |x|X)\] (?<descricao>.+?)\s*$/gm;

/**
 * Lê o cabeçalho de um relatório de revisão externa (Mantis, ponytail, SkillSpector, impeccable).
 *
 * @example
 * lerRevisaoExterna("Commit revisado: abc1234\nPendentes: 0"); // { commitRevisado: "abc1234", pendentes: 0 }
 */
export function lerRevisaoExterna(conteudo: string): RevisaoExterna {
  const commit = LINHA_DO_COMMIT.exec(conteudo)?.[1];
  if (commit === undefined) {
    throw new Error('relatório de revisão precisa da linha "Commit revisado: <hash>"');
  }
  const pendentes = LINHA_DE_PENDENTES.exec(conteudo)?.[1];
  if (pendentes === undefined) {
    throw new Error('relatório de revisão precisa da linha "Pendentes: <número>"');
  }
  return { commitRevisado: commit, pendentes: Number(pendentes) };
}

/**
 * Lê os itens "- [x] ..." do checklist manual da change.
 *
 * @example
 * lerChecklistManual("- [x] Zoom de 200%"); // [{ descricao: "Zoom de 200%", marcado: true }]
 */
export function lerChecklistManual(conteudo: string): ItemDoChecklist[] {
  return [...conteudo.matchAll(ITEM_DE_CHECKLIST)].map((item) => ({
    descricao: item.groups?.descricao ?? "",
    marcado: item.groups?.marca !== " ",
  }));
}
