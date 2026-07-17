"use client"

import { useState } from "react"
import { Plus, Calendar, MapPin, Users, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input, Label, Textarea } from "@/components/ui/input"
import { FuturePhaseBanner } from "@/components/admin/FuturePhaseBanner"
import { useAdmin } from "@/lib/admin/store"
import { EVENT_STATUS_LABELS, formatDate } from "@/lib/admin/labels"
import type { EventStatus } from "@/lib/admin/types"

const STATUS_STYLE: Record<EventStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  published: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  past: "bg-neutral-100 text-neutral-400",
}

function EventFormModal({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Estrutura visual — a publicação e as inscrições serão ativadas em fase futura."
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
          <Label htmlFor="ev-title">Título</Label>
          <Input id="ev-title" placeholder="Ex.: Kariri Valley Meetup #2" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ev-desc">Descrição</Label>
          <Textarea id="ev-desc" placeholder="Sobre o evento..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-date">Data e hora</Label>
            <Input id="ev-date" type="datetime-local" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-cap">Capacidade</Label>
            <Input id="ev-cap" type="number" placeholder="80" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ev-loc">Local</Label>
          <Input id="ev-loc" placeholder="Cidade / endereço" />
        </div>
      </div>
    </Modal>
  )
}

export default function EventsPage() {
  const { events } = useAdmin()
  const [modal, setModal] = useState<{ open: boolean; title: string }>({ open: false, title: "" })

  return (
    <div className="flex flex-col gap-5">
      <FuturePhaseBanner>
        <strong>Fase futura.</strong> A estrutura visual de eventos está pronta. A publicação, o
        RSVP e a gestão de inscritos serão integrados ao banco em uma próxima etapa.
      </FuturePhaseBanner>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{events.length} eventos</p>
        <Button onClick={() => setModal({ open: true, title: "Novo evento" })}>
          <Plus /> Criar evento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => (
          <Card key={ev.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-neutral-900">{ev.title}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[ev.status]}`}
                >
                  {EVENT_STATUS_LABELS[ev.status]}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-neutral-500">{ev.description}</p>
              <div className="flex flex-col gap-1.5 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> {formatDate(ev.startsAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {ev.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" /> {ev.registrationsCount}
                  {ev.capacity ? ` / ${ev.capacity}` : ""} inscritos
                </span>
              </div>
              <div className="flex gap-2 border-t border-neutral-100 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setModal({ open: true, title: "Editar evento" })}
                >
                  <Pencil /> Editar
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" disabled title="Fase futura">
                  <Users /> Inscritos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EventFormModal
        open={modal.open}
        title={modal.title}
        onClose={() => setModal({ open: false, title: "" })}
      />
    </div>
  )
}
