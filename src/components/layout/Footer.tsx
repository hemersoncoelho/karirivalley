"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera } from "lucide-react";
import { DiamondDivider } from "@/components/ui/patterns";

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

export default function Footer() {
  const pathname = usePathname();

  const hasOwnLayout =
    pathname?.startsWith("/admin") ||
    MEMBER_AREA_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  if (hasOwnLayout) return null;

  return (
    <footer style={{ background: "var(--nb-forest-dark)", borderTop: "3px solid var(--nb-ink)" }}>
      <div className="mx-auto max-w-[1240px] px-6 md:px-[52px] pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image src="/logo.png" alt="Kariri Valley" width={502} height={304} style={{ height: 52, width: "auto" }} />
            <p className="mt-5 max-w-[340px]" style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(244,238,225,.68)" }}>
              Ecossistema de inovação do Cariri. Conectamos pessoas, ideias e oportunidades para transformar
              nossa região.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/karirivalley"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kariri Valley no Instagram"
                className="flex items-center justify-center transition-colors"
                style={{
                  width: 40, height: 40, borderRadius: 8,
                  border: "2px solid rgba(244,238,225,.35)", color: "var(--nb-sand)",
                }}
              >
                <Camera size={18} strokeWidth={2} />
              </a>
            </div>
          </div>

          <nav aria-label="Navegue">
            <h3
              className="mb-4"
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nb-mustard)", fontFamily: "var(--font-geo)" }}
            >
              Navegue
            </h3>
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
            <h3
              className="mb-4"
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--nb-mustard)", fontFamily: "var(--font-geo)" }}
            >
              Comunidade
            </h3>
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

        <DiamondDivider className="my-10 opacity-40" color="var(--nb-sand)" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: 13, color: "rgba(244,238,225,.55)" }}>
            © {new Date().getFullYear()} Kariri Valley. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,238,225,.55)" }}>Cariri, Ceará, Brasil</p>
        </div>
      </div>
    </footer>
  );
}
