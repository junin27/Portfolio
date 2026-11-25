"use client";

// Leitor de PDF: as páginas viram como papel (rotação 3D a partir da lombada).
// Mostra capa, resumo, fluxo de seleção (PRISMA) e sumário da publicação escolhida.
import { useState } from "react";
import type { Publicacao } from "@/content/types";
import { rotuloTipo } from "@/content/pesquisa";
import { perfil } from "@/content/perfil";

const TOTAL = 4;

function Pagina({ n, pub }: { n: number; pub: Publicacao }) {
  const base = "absolute inset-0 overflow-hidden bg-white px-[9%] py-[10%] font-serif text-[clamp(9px,1.05vw,12px)] leading-[1.5] text-ink";
  if (n === 0)
    return (
      <div className={`${base} flex flex-col items-center justify-between text-center uppercase tracking-[0.06em]`}>
        <span className="text-[0.85em]">Engenharia de Software</span>
        <span className="font-serif text-[1.6em] leading-tight font-semibold normal-case tracking-normal">{pub.titulo}</span>
        <span className="text-[0.85em]">
          {perfil.nome}
          <br />
          <br />
          {rotuloTipo[pub.tipo]} · {pub.ano}
        </span>
      </div>
    );
  if (n === 1)
    return (
      <div className={base}>
        <p className="mb-3 text-center font-semibold tracking-[0.1em] uppercase">Resumo</p>
        <p className="text-justify">{pub.resumo}</p>
        <div className="mt-3 space-y-1.5">
          {[100, 96, 100, 88, 100, 70].map((w, i) => (
            <i key={i} className="block h-[5px] rounded bg-line" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-3">
          <b>Palavras-chave:</b> {(pub.palavrasChave ?? ["engenharia de software", "revisão sistemática"]).join("; ")}.
        </p>
        <span className="absolute right-[9%] bottom-[5%] text-[0.8em] text-mute">2</span>
      </div>
    );
  if (n === 2)
    return (
      <div className={base}>
        <p className="mb-3 text-center font-semibold tracking-[0.1em] uppercase">Fluxo de seleção</p>
        <div className="flex flex-col items-center gap-1.5 text-center text-[0.9em]">
          {["Estudos identificados (n = —)", "Após remover duplicados (n = —)", "Triados por título e resumo (n = —)", "Incluídos na síntese (n = —)"].map(
            (t, i) => (
              <div key={t} className="flex w-full flex-col items-center gap-1.5">
                {i > 0 && <span aria-hidden>↓</span>}
                <div className="w-[88%] border border-ink px-2 py-1.5">{t}</div>
              </div>
            ),
          )}
        </div>
        <span className="absolute right-[9%] bottom-[5%] text-[0.8em] text-mute">3</span>
      </div>
    );
  return (
    <div className={base}>
      <p className="mb-3 text-center font-semibold tracking-[0.1em] uppercase">Sumário</p>
      {["Introdução", "Fundamentação teórica", "Método", "Resultados", "Discussão", "Conclusão", "Referências"].map((t, i) => (
        <p key={t} className="flex gap-1">
          <span>
            {i + 1} {t}
          </span>
          <span className="flex-1 border-b border-dotted border-mute/60" />
          <span>{(i + 1) * 7}</span>
        </p>
      ))}
      <span className="absolute right-[9%] bottom-[5%] text-[0.8em] text-mute">4</span>
    </div>
  );
}

export function PdfReader({ pub }: { pub: Publicacao }) {
  const [p, setP] = useState(0);
  const arquivo = `${pub.slug}.pdf`;

  return (
    <div className="w-full max-w-[460px] rounded-xl border border-line bg-[#e9eef3] p-3 shadow-[0_40px_80px_-30px_rgba(15,27,42,.35)]">
      <div className="mb-3 flex items-center gap-2 px-1 font-mono text-[11px] text-mute">
        <span className="rounded bg-[#e5484d] px-1.5 py-0.5 text-[9px] font-semibold text-white">PDF</span>
        <span className="flex-1 truncate text-ink">{arquivo}</span>
        <span className="tabular-nums">
          {p + 1}/{TOTAL}
        </span>
        <button
          type="button"
          onClick={() => setP((v) => Math.max(0, v - 1))}
          disabled={p === 0}
          aria-label="Página anterior"
          className="grid h-7 w-7 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setP((v) => Math.min(TOTAL - 1, v + 1))}
          disabled={p === TOTAL - 1}
          aria-label="Próxima página"
          className="grid h-7 w-7 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40"
        >
          ›
        </button>
      </div>
      <div className="relative aspect-[1/1.35] [perspective:1600px]">
        {Array.from({ length: TOTAL }, (_, n) => (
          <div
            key={`${pub.slug}-${n}`}
            aria-hidden={n !== p}
            className="absolute inset-0 origin-left shadow-sm transition-[transform,opacity] duration-[900ms] ease-[var(--ease-cine)] [backface-visibility:hidden]"
            style={{
              zIndex: TOTAL - n,
              transform: n < p ? "rotateY(-105deg)" : "rotateY(0deg)",
              opacity: n < p ? 0 : 1,
            }}
          >
            <Pagina n={n} pub={pub} />
          </div>
        ))}
      </div>
      {(pub.pdf || pub.link) && (
        <a
          href={pub.pdf ?? pub.link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-lg bg-ink py-2.5 text-center text-sm text-paper"
        >
          Abrir publicação completa ↗
        </a>
      )}
    </div>
  );
}
