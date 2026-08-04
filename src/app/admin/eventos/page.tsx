"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Pencil,
  CalendarCheck2,
  FileClock,
  CalendarX2,
  Ticket,
  X,
  ImagePlus,
  Globe,
  Lock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input, Label, Select, Textarea } from "@/components/ui/input"
import { FuturePhaseBanner } from "@/components/admin/FuturePhaseBanner"
import { StatCard } from "@/components/admin/StatCard"
import { BarList } from "@/components/admin/BarList"
import { useAdmin } from "@/lib/admin/store"
import { computeEventStats } from "@/lib/admin/metrics"
import { EVENT_STATUS_LABELS, formatDate } from "@/lib/admin/labels"
import { uploadEventBanner, validatePhotoFile } from "@/lib/admin/uploads"
import type { AdminEvent, EventInput, EventScheduleItem, EventStatus } from "@/lib/admin/types"

const STATUS_STYLE: Record<EventStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  published: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  cancelled: "bg-red-50 text-red-500",
  finished: "bg-neutral-100 text-neutral-400",
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface EventFormState {
  title: string
  description: string
  startsAt: string
  location: string
  capacity: string
  status: EventStatus
  isPublic: boolean
  scheduleItems: EventScheduleItem[]
}

function emptyForm(): EventFormState {
  return {
    title: "",
    description: "",
    startsAt: "",
    location: "",
    capacity: "",
    status: "draft",
    isPublic: true,
    scheduleItems: [],
  }
}

function buildFormState(event: AdminEvent | null): EventFormState {
  if (!event) return emptyForm()
  return {
    title: event.title,
    description: event.description,
    startsAt: toDatetimeLocalValue(event.startsAt),
    location: event.location,
    capacity: event.capacity != null ? String(event.capacity) : "",
    status: event.status,
    isPublic: event.isPublic,
    scheduleItems: event.scheduleItems,
  }
}

interface EventFormModalProps {
  open: boolean
  onClose: () => void
  title: string
  event: AdminEvent | null
}

