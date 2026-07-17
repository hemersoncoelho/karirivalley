"use client"

import { useMemo, useState } from "react"
import { Search, Download, Filter } from "lucide-react"
import { Avatar } from "@/components/admin/Avatar"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { MemberActions } from "@/components/admin/MemberActions"
import { MemberDetailModal, MemberEditModal } from "@/components/admin/MemberDetail"
import { Card } from "@/components/ui/card"
import { Input, Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin/store"
import { isIncomplete, profileCompleteness } from "@/lib/admin/metrics"
import { formatDate, occupationLabel, STATUS_LABELS } from "@/lib/admin/labels"
import type { AdminMember, MemberStatus } from "@/lib/admin/types"

const STATUS_OPTIONS: (MemberStatus | "all")[] = [
  "all",
  "pending",
  "approved",
  "blocked",
  "rejected",
]

function CompletenessTag({ member }: { member: AdminMember }) {
  const incomplete = isIncomplete(member)
  const pct = profileCompleteness(member)
  return (
    <span
      className={
        incomplete
          ? "inline-flex items-center gap-1 rounded-full bg-[var(--kv-coral)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--kv-coral)]"
          : "inline-flex items-center gap-1 rounded-full bg-[var(--kv-teal)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--kv-teal-dark)]"
      }
    >
      {incomplete ? "Incompleto" : "Completo"} · {pct}%
    </span>
  )
}

export default function MembersPage() {
  const { members } = useAdmin()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<MemberStatus | "all">("all")
  const [city, setCity] = useState("all")
  const [detail, setDetail] = useState<AdminMember | null>(null)
  const [editing, setEditing] = useState<AdminMember | null>(null)

  const cities = useMemo(
    () => Array.from(new Set(members.map((m) => m.city))).sort(),
    [members]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members
      .filter((m) => (status === "all" ? true : m.status === status))
      .filter((m) => (city === "all" ? true : m.city === city))
      .filter((m) => {
        if (!q) return true
        return (
          m.fullName.toLowerCase().includes(q) ||
          (m.displayName ?? "").toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.company ?? "").toLowerCase().includes(q)
        )
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [members, query, status, city])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {filtered.length} de {members.length} membros
        </p>
        <Button variant="outline" size="sm" title="Exportar CSV (em breve)">
          <Download /> Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail ou empresa..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 shrink-0 text-neutral-400" />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as MemberStatus | "all")}
              className="w-auto"
              aria-label="Filtrar por status"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "Todos os status" : STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-auto"
              aria-label="Filtrar por cidade"
            >
              <option value="all">Todas as cidades</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabela (desktop) */}
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Cidade</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cadastro</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-neutral-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.displayName || m.fullName} photoUrl={m.photoUrl} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-800">
                          {m.displayName || m.fullName}
                        </p>
                        <p className="truncate text-xs text-neutral-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{m.city}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {m.occupationAreas.slice(0, 2).map(occupationLabel).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3">
                    <CompletenessTag member={m} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <MemberActions
                        member={m}
                        onViewDetails={setDetail}
                        onEdit={setEditing}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-neutral-400">
                    Nenhum membro encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar name={m.displayName || m.fullName} photoUrl={m.photoUrl} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-800">
                  {m.displayName || m.fullName}
                </p>
                <p className="truncate text-xs text-neutral-400">{m.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={m.status} />
                  <CompletenessTag member={m} />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  {m.city} · {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-neutral-100 pt-3">
              <MemberActions
                member={m}
                onViewDetails={setDetail}
                onEdit={setEditing}
                layout="compact"
              />
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-neutral-400">
            Nenhum membro encontrado.
          </p>
        )}
      </div>

      <MemberDetailModal member={detail} open={!!detail} onClose={() => setDetail(null)} />
      <MemberEditModal member={editing} open={!!editing} onClose={() => setEditing(null)} />
    </div>
  )
}
