import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kariri Valley — O mapa vivo da inovação no Cariri",
  description:
    "Conectamos startups, talentos, empresas, universidades e instituições para fortalecer o ecossistema de inovação do Cariri, CE.",
  keywords: [
    "Kariri Valley",
    "inovação",
    "Cariri",
    "startups",
    "tecnologia",
    "ecossistema",
    "Juazeiro do Norte",
    "Crato",
    "Barbalha",
  ],
  openGraph: {
    title: "Kariri Valley — O mapa vivo da inovação no Cariri",
    description:
      "Conectamos startups, talentos, empresas, universidades e instituições para fortalecer o ecossistema de inovação do Cariri, CE.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${fraunces.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#2C2221" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
