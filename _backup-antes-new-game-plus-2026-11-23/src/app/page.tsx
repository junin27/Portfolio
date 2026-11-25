import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
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
