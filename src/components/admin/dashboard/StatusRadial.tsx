"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useReducedMotion } from "@/lib/admin/useReducedMotion"

interface StatusSlice {
  key: "approved" | "pending" | "blocked" | "rejected"
  label: string
  value: number
  color: string
}

interface StatusRadialProps {
  approved: number
  pending: number
  blocked: number
  rejected: number
}

interface TooltipPayload {
  payload: StatusSlice
}

function StatusTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2 text-xs shadow-lg shadow-black/10">
      <p className="font-medium text-neutral-800">{slice.label}</p>
      <p className="text-neutral-500">
        {slice.value} membro{slice.value === 1 ? "" : "s"}
      </p>
    </div>
  )
}

/**
 * Composição por status (aprovados/pendentes/bloqueados/rejeitados).
 * A legenda fica sempre em coluna cheia abaixo do rosco — nunca espremida ao
 * lado dele — para que "Bloqueados"/"Rejeitados" nunca sejam cortados.
 */
export function StatusRadial({ approved, pending, blocked, rejected }: StatusRadialProps) {
  const reduced = useReducedMotion()
  const total = approved + pending + blocked + rejected

  const slices: StatusSlice[] = [
    { key: "approved", label: "Aprovados", value: approved, color: "var(--kv-teal)" },
    { key: "pending", label: "Pendentes", value: pending, color: "var(--kv-gold-dark)" },
    { key: "blocked", label: "Bloqueados", value: blocked, color: "var(--kv-coral)" },
    { key: "rejected", label: "Rejeitados", value: rejected, color: "#C4C4C4" },
  ]
  const visible = slices.filter((s) => s.value > 0)

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative size-36 shrink-0">
        {total === 0 ? (
          <div className="flex size-36 items-center justify-center rounded-full border-4 border-dashed border-neutral-100">
            <span className="px-4 text-center text-xs text-neutral-400">Sem membros ainda</span>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<StatusTooltip />} />
                <Pie
                  data={visible}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={64}
                  paddingAngle={visible.length > 1 ? 3 : 0}
                  stroke="none"
                  isAnimationActive={!reduced}
                  animationDuration={900}
                >
                  {visible.map((s) => (
                    <Cell key={s.key} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold tabular-nums text-neutral-900">{total}</span>
              <span className="text-[10px] tracking-wide text-neutral-400 uppercase">membros</span>
            </div>
          </>
        )}
      </div>

      <ul className="grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {slices.map((s) => {
          const pct = total > 0 ? Math.round((s.value / total) * 100) : 0
          return (
            <li key={s.key} className="flex min-w-0 items-center gap-2 text-sm" title={`${s.label}: ${s.value}`}>
              <span className="relative flex size-2.5 shrink-0 items-center justify-center">
                <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.key === "pending" && s.value > 0 && (
                  <span
                    className="absolute inline-flex size-2.5 animate-ping rounded-full opacity-60 motion-reduce:hidden"
                    style={{ backgroundColor: s.color }}
                  />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-neutral-600">{s.label}</span>
              <span className="shrink-0 font-medium tabular-nums text-neutral-800">{s.value}</span>
              <span className="w-9 shrink-0 text-right text-xs tabular-nums text-neutral-400">{pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
