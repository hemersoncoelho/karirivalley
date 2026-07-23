interface KaririMarkProps {
  className?: string
  size?: number
}

/** Um único losango do símbolo da Kariri Valley — ouro, coral e o ponto central em teal. */
export function KaririMark({ className, size = 18 }: KaririMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M32 4 L60 32 L32 60 L4 32 Z" stroke="#E9B23C" strokeWidth="5" strokeLinejoin="round" />
      <path d="M32 17 L47 32 L32 47 L17 32 Z" stroke="#E0715A" strokeWidth="4" strokeLinejoin="round" />
      <path d="M32 26 L38 32 L32 38 L26 32 Z" fill="#239D8C" />
    </svg>
  )
}

interface KaririMarkRowProps {
  className?: string
  units?: number
  height?: number
}

/** Faixa decorativa com losangos repetidos, como no cabeçalho da marca. */
export function KaririMarkRow({ className, units = 5, height = 22 }: KaririMarkRowProps) {
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", gap: height * 0.35 }} aria-hidden="true">
      {Array.from({ length: units }).map((_, i) => (
        <KaririMark key={i} size={height} className={i % 2 === 0 ? "" : "opacity-60"} />
      ))}
    </div>
  )
}
