"use client";

// SOBRE
// - Manifesto em serifa: as palavras "acendem" conforme você rola (sem prender a tela).
// - Stack com alternância "visual" ↔ "package.json" (a mesma informação vista como código).
// - Experiência profissional.
import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { perfil } from "@/content/perfil";
import { experiencias } from "@/content/eventos";

function PackageJson() {
  const entradas = Object.entries(perfil.stack);
  return (
    <pre className="overflow-x-auto rounded-2xl bg-night p-6 font-mono text-[13px] leading-relaxed text-[#c9d6e3]">
      <code>
        {"{\n"}
        {"  "}
        <span className="text-baby">&quot;name&quot;</span>: <span className="text-[#f9c78b]">&quot;{perfil.nome}&quot;</span>,{"\n"}
        {"  "}
        <span className="text-baby">&quot;version&quot;</span>: <span className="text-[#f9c78b]">&quot;2026.0.0&quot;</span>,{"\n"}
        {"  "}
        <span className="text-baby">&quot;dependencies&quot;</span>: {"{\n"}
        {entradas.map(([grupo, itens], gi) => (
          <span key={grupo}>
            {"    "}
            <span className="text-[#7d8fa3]">{`// ${grupo}`}</span>
            {"\n"}
            {itens.map((it, ii) => (
              <span key={it}>
                {"    "}
                <span className="text-baby">&quot;{it.toLowerCase().replace(/[^a-z0-9.+#-]+/g, "-")}&quot;</span>:{" "}
                <span className="text-[#a8e3b5]">&quot;^{(ii % 3) + 1}.0.0&quot;</span>
                {gi === entradas.length - 1 && ii === itens.length - 1 ? "" : ","}
                {"\n"}
              </span>
            ))}
          </span>
        ))}
        {"  }\n}"}
      </code>
    </pre>
  );
}

export function Sobre() {
  const root = useRef<HTMLElement>(null);
  const [modo, setModo] = useState<"visual" | "json">("visual");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(".mf-text", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.15 },
        { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".mf-text", start: "top 80%", end: "bottom 45%", scrub: 0.5 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sobre" className="px-[max(20px,4vw)] py-28 md:py-36">
      <div className="mx-auto max-w-[1320px]">
        <p className="code-comment mb-10">{"FASE 6 · SOBRE"}</p>
        <p className="mf-text max-w-[28ch] font-serif text-[clamp(30px,4.4vw,64px)] leading-[1.1] tracking-[-0.01em]">
          {perfil.manifesto}
        </p>

        <div className="mt-28 flex flex-wrap items-end justify-between gap-6">
          <h3 className="font-serif text-[clamp(30px,3.6vw,48px)] leading-none">Inventário</h3>
          <div className="flex rounded-full border border-line bg-card p-1 font-mono text-[12px]" role="group" aria-label="Formato do inventário">
            {(["visual", "json"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={modo === m}
                onClick={() => setModo(m)}
                className={`rounded-full px-4 py-1.5 transition-colors ${modo === m ? "bg-ink text-paper" : "text-mute hover:text-ink"}`}
              >
                {m === "visual" ? "cartões" : "lista técnica"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {modo === "visual" ? (
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(perfil.stack).map(([grupo, itens]) => (
                <div key={grupo} className="group bg-card p-7 transition-colors duration-500 hover:bg-baby-soft">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-blue uppercase">{grupo}</p>
                  <ul className="mt-4 flex flex-col gap-1">
                    {itens.map((it) => (
                      <li key={it} className="font-serif text-2xl transition-transform duration-500 group-hover:translate-x-1">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <PackageJson />
          )}
        </div>

        <div className="mt-28 grid gap-10 border-t border-ink pt-10 md:grid-cols-[1fr_2fr]">
          <h3 className="font-serif text-[clamp(30px,3.6vw,48px)] leading-none">Experiência</h3>
          <div className="flex flex-col gap-12">
            {experiencias.map((x) => (
              <article key={x.empresa + x.inicio}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h4 className="font-serif text-3xl">{x.cargo}</h4>
                  <span className="font-mono text-[12px] text-mute">
                    {x.empresa} · {x.inicio.slice(0, 4)}–{x.fim ? x.fim.slice(0, 4) : "hoje"}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 text-mute">
                  {[...x.entregas, ...(x.treinamentos ?? [])].map((e) => (
                    <li key={e} className="flex gap-3">
                      <span className="font-mono text-blue">+</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
