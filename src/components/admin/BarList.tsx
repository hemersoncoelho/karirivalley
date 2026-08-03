import { useState } from "react"
import { cn } from "@/lib/utils"
import type { RankedItem } from "@/lib/admin/types"

interface BarListProps {
  items: RankedItem[]
  color?: string
  emptyLabel?: string
  /** Quando presente, cada barra vira um botão que navega/filtra por aquele item. */
  onItemClick?: (label: string) => void
}

/**
 * Lista horizontal de barras proporcionais (cidades, interesses, perfis...).
 * HTML puro (não SVG) de propósito: rótulos em português variam bastante de
 * tamanho ("Varejo/E-commerce", "Parceiro institucional") e um `<title>`
 * nativo garante que nada seja cortado sem explicação — a barra nunca perde
 * o rótulo completo, só o exibe truncado com reticências quando necessário.
 */
export function BarList({ items, color = "var(--kv-teal)", emptyLabel = "Sem dados", onItemClick }: BarListProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">{emptyLabel}</p>
  }
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isHovered = hovered === item.label
        return (
          <li key={item.label}>
            <div
              role={onItemClick ? "button" : undefined}
              tabIndex={onItemClick ? 0 : undefined}
              onClick={onItemClick ? () => onItemClick(item.label) : undefined}
              onKeyDown={
                onItemClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") onItemClick(item.label)
                    }
                  : undefined
              }
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex flex-col gap-1 rounded-md px-1 py-0.5 -mx-1 transition-colors",
                onItemClick && "cursor-pointer hover:bg-neutral-50"
              )}
            >
              <div className="flex items-center justify-between gap-2 text-sm">
                <span
                  className={cn("min-w-0 truncate text-neutral-700", isHovered && onItemClick && "font-medium text-neutral-900")}
                  title={item.label}
                >
                  {item.label}
                </span>
                <span className="shrink-0 font-medium tabular-nums text-neutral-500">{item.value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-r-full transition-[width,opacity] duration-700 ease-out"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    backgroundColor: color,
                    opacity: isHovered && onItemClick ? 1 : 0.85,
                  }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
