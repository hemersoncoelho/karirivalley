"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useNbTheme } from "@/hooks/useNbTheme";

const NAV_LINKS = [
  { href: "/sobre",           label: "Sobre"           },
  { href: "/membros",         label: "Membros"         },
  { href: "/como-participar", label: "Como Participar" },
] as const;

// Rotas da área de membros — possuem seu próprio header (MemberShell).
const MEMBER_AREA_PREFIXES = ["/dashboard", "/comunidade", "/vitrine", "/eventos", "/oportunidades", "/perfil"] as const;

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open,  setOpen]  = useState(false);
  const pathname = usePathname();
  const { theme, mounted } = useNbTheme();
  const logoSrc = mounted && theme === "dark" ? "/logo.png" : "/logo-light.png";

  useEffect(() => {
    const handler = () => setStuck(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Áreas com layout próprio (admin e área de membros) não usam a navbar pública.
  const hasOwnLayout =
    pathname?.startsWith("/admin") ||
    MEMBER_AREA_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
  if (hasOwnLayout) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-[52px]"
      style={{
        paddingTop: stuck ? 12 : 20,
        paddingBottom: stuck ? 12 : 20,
        background: "var(--nb-navbar-bg)",
        borderBottom: `3px solid ${stuck ? "var(--nb-navbar-border)" : "transparent"}`,
        boxShadow: stuck ? "0 4px 0 0 rgba(22,20,15,0.06)" : "none",
        transition: "padding .3s ease, border-color .3s ease, box-shadow .3s ease, background .2s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center flex-shrink-0 no-underline">
        <Image src={logoSrc} alt="Kariri Valley" width={502} height={304} style={{ height: 54, width: "auto" }} priority />
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="no-underline transition-colors duration-200"
              style={{ fontSize: 14, fontWeight: 600, color: "var(--nb-link-fg)", fontFamily: "var(--font-geo)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--nb-terracotta)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--nb-link-fg)")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/login"
          className="inline-block px-[18px] py-2 no-underline"
          style={{
            fontSize: 13, fontWeight: 600, color: "var(--nb-heading)", fontFamily: "var(--font-geo)",
            border: "2px solid var(--nb-navbar-border)", borderRadius: 8, background: "transparent",
            transition: "background .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--nb-card-divider)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Entrar
        </Link>
        <Link
          href="/como-participar"
          className="kv-press inline-block px-5 py-[9px] no-underline"
          style={{
            fontSize: 13, fontWeight: 700, color: "var(--nb-btn-primary-fg)", fontFamily: "var(--font-geo)",
            background: "var(--nb-btn-primary-bg)", border: "2px solid var(--nb-ink)", borderRadius: 8,
            boxShadow: "var(--shadow-nb-sm)",
          }}
        >
          Fazer parte
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{ background: "none", border: "2px solid var(--nb-navbar-border)", borderRadius: 6, cursor: "pointer" }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block"
            style={{
              width: 20, height: 2, background: "var(--nb-heading)", borderRadius: 1,
              transition: "transform .3s, opacity .3s",
              transform: open
                ? i === 0 ? "translateY(7px) rotate(45deg)"
                : i === 2 ? "translateY(-7px) rotate(-45deg)" : "scaleX(0)"
                : "none",
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col md:hidden"
          style={{ background: "var(--nb-navbar-bg)", borderBottom: "3px solid var(--nb-navbar-border)", padding: "20px 24px 28px" }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="no-underline py-3 border-b"
              style={{ fontSize: 15, fontWeight: 600, color: "var(--nb-link-fg)", borderColor: "var(--nb-card-divider)", fontFamily: "var(--font-geo)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-5">
            <ThemeToggle />
            <Link href="/login" onClick={() => setOpen(false)}
              className="flex-1 text-center py-[10px] no-underline"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--nb-heading)", border: "2px solid var(--nb-navbar-border)", borderRadius: 8 }}>
              Entrar
            </Link>
            <Link href="/como-participar" onClick={() => setOpen(false)}
              className="flex-1 text-center py-[10px] no-underline"
              style={{ fontSize: 13, fontWeight: 700, color: "var(--nb-btn-primary-fg)", background: "var(--nb-btn-primary-bg)", border: "2px solid var(--nb-ink)", borderRadius: 8, boxShadow: "var(--shadow-nb-sm)" }}>
              Fazer parte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
