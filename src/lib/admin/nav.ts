import {
  Calendar,
  LayoutDashboard,
  Briefcase,
  ScrollText,
  Tag,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { MemberRole } from "./types"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  roles: MemberRole[]
  group: "main" | "future" | "system"
}

/** Itens de navegação do painel com controle de acesso por papel. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "curator"], group: "main" },
  { href: "/admin/membros", label: "Membros", icon: Users, roles: ["admin", "curator"], group: "main" },
  { href: "/admin/aprovacoes", label: "Aprovações", icon: UserCheck, roles: ["admin", "curator"], group: "main" },
  { href: "/admin/interesses", label: "Interesses", icon: Tag, roles: ["admin"], group: "main" },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar, roles: ["admin"], group: "future" },
  { href: "/admin/oportunidades", label: "Oportunidades", icon: Briefcase, roles: ["admin"], group: "future" },
  { href: "/admin/logs", label: "Log de auditoria", icon: ScrollText, roles: ["admin"], group: "system" },
]

export function canAccess(item: NavItem, role: MemberRole): boolean {
  return item.roles.includes(role)
}

export function itemForPath(pathname: string): NavItem | undefined {
  return [...NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
}
