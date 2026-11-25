"use client";

// EVENTOS como "git log --graph": uma linha de commits vertical que se desenha conforme você rola.
// Cada evento é um commit com hash, data e etiqueta (tag) para prêmios.
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { eventos } from "@/content/eventos";
import { hashCurto } from "@/content/indice";
import { SplitReveal } from "@/components/fx/SplitReveal";

const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const fmt = (d: string) => `${meses[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;

export function Eventos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // A linha do grafo cresce com a rolagem (scrub), sem prender a tela
      gsap.fromTo(
        ".git-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".git-list", start: "top 75%", end: "bottom 60%", scrub: 0.5 } },
      );
      gsap.utils.toArray<HTMLElement>(".git-item").forEach((el) => {
        gsap.from(el.querySelector(".git-dot"), { scale: 0, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 72%", once: true } });
        gsap.from(el.querySelector(".git-body"), { x: 30, autoAlpha: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 72%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="eventos" className="bg-card px-[max(20px,4vw)] py-28 md:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="code-comment mb-6">{"// 04 — eventos"}</p>
          <SplitReveal as="h2" className="font-serif text-[clamp(40px,6vw,88px)] leading-[1.08] tracking-[-0.02em]">
            Histórico de <em className="text-blue">commits</em>
          </SplitReveal>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-mute">
            Eventos, prêmios e workshops, em ordem. Cada um mudou alguma coisa no código.
          </p>
          <p className="mt-8 font-mono text-[12px] text-mute">
            <span className="text-blue">$</span> git log --graph --oneline
          </p>
        </div>

        <ol className="git-list relative">
          <span aria-hidden className="git-line absolute top-2 bottom-2 left-[7px] w-[2px] origin-top bg-gradient-to-b from-blue to-baby" />
          {eventos.map((e) => (
            <li key={e.slug} className="git-item relative grid grid-cols-[16px_1fr] gap-6 pb-14 last:pb-0">
              <span aria-hidden className="git-dot relative z-10 mt-2 h-4 w-4 rounded-full border-[3px] border-blue bg-card" />
              <div className="git-body">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-mute">
                  <span className="text-[#c2410c]">{hashCurto(e.slug)}</span>
                  <span>{fmt(e.data)}</span>
                  {e.premio && (
                    <span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-[#8a6100]">tag: {e.premio}</span>
                  )}
                  <span className="rounded-full bg-baby-soft px-2 py-0.5 text-blue">{e.papel}</span>
                </p>
                <h3 className="mt-2 font-serif text-[clamp(24px,2.8vw,38px)] leading-tight">{e.nome}</h3>
                <p className="mt-2 text-mute">{e.descricao}</p>
              </div>
            </li>
          ))}
          <li className="relative grid grid-cols-[16px_1fr] gap-6 pt-14">
            <span aria-hidden className="relative z-10 mt-1 h-4 w-4 rounded-full border-2 border-dashed border-mute bg-card" />
            <p className="font-mono text-[12px] text-mute">(HEAD → main) próximo evento: em breve…</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
