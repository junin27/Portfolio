// Faixa infinita com os serviços, separados por estrelas de fliperama. Pausa ao passar o mouse.
const itens = [
  "Sites", "Aplicativos", "Sistemas sob medida", "Inteligência artificial", "Mapas e dados geográficos",
  "Automação de tarefas", "Pesquisa científica", "Palestras e workshops",
];

export function Marquee() {
  const row = itens.map((t) => (
    <span key={t} className="flex items-center gap-10">
      <span>{t}</span>
      <span aria-hidden className="font-pixel text-xp">
        ★
      </span>
    </span>
  ));
  return (
    <div aria-hidden className="marquee overflow-hidden border-y border-line bg-card py-4">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-serif text-xl text-ink">
        {row}
        {row}
      </div>
    </div>
  );
}
