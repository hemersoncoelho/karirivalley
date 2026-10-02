import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.karirivalley.com.br"),
  title: "Kariri Valley — Comunidade de inovação do Cariri",
  description:
    "Pessoas que se encontram, compartilham ideias e fazem a inovação acontecer no Cariri. Conheça a comunidade, nossa história e nossos encontros.",
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
    title: "Kariri Valley — Comunidade de inovação do Cariri",
    description:
      "Gente que se encontra, compartilha ideias e transforma o Cariri. Faça parte desse movimento.",
    siteName: "Kariri Valley",
    images: [{ url: "/media/gallery/20260801-195702-fav.webp", width: 2000, height: 1126, alt: "Comunidade Kariri Valley reunida no Cariri" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${fraunces.variable} ${spaceMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--nb-sand)" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
