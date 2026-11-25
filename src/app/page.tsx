import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { FichaDePersonagem } from "@/components/home/FichaDePersonagem";
import { Indice } from "@/components/home/Indice";
import { EmAcao } from "@/components/home/EmAcao";
import { Pesquisa } from "@/components/home/Pesquisa";
import { Eventos } from "@/components/home/Eventos";
import { Sobre } from "@/components/home/Sobre";
import { Contato } from "@/components/home/Contato";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        {/* A ficha continua a noite do hero; a faixa clara vem depois, como volta ao dia */}
        <FichaDePersonagem />
        <Marquee />
        <Indice />
        <EmAcao />
        <Pesquisa />
        <Eventos />
        <Sobre />
      </main>
      <Contato />
    </>
  );
}
