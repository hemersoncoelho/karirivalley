"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Avatar } from "./Avatar"
import { RoleBadge } from "./StatusBadge"
import { Select } from "@/components/ui/input"
import { useAdmin } from "@/lib/admin/store"
import { itemForPath } from "@/lib/admin/nav"
import type { MemberRole } from "@/lib/admin/types"

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const { currentUser, setRole } = useAdmin()
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
        {/* Seletor de papel — demonstração do controle de acesso (mock) */}
        <label className="hidden items-center gap-1.5 text-xs text-neutral-500 sm:flex">
          <span className="hidden md:inline">Visualizar como:</span>
          <Select
            value={currentUser.role}
            onChange={(e) => setRole(e.target.value as MemberRole)}
            className="h-8 w-auto py-0 text-xs"
            aria-label="Trocar papel de visualização"
          >
            <option value="admin">Administrador</option>
            <option value="curator">Curador</option>
            <option value="member">Membro comum</option>
          </Select>
        </label>

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
