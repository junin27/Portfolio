"use client";

// CONTATO: bloco escuro com título grande em serifa, e-mail com botão de copiar magnético,
// relógio local e um rodapé com cara de saída de terminal ("exit 0") e uma dica do easter egg.
import { useEffect, useRef, useState } from "react";
import { perfil } from "@/content/perfil";
import { Magnetic } from "@/components/fx/Magnetic";
import { SplitReveal } from "@/components/fx/SplitReveal";

function Relogio() {
  const [hora, setHora] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" });
    const tick = () => setHora(f.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 15000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{hora}</span>;
}

export function Contato() {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<number>(0);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(perfil.email);
      setCopiado(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.location.href = `mailto:${perfil.email}`;
    }
  };

  return (
    <footer id="contato" className="relative overflow-hidden bg-night px-[max(20px,4vw)] pt-28 pb-10 text-paper md:pt-36">
      <div aria-hidden className="aura-a pointer-events-none absolute -right-40 -bottom-60 h-[760px] w-[760px] brilho-noite-forte" />
      <div className="relative mx-auto max-w-[1320px]">
        <p className="font-pixel text-[11px] tracking-[0.2em] text-baby">{"FASE FINAL · CONTATO"}</p>
        <SplitReveal as="h2" className="mt-6 font-serif text-[clamp(52px,10vw,168px)] leading-[0.92] tracking-[-0.03em]">
          Vamos <em className="text-baby">conversar?</em>
        </SplitReveal>
        <p className="mt-8 max-w-[48ch] text-lg text-paper/70">
          Vagas, projetos freelance ou parcerias de pesquisa. Me conte o que você precisa: respondo rápido.
        </p>

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={copiar}
              className="group flex items-center gap-4 rounded-full bg-paper py-4 pr-4 pl-7 text-ink transition-shadow hover:shadow-[0_0_0_6px_rgba(169,214,245,.25)]"
            >
              <span className="font-serif text-[clamp(20px,2.4vw,30px)]">{perfil.email}</span>
              <span className="rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] text-paper">{copiado ? "copiado ✓" : "copiar"}</span>
            </button>
          </Magnetic>
          <div className="flex gap-6 font-mono text-[13px] text-paper/70">
            {Object.entries(perfil.links).map(([nome, href]) => (
              <a key={nome} href={href} target="_blank" rel="noreferrer" className="transition-colors hover:text-baby">
                {nome} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="mt-28 flex flex-wrap justify-between gap-4 border-t border-paper/15 pt-6 font-mono text-[12px] text-paper/50">
          <span>
            {perfil.cidade} · <Relogio /> BRT
          </span>
          <span className="hidden sm:inline">psst: ↑ ↑ ↓ ↓ ← → ← → B A</span>
          <span>
            © 2026 · feito com Next.js e GSAP · <span className="text-baby">exit 0</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
