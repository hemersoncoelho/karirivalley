"use client"

import { useEffect, useState } from "react"

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Reflete `prefers-reduced-motion: reduce` do sistema. Usado para desativar
 * animações de gráficos, contadores e microinterações do observatório admin.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readPrefersReducedMotion)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
  }, [])

  return reduced
}
