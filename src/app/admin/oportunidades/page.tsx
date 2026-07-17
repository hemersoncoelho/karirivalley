"use client"

import { useState } from "react"
import { Plus, CalendarClock, Tag as TagIcon, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input, Label, Select, Textarea } from "@/components/ui/input"
import { FuturePhaseBanner } from "@/components/admin/FuturePhaseBanner"
import { useAdmin } from "@/lib/admin/store"
import {
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
  formatDate,
} from "@/lib/admin/labels"
import type { OpportunityStatus, OpportunityType } from "@/lib/admin/types"

const STATUS_STYLE: Record<OpportunityStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  open: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  closed: "bg-neutral-100 text-neutral-400",
}

function OpportunityFormModal({
  open,
  onClose,
  title,
}: {
  open: boolean
  onClose: () => void
  title: string
}) {
  const types = Object.entries(OPPORTUNITY_TYPE_LABELS) as [OpportunityType, string][]
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Estrutura visual — a submissão e a avaliação serão ativadas em fase futura."
      className="sm:max-w-lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled title="Disponível em fase futura">
            Salvar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="op-title">Título</Label>
          <Input id="op-title" placeholder="Ex.: Edital de Aceleração 2025" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-type">Tipo</Label>
            <Select id="op-type" defaultValue="edital">
              {types.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-deadline">Prazo</Label>
            <Input id="op-deadline" type="date" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="op-desc">Descrição</Label>
          <Textarea id="op-desc" placeholder="Detalhes da oportunidade..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="op-tags">Tags (separadas por vírgula)</Label>
          <Input id="op-tags" placeholder="investimento, early-stage, remoto" />
        </div>
      </div>
    </Modal>
  )
}

export default function OpportunitiesPage() {
  const { opportunities } = useAdmin()
  const [modal, setModal] = useState<{ open: boolean; title: string }>({ open: false, title: "" })

  return (
    <div className="flex flex-col gap-5">
      <FuturePhaseBanner>
        <strong>Fase futura.</strong> A estrutura visual de oportunidades está pronta. O fluxo de
        submissão, prazos e candidaturas será integrado ao banco em uma próxima etapa.
      </FuturePhaseBanner>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{opportunities.length} oportunidades</p>
        <Button onClick={() => setModal({ open: true, title: "Nova oportunidade" })}>
          <Plus /> Criar oportunidade
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((op) => (
          <Card key={op.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-[var(--kv-coral)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--kv-coral)]">
                  {OPPORTUNITY_TYPE_LABELS[op.type]}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[op.status]}`}
                >
                  {OPPORTUNITY_STATUS_LABELS[op.status]}
                </span>
              </div>
              <h3 className="font-semibold text-neutral-900">{op.title}</h3>
              <p className="line-clamp-2 text-sm text-neutral-500">{op.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <CalendarClock className="size-3.5" />
                {op.deadline ? `Prazo: ${formatDate(op.deadline)}` : "Sem prazo definido"}
              </div>
              {op.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <TagIcon className="size-3.5 text-neutral-400" />
                  {op.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setModal({ open: true, title: "Editar oportunidade" })}
                >
                  <Pencil /> Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OpportunityFormModal
        open={modal.open}
        title={modal.title}
        onClose={() => setModal({ open: false, title: "" })}
      />
    </div>
  )
}
