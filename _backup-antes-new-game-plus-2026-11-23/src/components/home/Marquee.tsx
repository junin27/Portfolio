// Faixa infinita com a stack, escrita como import de código. Pausa ao passar o mouse.
const itens = [
  "react", "typescript", "flutter", "kotlin", "spring-boot", "fastapi", "django", "nestjs",
  "postgresql", "postgis", "mongodb", "keras", "tdd", "openspec",
];

export function Marquee() {
  const row = itens.map((t) => (
    <span key={t} className="flex items-center gap-10">
      <span>
        <span className="text-blue">import</span> {t}
      </span>
      <span aria-hidden className="text-baby">
        ✦
      </span>
    </span>
  ));
  return (
    <div aria-hidden className="marquee overflow-hidden border-y border-line bg-card py-4">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-mono text-sm text-mute">
        {row}
        {row}
      </div>
    </div>
  );
}
