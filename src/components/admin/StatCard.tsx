import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: "neutral" | "teal" | "amber" | "red" | "gold"
  hint?: string
}

const TONES: Record<string, { icon: string; ring: string }> = {
  neutral: { icon: "bg-neutral-100 text-neutral-500", ring: "" },
  teal: { icon: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]", ring: "" },
  amber: { icon: "bg-amber-100 text-amber-700", ring: "" },
  red: { icon: "bg-red-100 text-red-600", ring: "" },
  gold: { icon: "bg-[var(--kv-gold)]/15 text-[var(--kv-gold-dark)]", ring: "" },
}

export function StatCard({ label, value, icon: Icon, tone = "neutral", hint }: StatCardProps) {
  return (
    <div className="kv-metric-card flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm shadow-black/[0.03]">
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          TONES[tone].icon
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
        <p className="truncate text-xs font-medium text-neutral-500">{label}</p>
        {hint && <p className="truncate text-[11px] text-neutral-400">{hint}</p>}
      </div>
    </div>
  )
}
