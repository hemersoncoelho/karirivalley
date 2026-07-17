"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/eventos", label: "Eventos" },
  { href: "/oportunidades", label: "Oportunidades" },
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

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen" style={{ background: "#2C2221" }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(6,13,8,.92)", borderBottom: "1px solid rgba(255,255,255,.08)" }}
      >
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="Kariri Valley" width={140} height={40} style={{ height: 32, width: "auto" }} />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    active ? "text-[#F4EDDF]" : "text-[#F4EDDF]/55 hover:text-[#F4EDDF]/85"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

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
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <UserCircle2 size={32} strokeWidth={1.4} className="text-[#F4EDDF]/50" />
            )}
            <span className="hidden text-sm font-medium text-[#F4EDDF]/85 sm:inline">{member.displayName}</span>
            <ChevronDown size={14} className="text-[#F4EDDF]/50" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 py-1 shadow-xl"
              style={{ background: "#1a1413" }}
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
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
