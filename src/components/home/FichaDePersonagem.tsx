"use client";

// FICHA DE PERSONAGEM (momento-assinatura), na "noite azul" que o hero acabou de abrir.
// Computador: a seção fica presa (pin) e a rolagem "joga" o personagem: o retrato em pixel art
// se dissolve e revela a foto real, o nível sobe, as barras de neon enchem, o XP carrega e
// aparece "LEVEL UP!". Tudo em scrub: rolar para cima desfaz.
// Celular: a ficha é mais alta que a tela, então NÃO prende; a mesma sequência toca uma vez
// quando a ficha entra na tela (prender conteúdo maior que a tela esconde parte dele).
// Desempenho: só transform e opacity; o brilho neon é sombra estática, nunca animada.
// Movimento reduzido: a ficha já aparece completa.
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ficha } from "@/content/ficha";
import { perfil } from "@/content/perfil";

// Retrato em pixel art (12×12), desenhado com retângulos SVG. "." = vazio.
const RETRATO = [
  "....aaaa....",
  "...aaaaaa...",
  "..aappppaa..",
  "..apepepa...",
  "..appppppa..",
  "...pppppp...",
  "....pmmp....",
  "..bbbbbbbb..",
  ".bbbwbbwbbb.",
  ".bbbbbbbbbb.",
  ".pbbbbbbbbp.",
  "..bb....bb..",
];
const CORES: Record<string, string> = {
  a: "#0f1b2a", // cabelo
  p: "#c99a74", // pele
  e: "#0f1b2a", // olhos
  m: "#8f5a4f", // boca
  b: "#2462a6", // roupa
  w: "#a9d6f5", // detalhe
};

function Retrato() {
  return (
    <svg viewBox="0 0 12 12" className="h-full w-full [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden>
      {RETRATO.flatMap((linha, y) =>
        [...linha].map((c, x) => (c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={CORES[c]} />)),
      )}
    </svg>
  );
}

