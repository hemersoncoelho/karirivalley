"use client"

import { cn } from "@/lib/utils"

interface GrowthPeriodToggleProps {
  value: number
  onChange: (months: number) => void
  options?: number[]
}

/** Seletor de janela temporal (3/6/12 meses) para o gráfico de crescimento da comunidade. */
export function GrowthPeriodToggle({ value, onChange, options = [3, 6, 12] }: GrowthPeriodToggleProps) {
  return (
    <div className="inline-flex shrink-0 rounded-lg border border-black/5 bg-neutral-50 p-0.5" role="group" aria-label="Período do gráfico de crescimento">
      {options.map((months) => (
        <button
          key={months}
          type="button"
          onClick={() => onChange(months)}
          aria-pressed={value === months}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === months
              ? "bg-white text-neutral-900 shadow-sm shadow-black/5"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          {months}m
        </button>
      ))}
    </div>
  )
}
