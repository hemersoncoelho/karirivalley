"use client"

import { useCountUp } from "@/lib/admin/useCountUp"

/** Número que conta suavemente até `value` ao montar (respeita prefers-reduced-motion). */
export function CountUpValue({ value }: { value: number }) {
  const display = useCountUp(value)
  return <>{display.toLocaleString("pt-BR")}</>
}
