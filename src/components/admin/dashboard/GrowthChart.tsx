"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useReducedMotion } from "@/lib/admin/useReducedMotion"
import type { GrowthPoint } from "@/lib/admin/types"

interface GrowthChartProps {
  data: GrowthPoint[]
}

interface TooltipPayload {
  payload: GrowthPoint
}

function GrowthTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2 text-xs shadow-lg shadow-black/10">
      <p className="font-medium text-neutral-800 capitalize">{point.label}</p>
      <p className="mt-1 text-neutral-600">
        <span className="font-semibold text-[var(--kv-teal-dark)]">{point.total}</span> membros no total
      </p>
      <p className="text-neutral-400">
        {point.newCount > 0 ? `+${point.newCount} novo${point.newCount === 1 ? "" : "s"} no mês` : "sem novos no mês"}
      </p>
    </div>
  )
}

/** Série temporal de crescimento acumulado da comunidade — derivada de members.created_at. */
export function GrowthChart({ data }: GrowthChartProps) {
  const reduced = useReducedMotion()
  const isFlat = data.every((d) => d.total === 0)

  return (
    <div className="relative h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="kv-growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--kv-teal)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--kv-teal)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EFEFEC" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8A8A85", fontSize: 12 }}
            className="capitalize"
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fill: "#8A8A85", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--kv-teal)", strokeWidth: 1, strokeOpacity: 0.3 }}
            content={<GrowthTooltip />}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--kv-teal)"
            strokeWidth={2}
            fill="url(#kv-growth-fill)"
            isAnimationActive={!reduced}
            animationDuration={900}
            dot={{ r: 3, fill: "var(--kv-teal)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--kv-teal-dark)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {isFlat && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
          Ainda sem histórico suficiente para exibir crescimento.
        </p>
      )}
    </div>
  )
}
