"use client"

import { useMemo, useState } from "react"
import { Search, SearchX } from "lucide-react"

import type { DirectoryMember } from "@/lib/members/directory"
import { MemberCard } from "@/components/member/MemberCard"
import { EmptyState } from "@/components/member/EmptyState"
import { OCCUPATION_LABELS } from "@/components/member/occupation-labels"
import { inputClass, SelectInput } from "@/components/onboarding/fields"

const ALL = "all"

interface DirectoryClientProps {
  members: DirectoryMember[]
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "pt-BR"))
}

export function DirectoryClient({ members }: DirectoryClientProps) {
  const [search, setSearch] = useState("")
  const [city, setCity] = useState(ALL)
  const [area, setArea] = useState(ALL)
  const [interest, setInterest] = useState(ALL)
  const [need, setNeed] = useState(ALL)
  const [offer, setOffer] = useState(ALL)

  const cities = useMemo(() => uniqueSorted(members.map((m) => m.city).filter((v): v is string => Boolean(v))), [members])
  const areas = useMemo(() => uniqueSorted(members.flatMap((m) => m.occupation_areas)), [members])
  const interests = useMemo(() => uniqueSorted(members.flatMap((m) => m.interest_slugs)), [members])
  const needs = useMemo(() => uniqueSorted(members.flatMap((m) => m.need_titles)), [members])
  const offers = useMemo(() => uniqueSorted(members.flatMap((m) => m.offer_titles)), [members])

  const filtered = members.filter((m) => {
    const term = search.trim().toLowerCase()
    if (term && !m.name.toLowerCase().includes(term) && !(m.company ?? "").toLowerCase().includes(term)) return false
    if (city !== ALL && m.city !== city) return false
    if (area !== ALL && !m.occupation_areas.includes(area)) return false
    if (interest !== ALL && !m.interest_slugs.includes(interest)) return false
    if (need !== ALL && !m.need_titles.includes(need)) return false
    if (offer !== ALL && !m.offer_titles.includes(offer)) return false
    return true
  })

  function clearFilters() {
    setSearch("")
    setCity(ALL)
    setArea(ALL)
    setInterest(ALL)
    setNeed(ALL)
    setOffer(ALL)
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#F4EDDF]/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou empresa..."
          className={`${inputClass} pl-10`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <SelectInput value={city} onChange={(e) => setCity(e.target.value)} className="w-auto">
          <option value={ALL}>Todas as cidades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectInput>
        <SelectInput value={area} onChange={(e) => setArea(e.target.value)} className="w-auto">
          <option value={ALL}>Todas as áreas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {OCCUPATION_LABELS[a] ?? a}
            </option>
          ))}
        </SelectInput>
        <SelectInput value={interest} onChange={(e) => setInterest(e.target.value)} className="w-auto">
          <option value={ALL}>Todos os interesses</option>
          {interests.map((i) => (
            <option key={i} value={i}>
              {i.replace(/-/g, " ")}
            </option>
          ))}
        </SelectInput>
        <SelectInput value={need} onChange={(e) => setNeed(e.target.value)} className="w-auto">
          <option value={ALL}>O que busca</option>
          {needs.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </SelectInput>
        <SelectInput value={offer} onChange={(e) => setOffer(e.target.value)} className="w-auto">
          <option value={ALL}>O que oferece</option>
          {offers.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </SelectInput>
      </div>

      <p className="text-xs text-[#F4EDDF]/40">
        {filtered.length} {filtered.length === 1 ? "membro encontrado" : "membros encontrados"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nenhum membro encontrado para este filtro"
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
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  )
}
