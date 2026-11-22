import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos de software, pesquisas e eventos.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
