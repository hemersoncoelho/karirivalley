"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Camera } from "lucide-react";

const NAV_COLUMN = [
  { href: "/sobre", label: "Nossa história" },
  { href: "/membros", label: "Pessoas da comunidade" },
  { href: "/agenda", label: "Agenda de encontros" },
  { href: "/galeria", label: "Galeria de momentos" },
  { href: "/oportunidades/publicas", label: "Oportunidades" },
] as const;

const COMMUNITY_COLUMN = [
  { href: "/como-participar", label: "Como participar" },
  { href: "/cadastro", label: "Fazer meu cadastro" },
  { href: "/login", label: "Entrar na comunidade" },
] as const;

const MEMBER_AREA_PREFIXES = ["/dashboard", "/comunidade", "/vitrine", "/eventos", "/oportunidades", "/perfil"] as const;

function isWithin(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default function Footer() {
  const pathname = usePathname();
  const isPublicOpportunity = isWithin(pathname, "/oportunidades/publicas");
  const hasOwnLayout = isWithin(pathname, "/admin") ||
    (!isPublicOpportunity && MEMBER_AREA_PREFIXES.some((prefix) => isWithin(pathname, prefix)));
  if (hasOwnLayout) return null;

  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--nb-forest-dark)", color: "var(--nb-sand)" }}>
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-7 pt-14 md:px-12 md:pt-20">
        <div className="kv-footer-invitation flex flex-col items-start justify-between gap-7 border-b pb-10 md:flex-row md:items-end md:pb-12" style={{ borderColor: "rgba(244,238,225,.22)" }}>
          <div className="max-w-[690px]">
            <p className="kv-kicker mb-4" style={{ color: "var(--nb-mustard)" }}>Feito de gente. Feito no Cariri.</p>
            <p className="kv-display m-0" style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 1.04, color: "var(--nb-sand)" }}>
              O próximo encontro pode<br className="hidden sm:block" /> começar com <em>você.</em>
            </p>
          </div>
          <Link href="/como-participar" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-[2px] px-6 text-sm font-semibold no-underline transition-transform hover:-translate-y-0.5" style={{ color: "var(--nb-forest-dark)", background: "var(--nb-mustard)" }}>
            Fazer parte <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16 lg:py-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Kariri Valley — início" className="inline-block no-underline">
              <Image src="/logo.png" alt="Kariri Valley" width={502} height={304} unoptimized className="h-auto w-[140px]" />
            </Link>
            <p className="mt-5 max-w-[320px] text-sm leading-7" style={{ color: "rgba(244,238,225,.82)" }}>
              Pessoas, ideias e encontros que fazem a inovação acontecer no Cariri. Uma comunidade em movimento, construída por quem participa.
            </p>
            <a href="https://instagram.com/karirivalley" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm no-underline transition-opacity hover:opacity-80" style={{ color: "var(--nb-sand)" }}>
              <Camera size={19} aria-hidden="true" /> @karirivalley <ArrowUpRight size={14} aria-hidden="true" />
              <span className="sr-only"> no Instagram, abre em nova aba</span>
            </a>
          </div>

          <nav aria-label="Explore o Kariri Valley">
            <h2 className="kv-kicker mb-4" style={{ color: "var(--nb-mustard)" }}>Explore</h2>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {NAV_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center text-sm no-underline transition-opacity hover:opacity-75" style={{ color: "rgba(244,238,225,.86)" }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Participe da comunidade">
            <h2 className="kv-kicker mb-4" style={{ color: "var(--nb-mustard)" }}>Vamos juntos</h2>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {COMMUNITY_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-10 items-center text-sm no-underline transition-opacity hover:opacity-75" style={{ color: "rgba(244,238,225,.86)" }}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[250px] text-sm leading-6" style={{ color: "rgba(244,238,225,.7)" }}>Chegando agora? Conheça as pessoas e acompanhe os próximos encontros.</p>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(244,238,225,.22)", color: "rgba(244,238,225,.75)" }}>
          <p className="m-0">© {new Date().getFullYear()} Kariri Valley</p>
          <p className="m-0">Cariri, Ceará, Brasil <span aria-hidden="true" style={{ color: "var(--nb-mustard)" }}>✦</span></p>
        </div>
      </div>
    </footer>
  );
}
