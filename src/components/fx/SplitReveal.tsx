"use client";

// Revelação de texto por linhas: cada linha sobe de dentro de uma máscara quando entra na tela.
import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  /** true = anima assim que carrega (para o topo da página) */
  immediate?: boolean;
};

export function SplitReveal({ as = "div", className, children, delay = 0, immediate = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.1,
            stagger: 0.08,
            delay,
            ease: "expo.out",
            scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 88%", once: true },
          }),
      });
    },
    { scope: ref },
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
