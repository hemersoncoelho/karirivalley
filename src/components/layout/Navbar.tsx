"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/sobre",           label: "Sobre"           },
  { href: "/membros",         label: "Membros"         },
  { href: "/como-participar", label: "Como Participar" },
  { href: "/contato",         label: "Contato"         },
] as const;

// Rotas da área de membros — possuem seu próprio header (MemberShell).
const MEMBER_AREA_PREFIXES = ["/dashboard", "/comunidade", "/eventos", "/oportunidades", "/perfil"] as const;

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open,  setOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setStuck(window.scrollY > 50);
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
        paddingTop: stuck ? 13 : 22,
        paddingBottom: stuck ? 13 : 22,
        background: stuck ? "rgba(6,13,8,.92)" : "transparent",
        backdropFilter: stuck ? "blur(24px)" : "none",
        WebkitBackdropFilter: stuck ? "blur(24px)" : "none",
        borderBottom: stuck ? "1px solid rgba(255,255,255,.07)" : "1px solid transparent",
        transition: "padding .4s, background .4s, border-color .4s",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center flex-shrink-0 no-underline"
        style={{ opacity: 0, animation: "kv-fade-in .6s cubic-bezier(.16,1,.3,1) .2s forwards" }}
      >
        <Image src="/logo.png" alt="Kariri Valley" width={502} height={304} style={{ height: 54, width: "auto" }} priority />
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
        {NAV_LINKS.map((link, i) => (
          <li
            key={link.href}
            style={{ opacity: 0, animation: `kv-fade-in .6s cubic-bezier(.16,1,.3,1) ${.32 + i * .1}s forwards` }}
          >
            <Link
              href={link.href}
              className="no-underline transition-colors duration-200"
              style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,237,223,.6)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F4EDDF")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,237,223,.6)")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div
        className="hidden md:flex items-center gap-2"
        style={{ opacity: 0, animation: "kv-fade-in .6s cubic-bezier(.16,1,.3,1) .72s forwards" }}
      >
        <Link
          href="/login"
          className="kv-btn-ghost inline-block px-[18px] py-2 rounded-full no-underline"
          style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,237,223,.7)", border: "1px solid rgba(255,255,255,.18)" }}
        >
          Entrar
        </Link>
        <Link
          href="/como-participar"
          className="inline-block px-5 py-[9px] rounded-full no-underline"
          style={{ fontSize: 13, fontWeight: 600, color: "#F4EDDF", background: "#1E4D3A", border: "1px solid rgba(255,255,255,.08)", transition: "all .25s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#245f47"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(30,77,58,.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#1E4D3A"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Fazer parte
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block"
            style={{
              width: 22, height: 1.5, background: "rgba(244,237,223,.7)", borderRadius: 2,
              transition: "transform .3s, opacity .3s",
              transform: open
                ? i === 0 ? "translateY(6.5px) rotate(45deg)"
                : i === 2 ? "translateY(-6.5px) rotate(-45deg)" : "scaleX(0)"
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
          style={{ background: "rgba(6,13,8,.96)", backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,.07)", padding: "20px 24px 28px" }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="no-underline py-3 border-b"
              style={{ fontSize: 15, fontWeight: 500, color: "rgba(244,237,223,.7)", borderColor: "rgba(255,255,255,.06)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-5">
            <Link href="/login" onClick={() => setOpen(false)}
              className="flex-1 text-center py-[10px] rounded-full no-underline"
              style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,237,223,.7)", border: "1px solid rgba(255,255,255,.18)" }}>
              Entrar
            </Link>
            <Link href="/como-participar" onClick={() => setOpen(false)}
              className="flex-1 text-center py-[10px] rounded-full no-underline"
              style={{ fontSize: 13, fontWeight: 600, color: "#F4EDDF", background: "#1E4D3A" }}>
              Fazer parte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
