import { cn } from "@/lib/utils"
import type { RankedItem } from "@/lib/admin/types"

interface BarListProps {
  items: RankedItem[]
  color?: string
  emptyLabel?: string
}

/** Lista horizontal de barras proporcionais (cidades, interesses, perfis...). */
export function BarList({ items, color = "var(--kv-teal)", emptyLabel = "Sem dados" }: BarListProps) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">{emptyLabel}</p>
  }
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-neutral-700">{item.label}</span>
            <span className="ml-2 shrink-0 font-medium text-neutral-500">{item.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className={cn("h-full rounded-full transition-all")}
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
