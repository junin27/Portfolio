import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projetos, projetoPorSlug } from "@/content/projetos";
import { SplitReveal } from "@/components/fx/SplitReveal";
import { Phone } from "@/components/devices/Phone";
import { Monitor } from "@/components/devices/Monitor";
import { Contato } from "@/components/home/Contato";

// "instant = false": as páginas de projeto já são geradas no build, então não precisam de fallback de carregamento.
export const instant = false;

// Gera uma página estática para cada projeto na hora do build
export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projetoPorSlug(slug);
  return p ? { title: p.titulo, description: p.resumo } : {};
}

export default async function ProjetoPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const p = projetoPorSlug(slug);
  if (!p) notFound();

  const idx = projetos.indexOf(p);
  const prox = projetos[(idx + 1) % projetos.length];
  const blocos = [
    { rotulo: "problema", texto: p.problema },
    { rotulo: "solução", texto: p.solucao },
    { rotulo: "resultado", texto: p.resultado },
  ];

  return (
    <>
      <main>
        <section className="px-[max(20px,4vw)] pt-36 pb-16 md:pt-44">
          <div className="mx-auto max-w-[1320px]">
            <Link href="/#trabalhos" className="font-mono text-[12px] text-blue">
              cd ../trabalhos
            </Link>
            <SplitReveal immediate as="h1" className="mt-8 max-w-[16ch] font-serif text-[clamp(48px,8vw,120px)] leading-[0.98] tracking-[-0.02em]">
              {p.titulo}
            </SplitReveal>
            <p className="mt-8 max-w-[52ch] text-xl leading-relaxed text-mute">{p.resumo}</p>
            <dl className="mt-12 grid gap-6 border-t border-ink pt-6 font-mono text-[12px] sm:grid-cols-3">
              <div>
                <dt className="text-mute">ano</dt>
                <dd className="mt-1 text-base">{p.ano}</dd>
              </div>
              <div>
                <dt className="text-mute">stack</dt>
                <dd className="mt-1 text-base">{p.stack.join(" · ")}</dd>
              </div>
              <div>
                <dt className="text-mute">links</dt>
                <dd className="mt-1 flex gap-4 text-base">
                  {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="underline underline-offset-4">código ↗</a>}
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="underline underline-offset-4">demo ↗</a>}
                  {!p.repo && !p.demo && <span className="text-mute">privado</span>}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {(p.categoria === "mobile" || p.categoria === "web") && (
          <section className="bg-card px-[max(20px,4vw)] py-20">
            <div className="mx-auto flex max-w-[1320px] justify-center">
              {p.categoria === "mobile" ? (
                <Phone telas={p.telas} titulo={p.titulo} />
              ) : (
                <Monitor url={p.demo ?? "https://seu-projeto.vercel.app"} captura={p.captura} titulo={p.titulo} />
              )}
            </div>
          </section>
        )}

        <section className="px-[max(20px,4vw)] py-24">
          <div className="mx-auto grid max-w-[1320px] gap-16">
            {blocos.map((b) => (
              <div key={b.rotulo} className="grid gap-4 border-t border-line pt-6 md:grid-cols-[1fr_2fr]">
                <h2 className="code-comment">{`// ${b.rotulo}`}</h2>
                <SplitReveal as="p" className="max-w-[56ch] font-serif text-[clamp(22px,2.4vw,32px)] leading-snug">
                  {b.texto}
                </SplitReveal>
              </div>
            ))}
          </div>
        </section>

        <Link href={`/projetos/${prox.slug}`} className="group block border-t border-line px-[max(20px,4vw)] py-24">
          <div className="mx-auto max-w-[1320px]">
            <span className="code-comment">{"// próximo projeto"}</span>
            <span className="mt-4 block font-serif text-[clamp(40px,7vw,104px)] leading-[1.08] tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-cine)] group-hover:translate-x-4">
              {prox.titulo} <em className="text-blue">→</em>
            </span>
          </div>
        </Link>
      </main>
      <Contato />
    </>
  );
}
