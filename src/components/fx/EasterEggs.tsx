"use client";

// Easter eggs para quem é da área:
// 1) Mensagem em ASCII no console do navegador (para quem abre o DevTools).
// 2) Código Konami (↑ ↑ ↓ ↓ ← → ← → B A): chuva de pixels azuis e uma "conquista desbloqueada".
import { useEffect, useRef, useState } from "react";
import { perfil } from "@/content/perfil";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function chuvaDePixels(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const cores = ["#a9d6f5", "#2462a6", "#e4f2fc", "#0f1b2a"];
  const px = Array.from({ length: 160 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -Math.random() * window.innerHeight * 0.6,
    v: 3 + Math.random() * 5,
    s: 6 + Math.round(Math.random() * 3) * 3,
    c: cores[(Math.random() * cores.length) | 0],
  }));
  const inicio = performance.now();
  const frame = (t: number) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    px.forEach((p) => {
      p.y += p.v;
      ctx.fillStyle = p.c;
      ctx.fillRect(Math.round(p.x / 3) * 3, Math.round(p.y / 3) * 3, p.s, p.s);
    });
    if (t - inicio < 3200) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };
  requestAnimationFrame(frame);
}

export function EasterEggs() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [conquista, setConquista] = useState(false);

  useEffect(() => {
    console.log(
      "%c\n  ┌─────────────────────────────┐\n  │  olá, dev curioso 👋         │\n  │  gostou do código? fala aí: │\n  └─────────────────────────────┘\n",
      "color:#2462a6;font-family:monospace;font-size:12px",
    );
    console.log(`%c${perfil.email}  ·  ${perfil.links.github}`, "color:#5b6979;font-family:monospace");

    let pos = 0;
    let timer = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        if (canvas.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) chuvaDePixels(canvas.current);
        setConquista(true);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => setConquista(false), 4000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />
      <div
        role="status"
        className={`fixed bottom-6 left-1/2 z-[71] flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-line bg-card px-5 py-4 shadow-[0_30px_60px_-20px_rgba(15,27,42,.4)] transition-all duration-500 ease-[var(--ease-cine)] ${
          conquista ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-baby text-xl">🏆</span>
        <span>
          <span className="block font-mono text-[11px] tracking-[0.12em] text-blue uppercase">Conquista desbloqueada</span>
          <span className="font-serif text-lg">Dev curioso: você achou o código Konami</span>
        </span>
      </div>
    </>
  );
}
