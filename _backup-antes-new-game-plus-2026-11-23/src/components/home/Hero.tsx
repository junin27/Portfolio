"use client";

// HERO
// - Aura azul bebê respirando ao fundo (CSS, só transform).
// - Título serifado sobe linha por linha; a palavra em itálico troca com desfoque (APIs → apps → ...).
// - Linha de terminal digitando "whoami" (referência nerd) e selos estilo GitHub ("build passing").
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { perfil } from "@/content/perfil";
import { Magnetic } from "@/components/fx/Magnetic";

const whoami = `${perfil.nome.toLowerCase().replace(/[[\]]/g, "")} · full-stack · mobile · ml · pesquisa`;

function Terminal() {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = setTimeout(() => setTxt(whoami), 0);
      return () => clearTimeout(t);
    }
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i++;
        setTxt(whoami.slice(0, i));
        if (i >= whoami.length) window.clearInterval(id);
      }, 32);
    }, 1400);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, []);
  return (
    <p className="hero-fade font-mono text-[13px] text-mute">
      <span className="text-blue">$</span> whoami
      <br />
      <span className="text-ink">{txt}</span>
      <span className="caret text-blue" />
    </p>
  );
}

function Badge({ k, v, tone = "ok" }: { k: string; v: string; tone?: "ok" | "info" }) {
  return (
    <span className="inline-flex overflow-hidden rounded-[4px] font-mono text-[11px] leading-none">
      <span className="bg-ink px-2 py-1.5 text-paper">{k}</span>
      <span className={`px-2 py-1.5 ${tone === "ok" ? "bg-[#3fb27f] text-white" : "bg-baby text-ink"}`}>{v}</span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".rot-word");
      gsap.set(words.slice(1), { autoAlpha: 0, yPercent: 60, filter: "blur(8px)" });
      if (prefersReducedMotion()) return;

      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .from(".hero-line", { yPercent: 115, duration: 1.3, stagger: 0.1, ease: "expo.out" })
        .from(".hero-fade", { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 }, "-=0.9")
        .from(".aura", { scale: 0.6, autoAlpha: 0, duration: 2, ease: "power2.out" }, 0);

      // Troca da palavra em itálico: sai subindo e desfocando, a próxima entra de baixo
      const rot = gsap.timeline({ repeat: -1, delay: 2.4 });
      words.forEach((w, i) => {
        const next = words[(i + 1) % words.length];
        rot
          .to(w, { autoAlpha: 0, yPercent: -60, filter: "blur(8px)", duration: 0.6, ease: "power2.in" }, "+=1.8")
          .fromTo(
            next,
            { autoAlpha: 0, yPercent: 60, filter: "blur(8px)" },
            { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out", immediateRender: false },
            "-=0.15",
          );
      });

      // Ao rolar, a aura sobe mais devagar que o texto (parallax leve)
      gsap.to(".aura", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden px-[max(20px,4vw)] pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Aura de fundo */}
      <div aria-hidden className="aura pointer-events-none absolute -top-40 right-[-10%] h-[680px] w-[680px] max-w-full">
        <div className="aura-a absolute inset-0 rounded-full bg-baby opacity-70 blur-[90px]" />
        <div className="aura-b absolute top-1/3 left-[-20%] h-2/3 w-2/3 rounded-full bg-[#cfe3ff] opacity-80 blur-[80px]" />
      </div>
      {/* Grade fina de "papel milimetrado", discreta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_20%,black,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1320px]">
        <p className="hero-fade code-comment mb-8">{"// engenharia de software · pesquisa"}</p>

        <h1 className="font-serif text-[clamp(44px,8vw,128px)] leading-[0.98] tracking-[-0.02em] text-balance">
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

        <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div className="flex flex-col gap-8">
            <p className="hero-fade max-w-[52ch] text-lg leading-relaxed text-mute">
              APIs em Spring Boot, apps em Flutter, modelos em Keras e plugins de geoprocessamento. Na outra metade do
              tempo, revisões sistemáticas, artigos e um livro em andamento.
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
          <div className="flex flex-col gap-5 md:items-end md:text-right">
            <Terminal />
            <div className="hero-fade flex flex-wrap gap-2 md:justify-end">
              <Badge k="build" v="passing" />
              <Badge k="status" v="disponível" tone="info" />
              <Badge k="tests" v="TDD ✓" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
