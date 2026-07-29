"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "./useReducedMotion"

const DURATION_MS = 900

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Anima um valor numérico contando de 0 até `value` ao montar / quando `value`
 * muda. Cai para o valor final imediatamente se `prefers-reduced-motion` ou se
 * o valor não for um número finito.
 */
export function useCountUp(value: number): number {
  const reduced = useReducedMotion()
  const skip = reduced || !Number.isFinite(value)
  const [animated, setAnimated] = useState(() => (skip ? value : 0))
  const frame = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (skip) return undefined

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      setAnimated(Math.round(value * easeOutCubic(progress)))
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    }
  }, [value, skip])

  return skip ? value : animated
}
