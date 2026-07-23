"use client"

import { useMemo, useState } from "react"
import { Search, SearchX } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { StartupCard } from "@/components/member/StartupCard"
import { EmptyState } from "@/components/member/EmptyState"
import { STARTUP_SECTOR_LABELS } from "@/lib/onboarding/options"
import { inputClass, SelectInput } from "@/components/onboarding/fields"

const ALL = "all"

interface StartupsClientProps {
  startups: DirectoryMember[]
}

export function StartupsClient({ startups }: StartupsClientProps) {
  const [search, setSearch] = useState("")
  const [sector, setSector] = useState(ALL)

  const sectors = useMemo(
    () => Array.from(new Set(startups.map((s) => s.startup_sector).filter((v): v is string => Boolean(v)))),
    [startups]
  )

  const filtered = startups.filter((s) => {
    const term = search.trim().toLowerCase()
    if (term && !(s.startup_name ?? "").toLowerCase().includes(term) && !s.name.toLowerCase().includes(term)) {
      return false
    }
    if (sector !== ALL && s.startup_sector !== sector) return false
    return true
  })

  function clearFilters() {
    setSearch("")
    setSector(ALL)
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#F4EDDF]/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome da startup ou fundador..."
          className={`${inputClass} pl-10`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <SelectInput value={sector} onChange={(e) => setSector(e.target.value)} className="w-auto">
          <option value={ALL}>Todos os setores</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {STARTUP_SECTOR_LABELS[s] ?? s}
            </option>
          ))}
        </SelectInput>
      </div>

      <p className="text-xs text-[#F4EDDF]/40">
        {filtered.length} {filtered.length === 1 ? "startup encontrada" : "startups encontradas"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nenhuma startup encontrada para este filtro"
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-[#F4EDDF]/80 hover:bg-white/5"
            >
              Limpar filtros
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StartupCard key={s.id} member={s} />
          ))}
        </div>
      )}
    </div>
  )
}
