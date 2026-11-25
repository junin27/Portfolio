"use client";

// EVENTOS como "conquistas desbloqueadas" (referência de videogame).
// Cada evento é um troféu: ao entrar na tela, o cartão desliza da direita como a notificação
// de conquista de um console, o ícone dá um "pulo" em degraus e o brilho passa uma vez.
// Prêmios ganham troféu dourado; os demais, medalha azul.
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { eventos } from "@/content/eventos";
import { SplitReveal } from "@/components/fx/SplitReveal";

const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const fmt = (d: string) => `${meses[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;

// Ícones em pixel art 8×8 ("." = vazio)
const TROFEU = ["gggggggg", "gyggggyg", "gyggggyg", ".gggggg.", "..gggg..", "...gg...", "..gggg..", ".gggggg."];
const MEDALHA = ["..b..b..", "...bb...", "..bbbb..", ".bwwwwb.", ".bwbbwb.", ".bwwwwb.", "..bbbb..", "........"];
const CORES: Record<string, string> = { g: "#f2c14e", y: "#fff4d6", b: "#2462a6", w: "#a9d6f5" };

function IconePixel({ desenho }: { desenho: readonly string[] }) {
  return (
    <svg viewBox="0 0 8 8" className="h-full w-full [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden>
      {desenho.flatMap((linha, y) =>
        [...linha].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={CORES[c]} />)),
      )}
    </svg>
  );
}

export function Eventos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".conquista").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        tl.from(el, { xPercent: 18, autoAlpha: 0, duration: 0.7, ease: "back.out(1.6)" })
          .from(el.querySelector(".conquista-icone"), { scale: 0, rotate: -20, duration: 0.35, ease: "steps(4)" }, "-=0.35")
          .fromTo(el.querySelector(".conquista-brilho"), { xPercent: -120 }, { xPercent: 260, duration: 0.9, ease: "power2.inOut" }, "-=0.2");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="eventos" className="overflow-x-clip bg-card px-[max(20px,4vw)] py-28 md:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="mb-6 font-pixel text-[11px] tracking-[0.2em] text-blue">FASE 5 · CONQUISTAS · {eventos.length}</p>
          <SplitReveal as="h2" className="font-serif text-[clamp(40px,6vw,88px)] leading-[1.08] tracking-[-0.02em]">
            Conquistas <em className="text-blue">desbloqueadas</em>
          </SplitReveal>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-mute">
            Eventos, prêmios e workshops. Cada um deixou alguma coisa no inventário.
          </p>
        </div>

        <ol className="flex flex-col gap-5">
          {eventos.map((e) => (
            <li
              key={e.slug}
              className="conquista relative grid grid-cols-[56px_1fr] items-center gap-5 overflow-hidden rounded-[10px] border-[3px] border-ink bg-paper p-5 shadow-[5px_5px_0_var(--color-ink)]"
            >
              {/* Faixa de brilho que atravessa o cartão uma vez */}
              <span
                aria-hidden
                className="conquista-brilho pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />
              <span
                className={`conquista-icone relative h-14 w-14 rounded-[6px] border-2 border-ink p-1.5 ${e.premio ? "bg-xp-soft" : "bg-baby-soft"}`}
              >
                <IconePixel desenho={e.premio ? TROFEU : MEDALHA} />
              </span>
              <div className="relative">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-pixel text-[10px] tracking-wider text-mute">
                  <span className={e.premio ? "text-[#8a6100]" : "text-blue"}>
                    {e.premio ? `★ ${e.premio.toUpperCase()}` : "CONQUISTA DESBLOQUEADA"}
                  </span>
                  <span>{fmt(e.data).toUpperCase()}</span>
                  <span>{e.papel.toUpperCase()}</span>
                </p>
                <h3 className="mt-2 font-serif text-[clamp(22px,2.4vw,32px)] leading-tight">{e.nome}</h3>
                <p className="mt-1 text-mute">{e.descricao}</p>
              </div>
            </li>
          ))}
          <li className="grid grid-cols-[56px_1fr] items-center gap-5 rounded-[10px] border-[3px] border-dashed border-mute/60 p-5">
            <span aria-hidden className="grid h-14 w-14 place-items-center rounded-[6px] border-2 border-dashed border-mute/60 font-pixel text-mute">
              ?
            </span>
            <p className="font-pixel text-[10px] tracking-wider text-mute">PRÓXIMA CONQUISTA: BLOQUEADA</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
