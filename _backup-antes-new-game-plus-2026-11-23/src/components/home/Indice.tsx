"use client";

// ÍNDICE: todos os trabalhos numa lista elegante.
// - Filtros escritos como comandos de terminal ("ls ./pesquisa"), com contagem.
// - Ao filtrar, as linhas entram em cascata.
// - No hover, a linha desliza, uma faixa azul bebê preenche o fundo e um cartão com a
//   miniatura certa (celular, monitor, PDF, troféu, código) segue o mouse.
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { filtros, indice, type Filtro, type Vitrine } from "@/content/indice";
import { SplitReveal } from "@/components/fx/SplitReveal";

function Miniatura({ tipo }: { tipo: Vitrine }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full text-blue" aria-hidden>
      {tipo === "app" && (
        <>
          <rect x="36" y="10" width="48" height="100" rx="10" {...stroke} />
          <rect x="44" y="26" width="32" height="22" rx="4" fill="currentColor" opacity=".25" />
          <path d="M44 58h32M44 68h24M44 78h28" {...stroke} />
        </>
      )}
      {tipo === "site" && (
        <>
          <rect x="10" y="18" width="100" height="66" rx="6" {...stroke} />
          <path d="M10 30h100M48 84l-6 18h36l-6-18" {...stroke} />
          <rect x="20" y="40" width="44" height="8" rx="3" fill="currentColor" opacity=".3" />
          <rect x="20" y="56" width="80" height="18" rx="3" fill="currentColor" opacity=".15" />
        </>
      )}
      {tipo === "pdf" && (
        <>
          <path d="M28 10h46l20 20v80H28z" {...stroke} />
          <path d="M74 10v20h20M40 50h40M40 62h40M40 74h28" {...stroke} />
        </>
      )}
      {tipo === "trofeu" && (
        <>
          <path d="M38 16h44v24a22 22 0 0 1-44 0zM38 24H22a16 16 0 0 0 18 20M82 24h16a16 16 0 0 1-18 20M60 62v22M42 104h36M48 84h24v20H48z" {...stroke} />
        </>
      )}
      {tipo === "codigo" && <path d="M44 36L20 60l24 24M76 36l24 24-24 24M68 26L52 94" {...stroke} />}
    </svg>
  );
}

export function Indice() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filtro, setFiltro] = useState<Filtro | "all">("all");
  const [vitrine, setVitrine] = useState<Vitrine>("codigo");
  const mover = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  const lista = indice.filter((i) => filtro === "all" || i.filtro === filtro);
  const contagem = (f: Filtro | "all") => (f === "all" ? indice.length : indice.filter((i) => i.filtro === f).length);

  useGSAP(
    () => {
      mover.current = {
        x: gsap.quickTo(preview.current, "x", { duration: 0.55, ease: "power3" }),
        y: gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3" }),
      };
    },
    { scope: root },
  );

  // Linhas entram em cascata depois de trocar o filtro (não na primeira renderização)
  const primeira = useRef(true);
  useGSAP(
    () => {
      if (primeira.current) {
        primeira.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(".ix-row", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04 });
    },
    { scope: root, dependencies: [filtro], revertOnUpdate: false },
  );

  const mostrar = (v: Vitrine | null) => {
    if (v) setVitrine(v);
    gsap.to(preview.current, { scale: v ? 1 : 0.6, autoAlpha: v ? 1 : 0, rotate: v ? -3 : 0, duration: 0.4 });
  };

  return (
    <section
      ref={root}
      id="trabalhos"
      className="relative px-[max(20px,4vw)] py-28 md:py-36"
      onPointerMove={(e) => {
        const r = root.current!.getBoundingClientRect();
        mover.current?.x(e.clientX - r.left + 24);
        mover.current?.y(e.clientY - r.top - 80);
      }}
    >
      <div className="mx-auto max-w-[1320px]">
        <p className="code-comment mb-6">{"// 01 — índice"}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SplitReveal as="h2" className="font-serif text-[clamp(40px,6vw,88px)] leading-[1.08] tracking-[-0.02em]">
            Tudo o que já <em className="text-blue">construí</em>
          </SplitReveal>
          <p className="max-w-[36ch] text-mute">Projetos, pesquisas, eventos e trabalho, do mais recente ao mais antigo.</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          {filtros.map((f) => {
            const ativo = filtro === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(f.id)}
                className={`group rounded-full border px-4 py-2 font-mono text-[12px] transition-all duration-300 ${
                  ativo ? "border-ink bg-ink text-paper" : "border-line bg-card text-mute hover:border-ink/40 hover:text-ink"
                }`}
              >
                <span className={ativo ? "text-baby" : "text-blue"}>$</span> {f.comando}{" "}
                <span className="opacity-60">({String(contagem(f.id)).padStart(2, "0")})</span>
              </button>
            );
          })}
        </div>

        <ol className="ix-list mt-8 border-t border-ink" onPointerLeave={() => mostrar(null)}>
          {lista.map((item) => (
            <li key={item.id} className="ix-row border-b border-line">
              <Link
                href={item.href}
                onPointerEnter={() => mostrar(item.vitrine)}
                className="group relative grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 overflow-hidden py-6 md:grid-cols-[160px_1fr_auto_32px]"
              >
                {/* Faixa azul bebê que sobe no hover */}
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-baby-soft transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-y-100" />
                <span className="relative col-span-2 font-mono text-[11px] tracking-[0.12em] text-mute uppercase md:col-span-1">
                  {item.rotulo}
                </span>
                <span className="relative min-w-0 font-serif text-[clamp(22px,2.6vw,34px)] leading-tight transition-transform duration-500 ease-[var(--ease-cine)] group-hover:translate-x-3">
                  {item.titulo}
                  <small className="mt-1 block font-sans text-sm text-mute">{item.detalhe}</small>
                </span>
                <span className="relative font-mono text-sm text-mute tabular-nums">{item.ano}</span>
                <span className="relative hidden -translate-x-3 text-blue opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Cartão que segue o mouse (só em telas com mouse) */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 z-10 hidden h-44 w-40 scale-[.6] place-items-center rounded-2xl border border-line bg-card/90 p-6 opacity-0 shadow-[0_30px_60px_-25px_rgba(15,27,42,.35)] backdrop-blur [@media(pointer:fine)]:grid"
      >
        <Miniatura tipo={vitrine} />
      </div>
    </section>
  );
}
