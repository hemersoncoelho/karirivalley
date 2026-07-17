import { Sparkles } from "lucide-react"

export function FuturePhaseBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--kv-gold)]/30 bg-[var(--kv-gold)]/8 px-4 py-3">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--kv-gold-dark)]" />
      <p className="text-sm text-[var(--kv-gold-dark)]">{children}</p>
    </div>
  )
}
