"use client";

// Ponto único de importação do GSAP: registra os plugins uma vez só.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

// Curvas do site: "out" para revelações (desacelera suave), "cine" para trocas.
gsap.defaults({ ease: "power3.out" });

// No celular, a barra de endereço some e aparece ao rolar e muda a altura da tela; sem isto o
// ScrollTrigger recalcula tudo a cada vez (engasgo). Os pins usam svh, que já não depende disso.
ScrollTrigger.config({ ignoreMobileResize: true });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
