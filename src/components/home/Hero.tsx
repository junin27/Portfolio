"use client";

// HERO "New Game+"
// - Base elegante: papel claro, título serifado, brilho azul bebê respirando.
// - Momento cinematográfico: ao rolar, a seção fica presa (pin), o título avança para a câmera
//   e o papel escurece até a "noite azul": cai um raio, a névoa sobe e o letreiro de neon
//   "FASE 1 · PERSONAGEM" acende. Enquanto a noite está na tela, raios caem de tempos em tempos.
// DESEMPENHO (nada pode travar no aparelho de quem visita):
// - Só animamos transform e opacity (a placa de vídeo faz isso sem redesenhar a página).
// - Nenhum filter: blur(); brilhos e névoa são gradientes radiais, já "desfocados" de nascença.
// - A tempestade só roda enquanto a noite está visível; fora dela fica pausada.
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { perfil } from "@/content/perfil";
import { eventos } from "@/content/eventos";
import { Magnetic } from "@/components/fx/Magnetic";
import { Raio } from "@/components/fx/Raio";

// Valores de exemplo do "save"; a ficha de personagem usa o mesmo nível.
export const NIVEL_DO_PERSONAGEM = 24;
const conquistas = eventos.length;
// A partir de que ponto da cena presa (0 a 1) a noite está na tela e a tempestade pode rodar.
const INICIO_DA_NOITE = 0.55;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".rot-word");
      gsap.set(words.slice(1), { autoAlpha: 0, yPercent: 60 });
      if (prefersReducedMotion()) return;

      // Entrada: curta para o conteúdo aparecer logo
      gsap
        .timeline()
        .from(".hero-line", { yPercent: 115, duration: 0.9, stagger: 0.08, ease: "expo.out" })
        .from(".hero-fade", { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.06 }, "-=0.6");

      // Palavra em itálico que troca (só opacity e posição)
      const rot = gsap.timeline({ repeat: -1, delay: 1.6 });
      words.forEach((w, i) => {
        const next = words[(i + 1) % words.length];
        rot
          .to(w, { autoAlpha: 0, yPercent: -60, duration: 0.45, ease: "power2.in" }, "+=1.8")
          .fromTo(
            next,
            { autoAlpha: 0, yPercent: 60 },
            { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: "expo.out", immediateRender: false },
            "-=0.1",
          );
      });

      // PRESS START piscando em degraus, como num fliperama
      gsap.to(".press-start", { autoAlpha: 0.15, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });

      // Tempestade: um raio aleatório + clarão. Começa pausada; a cena presa liga e desliga.
      const tempestade = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.2 });
      tempestade
        .call(() => {
          const raios = gsap.utils.toArray<HTMLElement>(".raio");
          const raio = raios[Math.floor(Math.random() * raios.length)];
          gsap
            .timeline()
            .set(raio, { autoAlpha: 0 })
            .to(raio, { autoAlpha: 1, duration: 0.05, repeat: 3, yoyo: true, ease: "steps(1)" })
            .to(raio, { autoAlpha: 0, duration: 0.4 });
        })
        .fromTo(".clarao", { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 0.06, repeat: 1, yoyo: true, ease: "steps(1)" })
        .to({}, { duration: 1 });

      // Celular: cena mais curta, para não exigir muita rolagem com o dedo
      const mm = gsap.matchMedia();
      mm.add({ celular: "(max-width: 767px)", desktop: "(min-width: 768px)" }, (ctx) => {
        const { celular } = ctx.conditions as { celular: boolean };
        const cena = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: celular ? "+=55%" : "+=90%",
            scrub: 0.6,
            pin: true,
            onUpdate: (self) => {
              if (self.progress > INICIO_DA_NOITE) tempestade.play();
              else tempestade.pause(0);
            },
            onLeave: () => tempestade.pause(),
            onEnterBack: () => tempestade.play(),
          },
        });
        cena
          .to(".hero-titulo", { scale: 1.3, yPercent: -12, autoAlpha: 0 }, 0)
          .to(".hero-resto", { yPercent: 40, autoAlpha: 0 }, 0)
          .to(".hero-save", { yPercent: -60, autoAlpha: 0 }, 0)
          .to(".press-start-wrap", { autoAlpha: 0, y: 20 }, 0)
          .to(".aura", { scale: 1.6, xPercent: -20 }, 0)
          // O papel escurece até a noite azul
          .fromTo(".noite", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.2)
          .fromTo(".nevoa", { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 0.35)
          // Primeiro raio, preso à rolagem: desce na hora em que a noite fecha
          .fromTo(".raio-principal", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, ease: "steps(1)" }, 0.55)
          .fromTo(".clarao", { autoAlpha: 0 }, { autoAlpha: 0.4, duration: 0.03, ease: "steps(1)" }, 0.55)
          .to(".clarao", { autoAlpha: 0, duration: 0.08 }, 0.58)
          // Letreiro de neon acende piscando
          .fromTo(".neon-fase", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: "steps(5)" }, 0.6);
        return () => tempestade.pause();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-[max(20px,4vw)] pt-28 pb-16"
    >
      {/* Brilho azul bebê: gradientes radiais, sem filter (leve para animar) */}
      <div
        aria-hidden
        className="aura pointer-events-none absolute -top-60 right-[-15%] h-[900px] w-[900px] max-w-[140%] will-change-transform"
      >
        <div className="aura-a brilho-baby absolute inset-0" />
        <div className="aura-b brilho-claro absolute top-1/3 left-[-25%] h-2/3 w-2/3" />
      </div>
      {/* Grade fina de papel milimetrado, discreta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_20%,black,transparent_70%)]"
      />

      {/* NOITE AZUL: camadas que só aparecem na cena presa (invisíveis sem JS e com movimento reduzido) */}
      <div aria-hidden className="noite invisible pointer-events-none absolute inset-0 bg-night">
        <div className="brilho-noite absolute inset-0" />
      </div>
      <div aria-hidden className="nevoa invisible pointer-events-none absolute inset-x-[-20%] bottom-[-10%] h-[55%]">
        <div className="fumaca fumaca-a absolute bottom-0 left-[5%] h-full w-[55%]" />
        <div className="fumaca fumaca-b absolute bottom-[-10%] left-[35%] h-[90%] w-[60%]" />
        <div className="fumaca fumaca-c absolute right-0 bottom-[5%] h-[80%] w-[45%]" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Raio className="raio raio-principal invisible absolute top-0 left-[14%] h-[78%] w-[18%] md:left-[22%]" />
        <Raio className="raio invisible absolute top-0 right-[10%] h-[62%] w-[14%] -scale-x-100" variante="b" />
        <Raio className="raio invisible absolute top-0 left-[55%] h-[48%] w-[11%]" variante="c" />
      </div>
      <div aria-hidden className="clarao invisible pointer-events-none absolute inset-0 bg-[#cfe8ff]" />
      <p
        aria-hidden
        className="neon-fase invisible pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 text-center font-pixel text-[clamp(14px,2.8vw,30px)] tracking-[0.12em] text-neon"
      >
        FASE 1 · PERSONAGEM
      </p>

      <div className="relative mx-auto w-full max-w-[1320px]">
        {/* Chip de save file: a referência de jogo fica nos detalhes */}
        <p className="hero-fade hero-save mb-8 inline-flex items-center gap-3 rounded-[6px] border-2 border-ink bg-card px-3 py-2 font-pixel text-[11px] leading-none tracking-wider shadow-[3px_3px_0_var(--color-ink)]">
          <span className="text-blue">SAVE 01</span>
          <span aria-hidden>·</span>
          <span>NV {NIVEL_DO_PERSONAGEM}</span>
          <span aria-hidden>·</span>
          <span className="text-[#8a6100]">★ {conquistas} conquistas</span>
        </p>

        <h1 className="hero-titulo origin-[30%_50%] font-serif text-[clamp(48px,9vw,148px)] leading-[0.96] tracking-[-0.025em] text-balance will-change-transform">
          <span className="sr-only">
            {perfil.nome}: construo {perfil.rotativas.join(", ")} e pesquiso como fazê-los melhor.
          </span>
          {/* Cada linha sobe de dentro de uma máscara (overflow-hidden) */}
          <span aria-hidden className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <span className="hero-line block">
              Construo{" "}
              <span className="relative inline-grid align-baseline">
                {perfil.rotativas.map((w) => (
                  <em key={w} className="rot-word col-start-1 row-start-1 whitespace-nowrap text-blue">
                    {w.toLowerCase()}
                  </em>
                ))}
              </span>
            </span>
          </span>
          <span aria-hidden className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <span className="hero-line block">e pesquiso como</span>
          </span>
          <span aria-hidden className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <span className="hero-line block">
              <em className="text-mute">fazê-los melhor.</em>
            </span>
          </span>
        </h1>

        <div className="hero-resto mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-[52ch] text-lg leading-relaxed text-mute">
            Sites, aplicativos e sistemas sob medida para empresas e profissionais, inclusive com inteligência
            artificial e mapas. Também faço pesquisa científica: artigos, revisões e um livro em andamento.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="#trabalhos"
                className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(36,98,166,.6)]"
              >
                Ver trabalhos <span aria-hidden>↓</span>
              </Link>
            </Magnetic>
            <Link
              href="#contato"
              className="rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium transition-colors hover:border-ink"
            >
              Entrar em contato
            </Link>
          </div>
        </div>
      </div>

      {/* Convite para rolar, em pixel */}
      <div className="press-start-wrap hero-fade absolute inset-x-0 bottom-8 flex justify-center">
        <p className="press-start font-pixel text-[12px] tracking-[0.25em] text-ink">▼ PRESS START ▼</p>
      </div>
    </section>
  );
}
