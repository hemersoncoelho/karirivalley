"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { canAccess, NAV_ITEMS } from "@/lib/admin/nav"
import { useAdmin } from "@/lib/admin/store"

const GROUP_LABELS: Record<string, string> = {
  main: "Gestão",
  future: "Fase futura",
  system: "Sistema",
}

interface AdminSidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { currentUser } = useAdmin()

  const visible = NAV_ITEMS.filter((item) => canAccess(item, currentUser.role))
  const groups = ["main", "future", "system"] as const

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col text-[var(--kv-cream)] transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#241B1A" }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
            <span
              className="flex size-8 items-center justify-center rounded-lg text-sm font-bold text-[#241B1A]"
              style={{ backgroundColor: "var(--kv-gold)" }}
            >
              KV
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Kariri Valley</p>
              <p className="text-[11px] text-[var(--kv-cream)]/50">Painel Admin</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--kv-cream)]/60 hover:bg-white/5 lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {groups.map((group) => {
            const items = visible.filter((i) => i.group === group)
            if (items.length === 0) return null
            return (
              <div key={group} className="mb-4">
                <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[var(--kv-cream)]/35 uppercase">
                  {GROUP_LABELS[group]}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-[var(--kv-teal)]/20 font-medium text-white"
                              : "text-[var(--kv-cream)]/70 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <item.icon className="size-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <Link
            href="/"
            className="text-xs text-[var(--kv-cream)]/50 transition-colors hover:text-[var(--kv-cream)]"
          >
            ← Voltar ao site
          </Link>
        </div>
      </aside>
    </>
  )
}
