import { cn } from "@/lib/utils"

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const PALETTE = [
  "bg-[var(--kv-teal)]/15 text-[var(--kv-teal-dark)]",
  "bg-[var(--kv-gold)]/18 text-[var(--kv-gold-dark)]",
  "bg-[var(--kv-coral)]/15 text-[var(--kv-coral)]",
  "bg-[var(--kv-verde)]/15 text-[var(--kv-verde)]",
]

function paletteFor(name: string): string {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PALETTE[sum % PALETTE.length]
}

interface AvatarProps {
  name: string
  photoUrl?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
}

export function Avatar({ name, photoUrl, size = "md", className }: AvatarProps) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className={cn("rounded-full object-cover", SIZES[size], className)}
      />
    )
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        SIZES[size],
        paletteFor(name),
        className
      )}
    >
      {initials(name)}
    </span>
  )
}
