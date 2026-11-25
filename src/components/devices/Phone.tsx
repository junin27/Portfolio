"use client";

// Celular que passa pelas telas do app sozinho (pausa fora da tela e ao passar o mouse).
// Se o projeto tiver `telas` (imagens em /public), mostra as imagens; senão, telas de exemplo.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

function TelaExemplo({ n }: { n: number }) {
  const base = "flex h-full flex-col gap-2.5 px-3.5 pt-10 pb-4 text-[11px] text-ink";
  if (n === 0)
    return (
      <div className={base}>
        <p className="font-serif text-lg">Olá, Ana</p>
        <div className="rounded-xl bg-baby-soft p-3">
          <p className="text-mute">Entregas da semana</p>
          <p className="font-serif text-3xl text-blue">128</p>
          <div className="mt-2 flex h-12 items-end gap-1.5">
            {[40, 70, 55, 90, 65, 80].map((h, i) => (
              <i key={i} className="flex-1 rounded-sm bg-blue/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        {["Rota norte", "Rota sul", "Centro"].map((r) => (
          <div key={r} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
            {r}
            <span className="h-2 w-2 rounded-full bg-[#3fb27f]" />
          </div>
        ))}
      </div>
    );
  if (n === 1)
    return (
      <div className={base}>
        <p className="font-serif text-lg">Mapa</p>
        <div className="relative flex-1 rounded-xl bg-baby-soft [background-image:linear-gradient(#cfe3f3_1px,transparent_1px),linear-gradient(90deg,#cfe3f3_1px,transparent_1px)] [background-size:18px_18px]">
          {[
            [25, 30],
            [62, 48],
            [40, 72],
          ].map(([x, y]) => (
            <i key={x} className="absolute h-3 w-3 -rotate-45 rounded-[50%_50%_50%_0] bg-blue" style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </div>
        <div className="rounded-lg border border-line px-3 py-2">3 pontos próximos</div>
      </div>
    );
  if (n === 2)
    return (
      <div className={base}>
        <p className="font-serif text-lg">Tarefas</p>
        <span className="self-start rounded-full bg-baby px-2 py-1 font-mono text-[9px]">offline ✓ sincroniza depois</span>
        {["Coletar amostra", "Foto do local", "Enviar relatório", "Revisar dados"].map((t, i) => (
          <label key={t} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
            <i className={`h-3 w-3 rounded-[3px] border border-blue ${i < 2 ? "bg-blue" : ""}`} />
            {t}
          </label>
        ))}
      </div>
    );
  return (
    <div className={base}>
      <p className="font-serif text-lg">Perfil</p>
      <div className="mx-auto mt-2 h-16 w-16 rounded-full bg-gradient-to-br from-baby to-blue" />
      {["Modo escuro", "Notificações", "Sincronizar"].map((t) => (
        <div key={t} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
          {t}
          <span className="relative h-4 w-7 rounded-full bg-blue after:absolute after:top-0.5 after:right-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white" />
        </div>
      ))}
    </div>
  );
}

export function Phone({ telas, titulo }: { telas?: string[]; titulo: string }) {
  const total = telas?.length || 4;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || prefersReducedMotion()) return;
    const id = setInterval(() => setI((v) => (v + 1) % total), 2600);
    return () => clearInterval(id);
  }, [visible, paused, total]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        className="relative aspect-[9/19] w-[min(260px,70vw)] rounded-[44px] bg-ink p-2.5 shadow-[0_40px_80px_-30px_rgba(15,27,42,.45),inset_0_0_0_1.5px_#2a3b50]"
      >
        <div className="absolute top-5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        <div className="h-full overflow-hidden rounded-[36px] bg-card">
          <div
            className="flex h-full transition-transform duration-700 ease-[var(--ease-cine)]"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {Array.from({ length: total }, (_, n) => (
              <div key={n} className="relative h-full w-full shrink-0" aria-hidden={n !== i}>
                {telas?.[n] ? (
                  <Image src={telas[n]} alt={`${titulo}: tela ${n + 1}`} fill sizes="260px" className="object-cover" />
                ) : (
                  <TelaExemplo n={n} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1.5" role="tablist" aria-label="Telas do app">
        {Array.from({ length: total }, (_, n) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`Tela ${n + 1}`}
            onClick={() => setI(n)}
            className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-6 bg-blue" : "w-1.5 bg-ink/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
