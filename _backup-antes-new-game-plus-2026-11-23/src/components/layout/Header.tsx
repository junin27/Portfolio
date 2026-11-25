"use client";

// Cabeçalho fixo com fundo translúcido. Os links "decodificam" no hover.
// No celular, um botão abre o menu em lista.
import Link from "next/link";
import { useEffect, useState } from "react";
import { perfil } from "@/content/perfil";
import { ScrambleText } from "@/components/fx/ScrambleText";

const links = [
  { href: "/#trabalhos", label: "trabalhos" },
  { href: "/#em-acao", label: "em ação" },
  { href: "/#pesquisa", label: "pesquisa" },
  { href: "/#eventos", label: "eventos" },
  { href: "/#sobre", label: "sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid || open ? "border-b border-line bg-paper/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-[max(20px,4vw)] py-4">
        <Link href="/" className="group font-mono text-[13px] tracking-tight">
          <span className="text-blue">~/</span>
          <span>{perfil.nome}</span>
          <span className="caret ml-1 !w-[0.45em] text-blue opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-[13px] text-mute transition-colors hover:text-ink">
              <ScrambleText text={l.label} />
            </Link>
          ))}
          <Link
            href="/#contato"
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
          >
            Vamos conversar
          </Link>
        </nav>

        <button
          type="button"
          className="font-mono text-[13px] md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "[fechar]" : "[menu]"}
        </button>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Principal (celular)"
        hidden={!open}
        className="border-t border-line px-[max(20px,4vw)] pb-6 md:hidden"
      >
        <ul className="flex flex-col">
          {[...links, { href: "/#contato", label: "contato" }].map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 font-serif text-3xl">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
