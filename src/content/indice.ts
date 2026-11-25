// Junta todas as coleções numa lista única para o "Índice" da home.
// Você não edita este arquivo: ele lê projetos, pesquisa, eventos e experiências.
import { projetos } from "./projetos";
import { publicacoes, rotuloTipo } from "./pesquisa";
import { eventos, experiencias } from "./eventos";
import type { CategoriaProjeto } from "./types";

export type Filtro = "dev" | "pes" | "evt" | "trab";
export type Vitrine = "app" | "site" | "pdf" | "trofeu" | "codigo";

export interface ItemIndice {
  id: string;
  filtro: Filtro;
  rotulo: string;
  titulo: string;
  detalhe: string;
  ano: string;
  href: string;
  vitrine: Vitrine; // qual mini ilustração aparece ao passar o mouse
}

const vitrineDe = (c: CategoriaProjeto): Vitrine =>
  c === "mobile" ? "app" : c === "web" ? "site" : "codigo";

export const indice: ItemIndice[] = [
  ...projetos.map((p) => ({
    id: `p-${p.slug}`,
    filtro: "dev" as const,
    rotulo: "Desenvolvimento",
    titulo: p.titulo,
    detalhe: p.stack.slice(0, 3).join(" · "),
    ano: String(p.ano),
    href: `/projetos/${p.slug}`,
    vitrine: vitrineDe(p.categoria),
  })),
  ...publicacoes.map((p) => ({
    id: `r-${p.slug}`,
    filtro: "pes" as const,
    rotulo: "Pesquisa",
    titulo: p.titulo,
    detalhe: `${rotuloTipo[p.tipo]} · ${p.status}`,
    ano: String(p.ano),
    href: "#pesquisa",
    vitrine: "pdf" as const,
  })),
  ...eventos.map((e) => ({
    id: `e-${e.slug}`,
    filtro: "evt" as const,
    rotulo: "Evento",
    titulo: e.nome,
    detalhe: e.premio ?? e.papel,
    ano: e.data.slice(0, 4),
    href: "#eventos",
    vitrine: "trofeu" as const,
  })),
  ...experiencias.map((x) => ({
    id: `t-${x.empresa}-${x.inicio}`,
    filtro: "trab" as const,
    rotulo: "Trabalho",
    titulo: x.cargo,
    detalhe: x.empresa,
    ano: x.inicio.slice(0, 4),
    href: "#sobre",
    vitrine: "codigo" as const,
  })),
].sort((a, b) => Number(b.ano) - Number(a.ano));

export const filtros: { id: Filtro | "all"; nome: string }[] = [
  { id: "all", nome: "Tudo" },
  { id: "dev", nome: "Sites e aplicativos" },
  { id: "pes", nome: "Pesquisa" },
  { id: "evt", nome: "Eventos" },
  { id: "trab", nome: "Trabalho" },
];

/** "Hash" curto e estável a partir de um texto, para o git log dos eventos */
export function hashCurto(texto: string) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}
