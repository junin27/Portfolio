import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-start justify-center gap-6 px-[max(20px,4vw)]">
      <p className="code-comment">{"GAME OVER · 404"}</p>
      <h1 className="font-serif text-[clamp(56px,10vw,150px)] leading-none tracking-[-0.03em]">
        Página <em className="text-blue">não encontrada</em>
      </h1>
      <p className="text-lg text-mute">Esta fase não existe. Mas dá para continuar de onde parou.</p>
      <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
        Continuar? Voltar ao início
      </Link>
    </main>
  );
}
