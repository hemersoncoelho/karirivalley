"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Plus,
  CalendarClock,
  Tag as TagIcon,
  Pencil,
  Briefcase,
  FileClock,
  CircleCheck,
  CircleX,
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
import { computeOpportunityStats } from "@/lib/admin/metrics"
import {
  OPPORTUNITY_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
  formatDate,
} from "@/lib/admin/labels"
import { uploadOpportunityBanner, validatePhotoFile } from "@/lib/admin/uploads"
import type { AdminOpportunity, OpportunityInput, OpportunityStatus, OpportunityType } from "@/lib/admin/types"

const STATUS_STYLE: Record<OpportunityStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  published: "bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]",
  expired: "bg-amber-50 text-amber-600",
  archived: "bg-neutral-100 text-neutral-400",
}

interface OpportunityFormState {
  title: string
  description: string
  type: OpportunityType
  externalUrl: string
  deadline: string
  status: OpportunityStatus
  isPublic: boolean
}

function emptyForm(): OpportunityFormState {
  return {
    title: "",
    description: "",
    type: "edital",
    externalUrl: "",
    deadline: "",
    status: "draft",
    isPublic: true,
  }
}

function buildFormState(opportunity: AdminOpportunity | null): OpportunityFormState {
  if (!opportunity) return emptyForm()
  return {
    title: opportunity.title,
    description: opportunity.description,
    type: opportunity.type,
    externalUrl: opportunity.externalUrl,
    deadline: opportunity.deadline ? opportunity.deadline.slice(0, 10) : "",
    status: opportunity.status,
    isPublic: opportunity.isPublic,
  }
}

interface OpportunityFormModalProps {
  open: boolean
  onClose: () => void
  title: string
  opportunity: AdminOpportunity | null
}

function OpportunityFormModal({ open, onClose, title, opportunity }: OpportunityFormModalProps) {
  const { createOpportunity, updateOpportunity } = useAdmin()
  const types = Object.entries(OPPORTUNITY_TYPE_LABELS) as [OpportunityType, string][]
  const statuses = Object.entries(OPPORTUNITY_STATUS_LABELS) as [OpportunityStatus, string][]

  const [form, setForm] = useState<OpportunityFormState>(() => buildFormState(opportunity))
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(opportunity?.bannerUrl ?? null)
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

  async function handleSubmit() {
    if (!form.title.trim() || !form.externalUrl.trim()) {
      setFormError("Preencha ao menos o título e o link da oportunidade.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      let bannerUrl = opportunity?.bannerUrl ?? null
      if (bannerFile) {
        const folderId = opportunity?.id ?? crypto.randomUUID()
        bannerUrl = await uploadOpportunityBanner(folderId, bannerFile)
      }

      const input: OpportunityInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        externalUrl: form.externalUrl.trim(),
        deadline: form.deadline || null,
        status: form.status,
        isPublic: form.isPublic,
        bannerUrl,
      }

      if (opportunity) {
        updateOpportunity(opportunity.id, input)
      } else {
        createOpportunity(input)
      }
      onClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Não foi possível salvar a oportunidade")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Preencha os dados da oportunidade e o link para a submissão."
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
              alt="Imagem da oportunidade"
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
          <Label htmlFor="op-title">Título</Label>
          <Input
            id="op-title"
            placeholder="Ex.: Edital de Aceleração 2025"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-type">Tipo</Label>
            <Select
              id="op-type"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as OpportunityType }))}
            >
              {types.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-deadline">Prazo</Label>
            <Input
              id="op-deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="op-desc">Descrição</Label>
          <Textarea
            id="op-desc"
            placeholder="Detalhes da oportunidade..."
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="op-url">Link para submissão</Label>
          <Input
            id="op-url"
            type="url"
            placeholder="https://..."
            value={form.externalUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, externalUrl: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-visibility">Onde aparece</Label>
            <Select
              id="op-visibility"
              value={form.isPublic ? "public" : "members"}
              onChange={(e) => setForm((prev) => ({ ...prev, isPublic: e.target.value === "public" }))}
            >
              <option value="public">Site (visitantes e membros)</option>
              <option value="members">Somente membros</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="op-status">Status</Label>
            <Select
              id="op-status"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as OpportunityStatus }))}
            >
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function OpportunitiesPage() {
  const { opportunities } = useAdmin()
  const stats = useMemo(() => computeOpportunityStats(opportunities), [opportunities])
  const [modal, setModal] = useState<{ open: boolean; title: string; opportunity: AdminOpportunity | null }>({
    open: false,
    title: "",
    opportunity: null,
  })

  return (
    <div className="flex flex-col gap-5">
      <FuturePhaseBanner>
        <strong>Publicação ativa.</strong> O fluxo de submissão e candidaturas segue como fase futura —
        a criação, edição e publicação de oportunidades já são salvas no banco.
      </FuturePhaseBanner>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total de oportunidades" value={stats.total} icon={Briefcase} tone="neutral" />
        <StatCard label="Abertas" value={stats.open} icon={CircleCheck} tone="teal" />
        <StatCard label="Rascunhos" value={stats.draft} icon={FileClock} tone="amber" />
        <StatCard label="Encerradas" value={stats.closed} icon={CircleX} tone="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TagIcon className="size-4 text-[var(--kv-coral)]" />
            Oportunidades por tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarList
            items={stats.byType}
            color="var(--kv-coral)"
            emptyLabel="Nenhuma oportunidade cadastrada ainda"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{opportunities.length} oportunidades</p>
        <Button onClick={() => setModal({ open: true, title: "Nova oportunidade", opportunity: null })}>
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
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[op.status]}`}
                  >
                    {OPPORTUNITY_STATUS_LABELS[op.status]}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                    {op.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                    {op.isPublic ? "Site" : "Membros"}
                  </span>
                </div>
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
                  onClick={() => setModal({ open: true, title: "Editar oportunidade", opportunity: op })}
                >
                  <Pencil /> Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OpportunityFormModal
        key={`${modal.open}-${modal.opportunity?.id ?? "new"}`}
        open={modal.open}
        title={modal.title}
        opportunity={modal.opportunity}
        onClose={() => setModal({ open: false, title: "", opportunity: null })}
      />
    </div>
  )
}
