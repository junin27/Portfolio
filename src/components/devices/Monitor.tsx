// Monitor de computador mostrando o site, que rola sozinho (pausa no hover).
// Se o projeto tiver `captura` (print de página inteira em /public), mostra a imagem; senão, um site de exemplo.
import Image from "next/image";

function SiteExemplo() {
  return (
    <div className="flex flex-col gap-4 p-5 text-ink">
      <div className="flex items-center justify-between text-[11px]">
        <b className="font-serif text-sm">Painel.</b>
        <span className="flex gap-4 text-mute">
          <span>Início</span>
          <span>Recursos</span>
          <span>Preços</span>
        </span>
      </div>
      <p className="mt-6 max-w-[16ch] font-serif text-[clamp(22px,3vw,34px)] leading-[1.02]">
        Seus dados, <em className="text-blue">em tempo real.</em>
      </p>
      <div className="h-2 w-3/4 rounded bg-line" />
      <div className="h-2 w-1/2 rounded bg-line" />
      <span className="self-start rounded-full bg-ink px-3 py-1.5 text-[10px] text-paper">Começar →</span>
      <div className="mt-2 h-36 rounded-lg bg-gradient-to-br from-baby via-baby-soft to-[#cfe3ff]" />
      <div className="grid grid-cols-3 gap-2">
        {["Relatórios", "API", "Equipe"].map((t) => (
          <div key={t} className="h-20 rounded-lg border border-line p-2 text-[10px]">
            {t}
          </div>
        ))}
      </div>
      <div className="h-2 w-full rounded bg-line" />
      <div className="h-2 w-2/3 rounded bg-line" />
      <div className="h-32 rounded-lg bg-ink/90" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-24 rounded-lg bg-baby-soft" />
        <div className="h-24 rounded-lg bg-baby-soft" />
      </div>
    </div>
  );
}

export function Monitor({ url, captura, titulo }: { url: string; captura?: string; titulo: string }) {
  return (
    <div className="monitor w-full max-w-[640px]">
      <div className="rounded-2xl bg-ink p-3 shadow-[0_40px_80px_-30px_rgba(15,27,42,.45)]">
        <div className="flex items-center gap-1.5 rounded-t-md bg-card px-3 py-2">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#3fb27f]" />
          <span className="ml-3 flex-1 truncate rounded bg-paper px-3 py-1 font-mono text-[10px] text-mute">{url}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-b-md bg-card">
          <div className="autoscroll">
            {captura ? (
              <Image src={captura} alt={`${titulo}: página inteira`} width={1280} height={3200} className="h-auto w-full" />
            ) : (
              <SiteExemplo />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto h-8 w-24 bg-gradient-to-b from-ink to-[#1f2f44] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
      <div className="mx-auto h-2 w-48 rounded-t-md bg-ink" />
    </div>
  );
}
