import { cn } from "@/lib/utils"
import { ROLE_LABELS, STATUS_LABELS, STATUS_TONE } from "@/lib/admin/labels"
import type { MemberRole, MemberStatus } from "@/lib/admin/types"

const TONE_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 ring-amber-200",
  teal: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)] ring-[var(--kv-teal)]/25",
  red: "bg-red-100 text-red-700 ring-red-200",
  gray: "bg-neutral-100 text-neutral-600 ring-neutral-200",
}

export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[STATUS_TONE[status]]
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  )
}

const ROLE_CLASSES: Record<MemberRole, string> = {
  admin: "bg-[var(--kv-gold)]/15 text-[var(--kv-gold-dark)] ring-[var(--kv-gold)]/30",
  curator: "bg-[var(--kv-coral)]/12 text-[var(--kv-coral)] ring-[var(--kv-coral)]/25",
  member: "bg-neutral-100 text-neutral-600 ring-neutral-200",
}

export function RoleBadge({ role }: { role: MemberRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        ROLE_CLASSES[role]
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
