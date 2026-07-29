import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { CountUpValue } from "./CountUpValue"
import { Sparkline } from "./dashboard/Sparkline"

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  tone?: "neutral" | "teal" | "amber" | "red" | "gold"
  hint?: string
  /** Indicador pulsante — sinaliza um dado que pede ação agora (ex.: pendências). */
  live?: boolean
  /** Série curta (ex.: últimos meses) para o mini gráfico de tendência. Só é exibida quando há dado real. */
  trend?: number[]
}

const TONES: Record<string, { icon: string; accent: string }> = {
  neutral: { icon: "bg-neutral-100 text-neutral-500", accent: "#8A8A8A" },
  teal: { icon: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]", accent: "var(--kv-teal)" },
  amber: { icon: "bg-amber-100 text-amber-700", accent: "#D97706" },
  red: { icon: "bg-red-100 text-red-600", accent: "#DC2626" },
  gold: { icon: "bg-[var(--kv-gold)]/15 text-[var(--kv-gold-dark)]", accent: "var(--kv-gold-dark)" },
}

export function StatCard({ label, value, icon: Icon, tone = "neutral", hint, live = false, trend }: StatCardProps) {
  const t = TONES[tone]
  const numeric = typeof value === "number"

  return (
    <div className="kv-metric-card flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-md hover:shadow-black/[0.06]">
      <span className={cn("relative flex size-11 shrink-0 items-center justify-center rounded-xl", t.icon)}>
        <Icon className="size-5" />
        {live && (
          <span className="absolute -top-1 -right-1 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--kv-gold)] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2.5 rounded-full border border-white bg-[var(--kv-gold)]" />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-semibold tracking-tight text-neutral-900 tabular-nums">
          {numeric ? <CountUpValue value={value} /> : value}
        </p>
        <p className="truncate text-xs font-medium text-neutral-500">{label}</p>
        {hint && <p className="truncate text-[11px] text-neutral-400">{hint}</p>}
      </div>
      {trend && trend.length > 1 && <Sparkline data={trend} color={t.accent} className="hidden shrink-0 sm:block" />}
    </div>
  )
}
