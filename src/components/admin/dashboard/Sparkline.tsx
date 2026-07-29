interface SparklineProps {
  /** Série de valores (ordem cronológica). Precisa de pelo menos 2 pontos para desenhar uma linha. */
  data: number[]
  color?: string
  className?: string
}

const WIDTH = 88
const HEIGHT = 28
const PADDING = 3

/** Mini gráfico de tendência (linha + área leve) para o valor de um StatCard — sem dependências extras. */
export function Sparkline({ data, color = "var(--kv-teal)", className }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const innerWidth = WIDTH - PADDING * 2
  const innerHeight = HEIGHT - PADDING * 2

  const points = data.map((value, i) => {
    const x = PADDING + (i / (data.length - 1)) * innerWidth
    const y = PADDING + innerHeight - ((value - min) / range) * innerHeight
    return [x, y] as const
  })

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${HEIGHT} L${points[0][0].toFixed(1)},${HEIGHT} Z`

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className={className}
      role="img"
      aria-label="Tendência dos últimos meses"
    >
      <path d={areaPath} fill={color} opacity={0.1} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2.5} fill={color} />
    </svg>
  )
}
