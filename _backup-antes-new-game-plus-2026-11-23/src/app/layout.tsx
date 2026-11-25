import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { EasterEggs } from "@/components/fx/EasterEggs";
import { perfil } from "@/content/perfil";

const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-newsreader" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: `${perfil.nome} · ${perfil.cargo}`, template: `%s · ${perfil.nome}` },
  description:
    "Portfólio de engenharia de software e pesquisa: APIs, apps mobile, machine learning, geoprocessamento, publicações e eventos.",
};

export const viewport: Viewport = { themeColor: "#f5f8fb" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <ScrollProgress />
        <Header />
        {children}
        <EasterEggs />
      </body>
    </html>
  );
}