function EventFormModal({ open, onClose, title, event }: EventFormModalProps) {
  const { createEvent, updateEvent } = useAdmin()
  const [form, setForm] = useState<EventFormState>(() => buildFormState(event))
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(event?.bannerUrl ?? null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const validationError = validatePhotoFile(file)
    if (validationError) {
      setFormError(validationError)
      return
    }
    setFormError(null)
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  function updateScheduleItem(index: number, patch: Partial<EventScheduleItem>) {
    setForm((prev) => ({
      ...prev,
      scheduleItems: prev.scheduleItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  function addScheduleItem() {
    setForm((prev) => ({ ...prev, scheduleItems: [...prev.scheduleItems, { time: "", title: "" }] }))
  }

  function removeScheduleItem(index: number) {
    setForm((prev) => ({ ...prev, scheduleItems: prev.scheduleItems.filter((_, i) => i !== index) }))
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.startsAt) {
      setFormError("Preencha ao menos o título e a data/hora do evento.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      let bannerUrl = event?.bannerUrl ?? null
      if (bannerFile) {
        const folderId = event?.id ?? crypto.randomUUID()
        bannerUrl = await uploadEventBanner(folderId, bannerFile)
      }

      const input: EventInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        startsAt: new Date(form.startsAt).toISOString(),
        location: form.location.trim(),
        capacity: form.capacity ? Number(form.capacity) : null,
        status: form.status,
        isPublic: form.isPublic,
        bannerUrl,
        scheduleItems: form.scheduleItems.filter((item) => item.time.trim() || item.title.trim()),
      }

      if (event) {
        updateEvent(event.id, input)
      } else {
        createEvent(input)
      }
      onClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Não foi possível salvar o evento")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Preencha os dados do evento e escolha onde ele deve aparecer."
      className="sm:max-w-lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

        <div className="flex items-center gap-4">
          {bannerPreview ? (
            <Image
              src={bannerPreview}
              alt="Imagem do evento"
              width={96}
              height={64}
              className="h-16 w-24 rounded-lg object-cover"
              unoptimized={bannerPreview.startsWith("blob:")}
            />
          ) : (
            <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-neutral-400">
              <ImagePlus className="size-5" />
            </div>
          )}
          <label className="cursor-pointer rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            {bannerPreview ? "Trocar imagem" : "Adicionar imagem"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleBannerChange}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ev-title">Título</Label>
          <Input
            id="ev-title"
            placeholder="Ex.: Kariri Valley Meetup #2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ev-desc">Descrição</Label>
          <Textarea
            id="ev-desc"
            placeholder="Sobre o evento..."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-date">Data e hora</Label>
            <Input
              id="ev-date"
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm((prev) => ({ ...prev, startsAt: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-cap">Capacidade</Label>
            <Input
              id="ev-cap"
              type="number"
              placeholder="80"
              value={form.capacity}
              onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ev-loc">Local</Label>
          <Input
            id="ev-loc"
            placeholder="Cidade / endereço"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-visibility">Onde aparece</Label>
            <Select
              id="ev-visibility"
              value={form.isPublic ? "public" : "members"}
              onChange={(e) => setForm((prev) => ({ ...prev, isPublic: e.target.value === "public" }))}
            >
              <option value="public">Site (visitantes e membros)</option>
              <option value="members">Somente membros</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ev-status">Status</Label>
            <Select
              id="ev-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as EventStatus }))}
            >
              {(Object.entries(EVENT_STATUS_LABELS) as [EventStatus, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Programação</Label>
            <button
              type="button"
              onClick={addScheduleItem}
              className="text-xs font-medium text-[var(--kv-teal-dark)] hover:underline"
            >
              + Adicionar item
            </button>
          </div>
          {form.scheduleItems.length === 0 && (
            <p className="text-xs text-neutral-400">Nenhum item adicionado.</p>
          )}
          {form.scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="16:30"
                className="w-24"
                value={item.time}
                onChange={(e) => updateScheduleItem(index, { time: e.target.value })}
              />
              <Input
                placeholder="Credenciamento"
                value={item.title}
                onChange={(e) => updateScheduleItem(index, { title: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeScheduleItem(index)}
                aria-label="Remover item"
                className="shrink-0 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default function EventsPage() {
  const { events } = useAdmin()
  const stats = useMemo(() => computeEventStats(events), [events])
  const [modal, setModal] = useState<{ open: boolean; title: string; event: AdminEvent | null }>({
    open: false,
    title: "",
    event: null,
  })

  return (
    <div className="flex flex-col gap-5">
      <FuturePhaseBanner>
        <strong>Publicação ativa.</strong> A gestão de inscritos (RSVP) segue como fase futura — os
        demais campos (imagem, programação e visibilidade) já são salvos no banco.
      </FuturePhaseBanner>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total de eventos" value={stats.total} icon={Calendar} tone="neutral" />
        <StatCard label="Publicados" value={stats.published} icon={CalendarCheck2} tone="teal" />
        <StatCard label="Rascunhos" value={stats.draft} icon={FileClock} tone="amber" />
        <StatCard label="Passados" value={stats.past} icon={CalendarX2} tone="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="size-4 text-[var(--kv-teal)]" />
            Eventos com mais inscritos ({stats.totalRegistrations} inscrições no total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarList items={stats.topByRegistrations} color="var(--kv-teal)" emptyLabel="Nenhum evento cadastrado ainda" />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{events.length} eventos</p>
        <Button onClick={() => setModal({ open: true, title: "Novo evento", event: null })}>
          <Plus /> Criar evento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => (
          <Card key={ev.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-neutral-900">{ev.title}</h3>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[ev.status]}`}
                  >
                    {EVENT_STATUS_LABELS[ev.status]}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                    {ev.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                    {ev.isPublic ? "Site" : "Membros"}
                  </span>
                </div>
              </div>
              <p className="line-clamp-2 text-sm text-neutral-500">{ev.description}</p>
              <div className="flex flex-col gap-1.5 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> {formatDate(ev.startsAt)}
                </span>
                {ev.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {ev.location}
                  </span>
                )}
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
                  onClick={() => setModal({ open: true, title: "Editar evento", event: ev })}
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
        key={`${modal.open}-${modal.event?.id ?? "new"}`}
        open={modal.open}
        title={modal.title}
        event={modal.event}
        onClose={() => setModal({ open: false, title: "", event: null })}
      />
    </div>
  )
}
