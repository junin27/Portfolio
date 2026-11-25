"use client";

// EM AÇÃO: os projetos mostrados no aparelho certo.
// App → celular passando as telas. Site → monitor rolando a página.
// Os aparelhos sobem com leve parallax ao rolar; o texto revela por linhas.
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { projetos } from "@/content/projetos";
import { Phone } from "@/components/devices/Phone";
import { Monitor } from "@/components/devices/Monitor";
import { SplitReveal } from "@/components/fx/SplitReveal";
import type { Projeto } from "@/content/types";

function Texto({ p, n }: { p: Projeto; n: string }) {
  return (
    <div className="flex max-w-[44ch] flex-col gap-5">
      <span className="font-mono text-[12px] text-mute">
        <span className="text-blue">{n}</span> · {p.categoria === "mobile" ? "app mobile" : "web"} · {p.ano}
      </span>
      <SplitReveal as="h3" className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] tracking-[-0.01em]">
        {p.titulo}
      </SplitReveal>
      <p className="text-lg leading-relaxed text-mute">{p.resumo}</p>
      <ul className="flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <li key={s} className="rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px]">
            {s}
          </li>
        ))}
      </ul>
      <Link href={`/projetos/${p.slug}`} className="group mt-2 inline-flex items-center gap-2 self-start text-sm font-medium">
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
          Ler o case completo
        </span>
        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

export function EmAcao() {
  const root = useRef<HTMLElement>(null);
  const app = projetos.find((p) => p.categoria === "mobile");
  const site = projetos.find((p) => p.categoria === "web");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".device").forEach((d) => {
        gsap.fromTo(
          d,
          { y: 80, rotate: d.dataset.tilt === "l" ? -4 : 4 },
          { y: -40, rotate: 0, ease: "none", scrollTrigger: { trigger: d, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="em-acao" className="relative overflow-hidden bg-card px-[max(20px,4vw)] py-28 md:py-36">
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-40 h-[520px] w-[520px] rounded-full bg-baby-soft blur-[80px]" />
      <div className="relative mx-auto max-w-[1320px]">
        <p className="code-comment mb-6">{"// 02 — em ação"}</p>
        <SplitReveal as="h2" className="max-w-[18ch] font-serif text-[clamp(40px,6vw,88px)] leading-[1.08] tracking-[-0.02em]">
          Ver funcionando vale mais que <em className="text-blue">mil READMEs</em>
        </SplitReveal>

        {app && (
          <div className="mt-24 grid items-center gap-16 md:grid-cols-2">
            <Texto p={app} n="app.tsx" />
            <div className="device flex justify-center" data-tilt="r">
              <Phone telas={app.telas} titulo={app.titulo} />
            </div>
          </div>
        )}

        {site && (
          <div className="mt-32 grid items-center gap-16 md:grid-cols-[1.3fr_1fr]">
            <div className="device order-2 flex justify-center md:order-1" data-tilt="l">
              <Monitor url={site.demo ?? "https://seu-projeto.vercel.app"} captura={site.captura} titulo={site.titulo} />
            </div>
            <div className="order-1 md:order-2">
              <Texto p={site} n="site.tsx" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
