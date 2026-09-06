"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { DiamondMark } from "@/components/ui/editorial";

const NAV_COLUMN = [
  { href: "/",               label: "Início"           },
  { href: "/sobre",          label: "Sobre"             },
  { href: "/membros",        label: "Diretório"         },
  { href: "/como-participar", label: "Como Participar"  },
] as const;

const COMMUNITY_COLUMN = [
  { href: "/login",   label: "Entrar"        },
  { href: "/cadastro", label: "Cadastre-se"   },
] as const;

const MEMBER_AREA_PREFIXES = ["/dashboard", "/comunidade", "/vitrine", "/eventos", "/oportunidades", "/perfil"] as const;

const LINK_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "rgba(244,238,225,.78)",
};

const COLOPHON: React.CSSProperties = {
  fontFamily: "var(--font-space-mono), monospace",
  fontSize: 11,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "rgb(244,244,244)",
};

export default function Footer() {
  const pathname = usePathname();

  const hasOwnLayout =
    pathname?.startsWith("/admin") ||
    MEMBER_AREA_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  if (hasOwnLayout) return null;

  return (
    <footer style={{ background: "var(--nb-forest-dark)", borderTop: "1px solid var(--nb-ink)", position: "relative", overflow: "hidden" }}>
      {/* Chapada do Cariri na base do fechamento */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/paisagem-montanha.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1300px, 112vw)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      {/* Banda de display — o nome como manchete de fechamento */}
      <div className="mx-auto max-w-[1240px] px-6 md:px-[52px] pt-16 pb-8" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span
            className="kv-kicker"
            style={{ color: "var(--nb-mustard)" }}
          >
            O mapa vivo da inovação do kariri
          </span>
        </div>
        <p
          className="kv-display"
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(44px, 7.5vw, 96px)",
            color: "var(--nb-sand)",
          }}
        >
          Kariri <em style={{ fontStyle: "italic" }}>Valley</em>
        </p>
      </div>

      <div className="mx-auto max-w-[1240px] px-6 md:px-[52px] pb-10">
        <div
          style={{
            borderTop: "1px solid rgba(244,238,225,.22)",
            paddingTop: 32,
            display: "grid",
            gap: 40,
            gridTemplateColumns: "1fr",
            alignItems: "start",
          }}
          className="lg:grid-cols-[1.4fr_1fr_1fr]"
        >
          <div>
            <p className="kv-meta max-w-[360px]" style={{ color: "rgba(244,238,225,.68)", textTransform: "none", letterSpacing: ".04em", fontSize: 12, lineHeight: 1.8 }}>
              Ecossistema de inovação do Cariri. Conectamos pessoas, ideias e
              oportunidades para transformar nossa região.
            </p>
            <a
              href="https://instagram.com/karirivalley"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kariri Valley no Instagram"
              className="mt-6 inline-flex items-center justify-center transition-colors"
              style={{
                width: 38, height: 38, borderRadius: 2,
                border: "1px solid rgba(244,238,225,.35)", color: "var(--nb-sand)",
              }}
            >
              <Camera size={17} strokeWidth={2} />
            </a>
          </div>

          <nav aria-label="Navegue">
            <h3 className="kv-kicker mb-4" style={{ color: "var(--nb-mustard)" }}>Navegue</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {NAV_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="no-underline transition-colors" style={LINK_STYLE}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Comunidade">
            <h3 className="kv-kicker mb-4" style={{ color: "var(--nb-mustard)" }}>Comunidade</h3>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {COMMUNITY_COLUMN.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="no-underline transition-colors" style={LINK_STYLE}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(244,238,225,.14)", paddingTop: 18 }}
        >
          <p style={COLOPHON}>© {new Date().getFullYear()} Kariri Valley</p>
          <p style={COLOPHON}>Cariri — Ceará — Brasil</p>
        </div>
      </div>
    </footer>
  );
}
