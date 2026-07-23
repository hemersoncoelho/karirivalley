"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Briefcase, CalendarDays, LayoutDashboard, LogOut, Menu, Users, UserCircle2, X } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { KaririMark } from "@/components/ui/KaririMark"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/comunidade", label: "Comunidade", icon: Users },
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
    <div className="min-h-screen" style={{ background: "#2C2221" }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between"
        style={{
          padding: stuck ? "13px 24px" : "22px 24px",
          background: stuck ? "rgba(6,13,8,.92)" : "rgba(6,13,8,.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: stuck ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(255,255,255,.04)",
          transition: "padding .35s, background .35s, border-color .35s",
        }}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center"
            style={{ opacity: 0, animation: "kv-fade-in .6s cubic-bezier(.16,1,.3,1) .05s forwards" }}
          >
            <Image src="/logo.png" alt="Kariri Valley" width={502} height={304} style={{ height: 54, width: "auto" }} priority />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href)
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "text-[#F4EDDF]" : "text-[#F4EDDF]/55 hover:text-[#F4EDDF]/85 hover:bg-white/5"
                  )}
                  style={{ opacity: 0, animation: `kv-fade-in .6s cubic-bezier(.16,1,.3,1) ${0.12 + i * 0.07}s forwards` }}
                >
                  <Icon size={15} strokeWidth={1.75} />
                  {link.label}
                  {active && (
                    <KaririMark
                      size={9}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2"
                    />
                  )}
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
            className="flex items-center justify-center rounded-full p-2 text-[#F4EDDF]/70 transition hover:bg-white/5 md:hidden"
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
                <UserCircle2 size={32} strokeWidth={1.4} className="text-[#F4EDDF]/50" />
              )}
              <span className="hidden text-sm font-medium text-[#F4EDDF]/85 sm:inline">{member.displayName}</span>
              <KaririMark size={10} className={cn("transition-transform", menuOpen && "rotate-180")} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 py-1 shadow-xl"
                style={{ background: "rgba(6,13,8,.96)", backdropFilter: "blur(20px)" }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {member.slug && (
                  <Link
                    href="/perfil/preview"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#F4EDDF]/80 hover:bg-white/5"
                  >
                    Ver perfil público
                  </Link>
                )}
                <Link
                  href="/perfil/editar"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-[#F4EDDF]/80 hover:bg-white/5"
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
          className="sticky top-[57px] z-30 flex flex-col md:hidden"
          style={{
            background: "rgba(6,13,8,.96)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,.07)",
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
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
                  active ? "text-[#F4EDDF]" : "text-[#F4EDDF]/60"
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {link.label}
                {active && <KaririMark size={10} className="ml-auto" />}
              </Link>
            )
          })}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
