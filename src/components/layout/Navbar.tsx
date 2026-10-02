"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/membros", label: "Pessoas" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeria", label: "Galeria" },
] as const;

// A agenda e as oportunidades públicas usam a navegação do site.
const MEMBER_AREA_PREFIXES = ["/dashboard", "/comunidade", "/vitrine", "/eventos", "/oportunidades", "/perfil"] as const;

function isWithin(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const open = openOnPath === pathname;

  // Reset during a route change so browser back cannot reopen an old menu.
  if (openOnPath !== null && openOnPath !== pathname) setOpenOnPath(null);

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenOnPath(null);
      toggleRef.current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpenOnPath(null);
      }
    };
    const closeOnFocusOutside = (event: FocusEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpenOnPath(null);
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpenOnPath(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOnFocusOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOnFocusOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  const isPublicOpportunity = isWithin(pathname, "/oportunidades/publicas");
  const hasOwnLayout = isWithin(pathname, "/admin") ||
    (!isPublicOpportunity && MEMBER_AREA_PREFIXES.some((prefix) => isWithin(pathname, prefix)));
  if (hasOwnLayout) return null;

  return (
    <>
    <a className="kv-skip-link" href="#conteudo">Pular para o conteúdo</a>
    <nav
      ref={navRef}
      aria-label="Navegação principal"
      className="sticky top-0 z-50 w-full"
      style={{ background: "var(--nb-navbar-bg)", borderBottom: "1px solid var(--nb-line-soft)" }}
    >
      <div className="relative mx-auto flex min-h-[56px] max-w-[1360px] items-center justify-between gap-5 px-5 md:px-8 lg:px-12">
        <Link href="/" aria-label="Kariri Valley — início" className="block shrink-0 py-2 no-underline" onClick={() => setOpenOnPath(null)}>
          <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, fontWeight: 700, letterSpacing: "-.01em", color: "var(--nb-heading)" }}>Kariri Valley</span>
        </Link>

        <ul className="m-0 hidden list-none items-center gap-7 p-0 lg:flex xl:gap-9">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isWithin(pathname, link.href) ? "page" : undefined}
                className="kv-public-nav-link inline-flex min-h-11 items-center text-sm font-medium no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="kv-public-nav-link inline-flex min-h-11 items-center rounded-[2px] border px-4 text-sm font-medium no-underline" style={{ borderColor: "var(--nb-line-soft)" }}>Entrar</Link>
          <Link
            href="/como-participar"
            aria-current={pathname === "/como-participar" ? "page" : undefined}
            className="kv-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] px-5 text-sm font-semibold no-underline"
            style={{ background: "var(--nb-btn-primary-bg)", color: "var(--nb-btn-primary-fg)" }}
          >
            Fazer parte <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[2px] px-3 lg:hidden"
          aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={open}
          aria-controls="public-mobile-menu"
          onClick={() => setOpenOnPath(open ? null : pathname)}
          style={{ color: "var(--nb-heading)", border: "1px solid var(--nb-line-soft)", background: "transparent", cursor: "pointer" }}
        >
          <span className="text-sm font-medium">Menu</span>
          {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>

        {open && (
          <div
            id="public-mobile-menu"
            ref={menuRef}
            className="absolute top-full right-0 left-0 max-h-[calc(100dvh-56px)] overflow-y-auto border-b px-5 pb-7 pt-3 md:px-8 lg:hidden"
            style={{ background: "var(--nb-navbar-bg)", borderColor: "var(--nb-line-soft)", boxShadow: "0 14px 24px rgba(0,0,0,.08)" }}
          >
            <p className="kv-kicker mb-2 mt-2" style={{ color: "var(--nb-body)" }}>Encontre seu lugar no movimento</p>
            <ul className="m-0 list-none p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href} style={{ borderBottom: "1px solid var(--nb-line-soft)" }}>
                  <Link
                    href={link.href}
                    onClick={() => setOpenOnPath(null)}
                    aria-current={isWithin(pathname, link.href) ? "page" : undefined}
                    className="kv-public-nav-link flex min-h-14 items-center justify-between py-3 text-lg font-medium no-underline"
                  >
                    {link.label} <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/como-participar" onClick={() => setOpenOnPath(null)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[2px] px-5 text-sm font-semibold no-underline" style={{ color: "var(--nb-btn-primary-fg)", background: "var(--nb-btn-primary-bg)" }}>
                Fazer parte <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/login" onClick={() => setOpenOnPath(null)} className="inline-flex min-h-12 items-center justify-center rounded-[2px] px-5 text-sm font-medium no-underline" style={{ color: "var(--nb-heading)", border: "1px solid var(--nb-line-soft)" }}>Entrar</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}
