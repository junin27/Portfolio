"use client";

// Texto que "decodifica" ao passar o mouse (letras viram símbolos de código e voltam).
// Referência nerd discreta, usada nos links do menu e nos rótulos.
import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Tween simples disparado pelo evento: não cria ScrollTrigger, então não precisa de limpeza
  const play = () => {
    if (prefersReducedMotion() || !ref.current) return;
    gsap.to(ref.current, {
      duration: 0.5,
      scrambleText: { text, chars: "01{}<>/_#", speed: 0.7, revealDelay: 0.1 },
      overwrite: true,
    });
  };

  return (
    <span ref={ref} onPointerEnter={play} onFocus={play} className={className}>
      {text}
    </span>
  );
}
