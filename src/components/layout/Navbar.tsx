"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useNbTheme } from "@/hooks/useNbTheme";
import { DiamondMark } from "@/components/ui/editorial";

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
  const { mounted } = useNbTheme();
  void mounted;

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
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        background: `color-mix(in srgb, var(--nb-navbar-bg) ${stuck ? "85%" : "62%"}, transparent)`,
        backdropFilter: "blur(14px) saturate(150%)",
        WebkitBackdropFilter: "blur(14px) saturate(150%)",
        borderBottom: `1px solid ${stuck ? "var(--nb-line)" : "transparent"}`,
        transition: "border-color .3s ease, background .3s ease",
      }}
    >
      {/* Wordmark tipográfico + elemento de marca */}
      <Link href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}

        <span
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-.01em",
            color: "var(--nb-heading)",
          }}
        >
          Kariri Valley
        </span>
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="kv-kicker no-underline"
              style={{ color: "var(--nb-link-fg)" }}
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
          className="kv-kicker inline-flex items-center no-underline"
          style={{
            height: 34,
            padding: "0 14px",
            color: "var(--nb-btn-ghost-fg)",
            border: "1px solid var(--nb-line)",
            borderRadius: 2,
            background: "transparent",
            transition: "background .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--nb-line-soft)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Entrar
        </Link>
        <Link
          href="/como-participar"
          className="kv-press kv-kicker inline-flex items-center no-underline"
          style={{
            height: 34,
            padding: "0 16px",
            color: "var(--nb-btn-primary-fg)",
            background: "var(--nb-btn-primary-bg)",
            borderRadius: 2,
            letterSpacing: ".08em",
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
        style={{ background: "none", border: "1px solid var(--nb-line)", borderRadius: 2, cursor: "pointer" }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block"
            style={{
              width: 20, height: 2, background: "var(--nb-heading)",
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
          style={{
            background: "var(--nb-navbar-bg)",
            borderBottom: "1px solid var(--nb-line)",
            padding: "20px 24px 28px",
          }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="kv-kicker no-underline py-3 border-b"
              style={{ color: "var(--nb-link-fg)", borderColor: "var(--nb-line-soft)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-5">
            <ThemeToggle />
            <Link href="/login" onClick={() => setOpen(false)}
              className="kv-kicker flex-1 text-center flex items-center justify-center py-[10px] no-underline"
              style={{ color: "var(--nb-btn-ghost-fg)", border: "1px solid var(--nb-line)", borderRadius: 2 }}>
              Entrar
            </Link>
            <Link href="/como-participar" onClick={() => setOpen(false)}
              className="kv-kicker flex-1 text-center flex items-center justify-center py-[10px] no-underline"
              style={{ color: "var(--nb-btn-primary-fg)", background: "var(--nb-btn-primary-bg)", borderRadius: 2 }}>
              Fazer parte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
