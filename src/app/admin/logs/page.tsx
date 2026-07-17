"use client"

import {
  Check,
  X,
  Ban,
  RotateCcw,
  Pencil,
  Plus,
  Tag,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/admin/Avatar"
import { RoleBadge } from "@/components/admin/StatusBadge"
import { useAdmin } from "@/lib/admin/store"
import { AUDIT_ACTION_LABELS, formatDateTime } from "@/lib/admin/labels"
import type { AuditAction } from "@/lib/admin/types"

const ACTION_ICON: Record<AuditAction, LucideIcon> = {
  approve_member: Check,
  reject_member: X,
  block_member: Ban,
  unblock_member: RotateCcw,
  edit_member: Pencil,
  create_interest: Plus,
  update_interest: Pencil,
  toggle_interest: Tag,
}

const ACTION_TONE: Record<AuditAction, string> = {
  approve_member: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  reject_member: "bg-neutral-100 text-neutral-500",
  block_member: "bg-red-100 text-red-600",
  unblock_member: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  edit_member: "bg-amber-100 text-amber-700",
  create_interest: "bg-[var(--kv-gold)]/15 text-[var(--kv-gold-dark)]",
  update_interest: "bg-amber-100 text-amber-700",
  toggle_interest: "bg-neutral-100 text-neutral-500",
}

export default function LogsPage() {
  const { logs } = useAdmin()

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-neutral-500">
        Registro imutável de todas as ações administrativas relevantes (RN-024). {logs.length}{" "}
        entradas.
      </p>

      <Card>
        <CardContent className="p-0">
          <ul className="flex flex-col divide-y divide-neutral-50">
            {logs.map((log) => {
              const Icon = ACTION_ICON[log.action]
              return (
                <li key={log.id} className="flex items-start gap-3 p-4">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${ACTION_TONE[log.action]}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-800">
                      <span className="font-medium">{AUDIT_ACTION_LABELS[log.action]}</span>{" "}
                      <span className="text-neutral-500">·</span>{" "}
                      <span className="font-medium text-neutral-900">{log.targetName}</span>
                    </p>
                    {log.details && (
                      <p className="mt-0.5 text-xs text-neutral-500">“{log.details}”</p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Avatar name={log.actorName} size="sm" className="size-5 text-[10px]" />
                        {log.actorName}
                      </span>
                      <RoleBadge role={log.actorRole} />
                      <span>·</span>
                      <span>{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
            {logs.length === 0 && (
              <li className="p-10 text-center text-sm text-neutral-400">
                Nenhuma ação registrada ainda.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