export function FichaDePersonagem() {
  const root = useRef<HTMLElement>(null);
  const nivel = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // A mesma sequência serve aos dois modos; só muda quem a dirige (rolagem ou tempo).
      const montarJogo = (jogo: gsap.core.Timeline) => {
        const contador = { n: 1 };
        jogo
          .from(".ficha-card", { y: 60, autoAlpha: 0, duration: 0.4, ease: "power2.out" })
          .to(
            contador,
            {
              n: ficha.nivel,
              duration: 1.6,
              onUpdate: () => {
                if (nivel.current) nivel.current.textContent = String(Math.round(contador.n));
              },
            },
            0.2,
          )
          // Barras enchem uma depois da outra a partir da esquerda
          .from(".barra-valor", { scaleX: 0, duration: 0.5, stagger: 0.2 }, 0.3)
          .from(".atributo", { autoAlpha: 0.25, duration: 0.3, stagger: 0.2 }, 0.3)
          .from(".xp-valor", { scaleX: 0, duration: 1 }, 0.6)
          // Retrato: o sprite some em degraus e a foto entra crescendo de leve (sem blur)
          .fromTo(".retrato-pixel", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: "steps(5)" }, 0.9)
          .from(".retrato-foto", { autoAlpha: 0, scale: 1.15, duration: 0.6 }, 0.9)
          // LEVEL UP!: entra com um "pulo" de cartucho (steps dá o ar de jogo antigo)
          .fromTo(".level-up", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "steps(4)" }, 1.85);
        return jogo;
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        montarJogo(
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=120%", scrub: 0.5, pin: true },
          }),
        ).to({}, { duration: 0.3 }); // respiro antes de soltar a tela
      });
      mm.add("(max-width: 1023px)", () => {
        montarJogo(
          gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          }),
        );
      });
    },
    { scope: root },
  );

  const xpPorcento = Math.round((ficha.xpAtual / ficha.xpProximoNivel) * 100);

  return (
    <section
      ref={root}
      id="ficha"
      aria-labelledby="ficha-titulo"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-night px-[max(20px,4vw)] py-20 text-paper lg:py-24"
    >
      {/* Continuação da noite do hero: brilho azul e névoa parada no rodapé (gradientes, sem filter) */}
      <div aria-hidden className="brilho-noite pointer-events-none absolute inset-0" />
      <div aria-hidden className="fumaca pointer-events-none absolute right-[-10%] bottom-[-20%] left-[-10%] h-[45%]" />

      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="ficha-card neon-borda relative rounded-[10px] border-2 bg-[#0d1d30] p-5 md:p-8">
          <p className="font-pixel text-[11px] tracking-[0.2em] text-baby">FICHA DO PERSONAGEM</p>
          <div className="mt-5 flex items-center gap-5 md:mt-6 md:gap-6">
            <div className="neon-borda relative h-24 w-24 shrink-0 overflow-hidden rounded-[6px] border-2 bg-night md:h-36 md:w-36">
              <Image src="/foto.png" alt={`Foto de ${perfil.nome}`} fill sizes="144px" className="retrato-foto object-cover" />
              {/* Sprite em pixel art por cima; invisível sem JavaScript ou com movimento reduzido */}
              <div className="retrato-pixel invisible absolute inset-0 bg-baby p-2">
                <Retrato />
              </div>
            </div>
            <div>
              <h2 id="ficha-titulo" className="font-serif text-[clamp(26px,3.4vw,44px)] leading-tight">
                {perfil.nome}
              </h2>
              <p className="mt-1 text-sm text-paper/70 md:text-base">
                Classe: <span className="text-paper">{ficha.classe}</span> · {ficha.subclasse}
              </p>
              <p className="mt-1 text-[12px] text-paper/60 md:text-[13px]">Guilda: {ficha.guilda}</p>
              <p className="mt-3 font-pixel text-[13px] md:mt-4 md:text-[14px]">
                NÍVEL{" "}
                <span ref={nivel} className="text-neon text-[26px] md:text-[28px]">
                  {ficha.nivel}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <p className="flex justify-between font-pixel text-[10px] tracking-wider text-paper/60">
              <span>XP</span>
              <span>
                {ficha.xpAtual.toLocaleString("pt-BR")}/{ficha.xpProximoNivel.toLocaleString("pt-BR")}
              </span>
            </p>
            <div
              className="mt-2 h-4 overflow-hidden rounded-[3px] border-2 border-baby/50 bg-night"
              role="meter"
              aria-label="Experiência"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={xpPorcento}
            >
              <div className="xp-valor h-full origin-left bg-xp shadow-[0_0_10px_rgba(242,193,78,.7)]" style={{ width: `${xpPorcento}%` }} />
            </div>
          </div>

          <p
            aria-hidden
            className="level-up invisible absolute -top-5 -right-2 rotate-6 rounded-[4px] border-2 border-ink bg-xp px-3 py-2 font-pixel text-[13px] text-ink shadow-[0_0_18px_rgba(242,193,78,.6)] md:text-[14px]"
          >
            LEVEL UP!
          </p>
        </div>

        <div>
          <p className="font-pixel text-[11px] tracking-[0.2em] text-baby">ATRIBUTOS</p>
          <p className="mt-3 max-w-[44ch] font-serif text-[clamp(24px,3vw,40px)] leading-tight">
            O que eu sei fazer, medido como num <em className="text-neon">jogo</em>.
          </p>
          <ul className="mt-8 flex flex-col gap-4 md:mt-10 md:gap-5">
            {ficha.atributos.map((a) => (
              <li key={a.nome} className="atributo grid grid-cols-[minmax(0,1.1fr)_2fr_auto] items-center gap-3 md:gap-4">
                <span>
                  <span className="block font-pixel text-[11px] tracking-wider text-baby md:text-[12px]">{a.nome.toUpperCase()}</span>
                  <span className="text-[13px] text-paper/70 md:text-sm">{a.area}</span>
                </span>
                <span
                  className="h-3 overflow-hidden rounded-[2px] border border-baby/40 bg-[#0d1d30]"
                  role="meter"
                  aria-label={`${a.nome} (${a.area})`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={a.valor}
                >
                  <span className="barra-valor neon-barra block h-full origin-left" style={{ width: `${a.valor}%` }} />
                </span>
                <span className="w-7 text-right font-pixel text-[11px] md:text-[12px]">{a.valor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
