// Raio em SVG. O brilho vem de três traços sobrepostos (halo largo e transparente, meio azul,
// núcleo branco), em vez de filter: blur, para piscar sem custo de desenho.
// A animação (piscar e sumir) fica com quem usa o componente.

const CAMINHOS = {
  a: "M60 0 L44 70 L64 74 L36 150 L58 154 L22 260 M44 70 L20 96 M36 150 L12 170",
  b: "M50 0 L62 60 L42 66 L58 130 L34 138 L48 220 M62 60 L80 84 M58 130 L76 150",
  c: "M40 0 L30 50 L46 56 L26 120 L38 124 L22 180",
} as const;

export function Raio({ className, variante = "a" }: { className?: string; variante?: keyof typeof CAMINHOS }) {
  const d = CAMINHOS[variante];
  return (
    <svg
      viewBox="0 0 90 260"
      preserveAspectRatio="xMidYMin meet"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} stroke="#5aa9ff" strokeOpacity="0.18" strokeWidth="14" />
      <path d={d} stroke="#a9d6f5" strokeOpacity="0.55" strokeWidth="5" />
      <path d={d} stroke="#ffffff" strokeWidth="1.6" />
    </svg>
  );
}
