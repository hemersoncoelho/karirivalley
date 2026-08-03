import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { Avatar } from "@/components/admin/Avatar"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/admin/labels"
import type { AdminMember } from "@/lib/admin/types"

interface PendingApprovalsListProps {
  members: AdminMember[]
}

/** Recorte das 5 solicitações pendentes mais recentes, com atalho para a fila completa. */
export function PendingApprovalsList({ members }: PendingApprovalsListProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4 text-amber-600" />
          Aprovações pendentes
          {members.length > 0 && (
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin/aprovacoes" />}>
          Ver todas <ArrowRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-3">
        {members.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-400">Nenhuma solicitação pendente.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-100">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={m.displayName || m.fullName} photoUrl={m.photoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800">{m.displayName || m.fullName}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {m.city} · {formatDate(m.createdAt)}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
