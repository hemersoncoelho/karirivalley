import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon size={22} strokeWidth={1.5} className="text-[#F4EDDF]/50" />
      </div>
      <p className="text-sm font-medium text-[#F4EDDF]/85">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-sm text-xs text-[#F4EDDF]/45">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
