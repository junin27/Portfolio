import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Newsreader, Silkscreen } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { EasterEggs } from "@/components/fx/EasterEggs";
import { perfil } from "@/content/perfil";

const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
// Fonte pixel: só nos detalhes de jogo (PRESS START, HUD, conquistas), nunca em texto corrido.
const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-silkscreen" });

export const metadata: Metadata = {
  title: { default: `${perfil.nome} · ${perfil.cargo}`, template: `%s · ${perfil.nome}` },
  description:
    "Sites, aplicativos e sistemas sob medida, inteligência artificial e pesquisa científica. Portfólio para vagas, projetos freelance e parcerias.",
};

export const viewport: Viewport = { themeColor: "#f5f8fb" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${interTight.variable} ${jetbrains.variable} ${silkscreen.variable}`}>
      <body>
        <ScrollProgress />
        <Header />
        {children}
        <EasterEggs />
      </body>
    </html>
  );
}
