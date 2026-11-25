"use client";

// PESQUISA: à esquerda, as publicações como lista (status estilo etiqueta);
// à direita, um leitor de PDF que folheia a publicação escolhida.
import { useState } from "react";
import { publicacoes, rotuloTipo } from "@/content/pesquisa";
import { PdfReader } from "@/components/devices/PdfReader";
import { SplitReveal } from "@/components/fx/SplitReveal";

const corStatus = {
  "em andamento": "bg-[#fff4d6] text-[#8a6100]",
  submetido: "bg-baby-soft text-blue",
  publicado: "bg-[#e3f6ec] text-[#1f7a4d]",
} as const;

export function Pesquisa() {
  const [ativa, setAtiva] = useState(0);
  const pub = publicacoes[ativa];

  return (
    <section id="pesquisa" className="px-[max(20px,4vw)] py-28 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <p className="code-comment mb-6">{"// 03 — pesquisa"}</p>
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <SplitReveal as="h2" className="max-w-[16ch] font-serif text-[clamp(40px,6vw,88px)] leading-[1.08] tracking-[-0.02em]">
              Ciência também é <em className="text-blue">produto</em>
            </SplitReveal>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-mute">
              Revisão sistemática, artigo, iniciação científica e um livro. Escolha uma publicação para folhear.
            </p>

            <ul className="mt-12 border-t border-ink" role="tablist" aria-label="Publicações">
              {publicacoes.map((p, i) => (
                <li key={p.slug} className="border-b border-line">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === ativa}
                    onClick={() => setAtiva(i)}
                    className="group flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span className={`font-mono text-[12px] transition-colors ${i === ativa ? "text-blue" : "text-mute"}`}>
                      {i === ativa ? "▸" : " "} {rotuloTipo[p.tipo]}
                    </span>
                    <span
                      className={`flex-1 font-serif text-[clamp(20px,2.2vw,28px)] leading-tight transition-all duration-500 ${
                        i === ativa ? "translate-x-2 text-ink" : "text-ink/60 group-hover:text-ink"
                      }`}
                    >
                      {p.titulo}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${corStatus[p.status]}`}>{p.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center lg:sticky lg:top-28 lg:w-[440px]">
            <PdfReader pub={pub} />
          </div>
        </div>
      </div>
    </section>
  );
}
