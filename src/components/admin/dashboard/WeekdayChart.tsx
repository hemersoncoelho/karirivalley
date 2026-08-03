"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useReducedMotion } from "@/lib/admin/useReducedMotion"
import type { RankedItem } from "@/lib/admin/types"

interface WeekdayChartProps {
  data: RankedItem[]
}

interface TooltipPayload {
  payload: RankedItem
}

function WeekdayTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2 text-xs shadow-lg shadow-black/10">
      <p className="font-medium text-neutral-800">{point.label}</p>
      <p className="mt-1 text-neutral-600">
        <span className="font-semibold text-[var(--kv-teal-dark)]">{point.value}</span> cadastro
        {point.value === 1 ? "" : "s"}
      </p>
    </div>
  )
}

/** Cadastros por dia da semana — revela se a comunidade cresce mais em dias úteis ou fins de semana. */
export function WeekdayChart({ data }: WeekdayChartProps) {
  const reduced = useReducedMotion()
  const total = data.reduce((acc, d) => acc + d.value, 0)
  const peakValue = Math.max(...data.map((d) => d.value), 0)

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
        Ainda sem histórico suficiente para exibir por dia da semana.
      </div>
    )
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#EFEFEC" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#8A8A85", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} tick={{ fill: "#8A8A85", fontSize: 11 }} />
          <Tooltip cursor={{ fill: "var(--kv-teal)", fillOpacity: 0.08 }} content={<WeekdayTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={!reduced} animationDuration={700} maxBarSize={36}>
            {data.map((d) => (
              <Cell
                key={d.label}
                fill={d.value === peakValue ? "var(--kv-gold-dark)" : "var(--kv-teal)"}
                fillOpacity={d.value === peakValue ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
