"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, CalendarDays, LayoutDashboard, LogOut, Menu, Rocket, Users, UserCircle2, X } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { KaririMark } from "@/components/ui/KaririMark"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/vitrine", label: "Empresas", icon: Rocket },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/oportunidades", label: "Oportunidades", icon: Briefcase },
] as const

interface MemberShellProps {
  member: {
    displayName: string
    photoUrl: string | null
    slug: string | null
  }
  children: React.ReactNode
}

export function MemberShell({ member, children }: MemberShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const handler = () => setStuck(window.scrollY > 8)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--kv-dark)" }}>
      <div className="sticky top-0 z-40">
      <header
        className="flex items-center justify-between"
        style={{
          padding: stuck ? "12px 24px" : "20px 24px",
          background: "var(--kv-dark)",
          borderBottom: `1px solid ${stuck ? "rgba(244,237,223,.25)" : "rgba(244,237,223,.08)"}`,
          transition: "padding .35s, border-color .35s",
        }}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 no-underline"
            style={{ opacity: 0, animation: "kv-fade-in .6s cubic-bezier(.16,1,.3,1) .05s forwards" }}
          >
            <span
              aria-hidden="true"
              style={{ width: 9, height: 9, background: "var(--kv-gold)", transform: "rotate(45deg)", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: 19,
                fontWeight: 700,
                color: "var(--kv-cream)",
                letterSpacing: "-.01em",
              }}
            >
              Kariri Valley
            </span>
            <span className="kv-kicker hidden lg:inline" style={{ color: "rgba(244,237,223,.45)" }}>
              · área do membro
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "kv-kicker relative flex items-center gap-1.5 py-1.5 no-underline transition-colors",
                    active ? "opacity-100" : "opacity-50 hover:opacity-85",
                  )}
                  style={{
                    color: "var(--kv-cream)",
                    borderBottom: active ? "1px solid var(--kv-gold)" : "1px solid transparent",
                    opacity: 0,
                    animation: `kv-fade-in .6s cubic-bezier(.16,1,.3,1) ${0.12 + i * 0.07}s forwards`,
                  }}
                >
                  <Icon size={13} strokeWidth={1.75} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div
          className="flex items-center gap-2"
          style={{ opacity: 0, animation: "kv-fade-in .6s cubic-bezier(.16,1,.3,1) .4s forwards" }}
        >
          <button
            type="button"
            className="flex items-center justify-center rounded-full p-2 text-[var(--kv-cream)]/70 transition hover:bg-white/5 md:hidden"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition hover:bg-white/5"
            >
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.displayName}
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <UserCircle2 size={32} strokeWidth={1.4} className="text-[var(--kv-cream)]/50" />
              )}
              <span className="hidden text-sm font-medium text-[var(--kv-cream)]/85 sm:inline">{member.displayName}</span>
              <KaririMark size={10} className={cn("transition-transform", menuOpen && "rotate-180")} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-white/10 py-1 shadow-xl"
                style={{ background: "var(--kv-dark)", borderTop: "2px solid var(--kv-gold)" }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {member.slug && (
                  <Link
                    href="/perfil/preview"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[var(--kv-cream)]/80 hover:bg-white/5"
                  >
                    Ver perfil público
                  </Link>
                )}
                <Link
                  href="/perfil/editar"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[var(--kv-cream)]/80 hover:bg-white/5"
                >
                  Editar perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#E0715A] hover:bg-white/5"
                >
                  <LogOut size={14} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="flex flex-col md:hidden"
          style={{
            background: "var(--kv-dark)",
            borderBottom: "1px solid rgba(244,237,223,.12)",
            padding: "8px 16px 16px",
          }}
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "kv-kicker flex items-center gap-3 rounded-lg px-3 py-3 no-underline",
                  active ? "opacity-100" : "opacity-55",
                )}
                style={{
                  color: "var(--kv-cream)",
                  borderBottom: active ? "1px solid var(--kv-gold)" : "1px solid transparent",
                }}
              >
                <Icon size={14} strokeWidth={1.75} />
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      <footer
        className="kv-meta"
        style={{
          borderTop: "1px solid rgba(244,237,223,.1)",
          padding: "20px 24px 28px",
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(244,237,223,.4)",
        }}
      >
        <span>◆ Kariri Valley — área do membro</span>
        <span>Cariri — Ceará — Brasil</span>
      </footer>
    </div>
  )
}
