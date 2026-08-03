import Link from "next/link"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Avatar } from "@/components/admin/Avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AdminMember } from "@/lib/admin/types"

interface IncompleteProfilesListProps {
  /** Já recortado para os 5 perfis mais incompletos, ordenado ascendente por completude. */
  entries: { member: AdminMember; pct: number }[]
  /** Total de perfis incompletos (pode ser maior que `entries.length`). */
  total: number
}

/** Recorte dos perfis aprovados menos completos, com atalho para a gestão de membros. */
export function IncompleteProfilesList({ entries, total }: IncompleteProfilesListProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="size-4 text-[var(--kv-coral)]" />
          Perfis incompletos
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
            {total}
          </span>
        </CardTitle>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin/membros" />}>
          Gerenciar <ArrowRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-3">
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-400">Todos os perfis aprovados estão completos.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-100">
            {entries.map(({ member, pct }) => (
              <li key={member.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={member.displayName || member.fullName} photoUrl={member.photoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {member.displayName || member.fullName}
                  </p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-[var(--kv-coral)] transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-neutral-500">{pct}%</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
