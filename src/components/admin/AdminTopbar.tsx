"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Avatar } from "./Avatar"
import { RoleBadge } from "./StatusBadge"
import { useAdmin } from "@/lib/admin/store"
import { itemForPath } from "@/lib/admin/nav"

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const { currentUser } = useAdmin()
  const title = itemForPath(pathname)?.label ?? "Painel"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar name={currentUser.name} size="sm" />
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-xs font-medium text-neutral-800">{currentUser.name}</p>
            <RoleBadge role={currentUser.role} />
          </div>
        </div>
      </div>
    </header>
  )
}
