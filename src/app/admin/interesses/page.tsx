"use client"

import { useMemo, useState } from "react"
import { Plus, Pencil, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { InterestFormModal } from "@/components/admin/InterestFormModal"
import { useAdmin } from "@/lib/admin/store"
import type { AdminInterest } from "@/lib/admin/types"

export default function InterestsPage() {
  const { interests, toggleInterest } = useAdmin()
  const [editing, setEditing] = useState<AdminInterest | null>(null)
  const [creating, setCreating] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, AdminInterest[]>()
    for (const i of interests) {
      const list = map.get(i.category) ?? []
      list.push(i)
      map.set(i.category, list)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [interests])

  const activeCount = interests.filter((i) => i.active).length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {interests.length} interesses · {activeCount} ativos
        </p>
        <Button onClick={() => setCreating(true)}>
          <Plus /> Novo interesse
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {grouped.map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category}</span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                  {items.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <ul className="flex flex-col divide-y divide-neutral-50">
                {items.map((interest) => (
                  <li key={interest.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            interest.active
                              ? "text-sm font-medium text-neutral-800"
                              : "text-sm font-medium text-neutral-400 line-through"
                          }
                        >
                          {interest.name}
                        </span>
                        {!interest.active && (
                          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-xs text-neutral-400">
                        <Users className="size-3" /> {interest.memberCount} membros · {interest.slug}
                      </p>
                    </div>
                    <Switch
                      checked={interest.active}
                      onCheckedChange={() => toggleInterest(interest.id)}
                      aria-label={`Ativar ${interest.name}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditing(interest)}
                      aria-label={`Editar ${interest.name}`}
                    >
                      <Pencil />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <InterestFormModal interest={null} open={creating} onClose={() => setCreating(false)} />
      <InterestFormModal
        interest={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
      />
    </div>
  )
}
