"use client"

import { useState } from "react"
import Image from "next/image"
import { Mail, Phone, MapPin, Building2, Link2, Calendar, Rocket } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Input, Label, Select, Textarea } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar } from "./Avatar"
import { StatusBadge, RoleBadge } from "./StatusBadge"
import { ConfirmDialog } from "./ConfirmDialog"
import { useAdmin } from "@/lib/admin/store"
import { profileCompleteness } from "@/lib/admin/metrics"
import { formatDate, occupationLabel, sectorLabel, ROLE_LABELS } from "@/lib/admin/labels"
import { BRAZIL_STATES, STARTUP_STAGE_LABELS } from "@/lib/onboarding/options"
import type { AdminMember, MemberRole } from "@/lib/admin/types"

function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-sm text-neutral-400">—</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function Field({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-400">{label}</p>
        <p className="truncate text-sm text-neutral-800">{value}</p>
      </div>
    </div>
  )
}

export function MemberDetailModal({
  member,
  open,
  onClose,
}: {
  member: AdminMember | null
  open: boolean
  onClose: () => void
}) {
  const { currentUser, changeMemberRole } = useAdmin()
  const [pendingRole, setPendingRole] = useState<MemberRole | null>(null)

  if (!member) return null
  const name = member.displayName || member.fullName
  const pct = profileCompleteness(member)

  const isSelf = member.profileId === currentUser.id
  const canChangeRole = currentUser.role === "admin" && Boolean(member.profileId) && !isSelf

  return (
    <>
      <Modal open={open} onClose={onClose} className="sm:max-w-xl">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <Avatar name={name} photoUrl={member.photoUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-900">{name}</h2>
              <StatusBadge status={member.status} />
              <RoleBadge role={member.role} />
            </div>
            <p className="text-sm text-neutral-500">{member.fullName}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[var(--kv-teal)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500">{pct}% completo</span>
            </div>
          </div>
        </div>

        {currentUser.role === "admin" && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-4 py-3">
            <Label htmlFor="member-role" className="shrink-0">
              Papel
            </Label>
            <Select
              id="member-role"
              className="h-8 w-auto"
              value={member.role}
              disabled={!canChangeRole}
              onChange={(e) => setPendingRole(e.target.value as MemberRole)}
            >
              <option value="member">Membro</option>
              <option value="ambassador">Embaixador</option>
              <option value="admin">Administrador</option>
            </Select>
            <span className="text-xs text-neutral-400">
              {isSelf
                ? "Você não pode alterar seu próprio papel"
                : !member.profileId
                  ? "Disponível após o membro ativar a conta"
                  : "Alterações ficam registradas no log de auditoria"}
            </span>
          </div>
        )}

        {member.bio && <p className="text-sm text-neutral-600">{member.bio}</p>}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field icon={Mail} label="E-mail" value={member.email} />
          <Field icon={Phone} label="WhatsApp" value={member.phone ?? "—"} />
          <Field icon={MapPin} label="Cidade" value={`${member.city}${member.state ? " / " + member.state : ""}`} />
          <Field
            icon={Building2}
            label="Empresa / Cargo"
            value={[member.company, member.position].filter(Boolean).join(" · ") || "—"}
          />
          <Field icon={Calendar} label="Cadastro" value={formatDate(member.createdAt)} />
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          {member.startupName && (
            <div>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                Startup
              </p>
              <div className="flex items-start gap-3">
                {member.startupLogoUrl ? (
                  <Image
                    src={member.startupLogoUrl}
                    alt={member.startupName}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                    <Rocket className="size-4 text-neutral-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-neutral-800">
                    {member.startupName}
                    {member.startupStage && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                        {STARTUP_STAGE_LABELS[member.startupStage] ?? member.startupStage}
                      </span>
                    )}
                    {member.startupSector && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                        {sectorLabel(member.startupSector)}
                      </span>
                    )}
                  </p>
                  {member.startupProblem && (
                    <p className="mt-1 text-xs text-neutral-500">{member.startupProblem}</p>
                  )}
                  {member.startupCnpj && (
                    <p className="mt-1 text-xs text-neutral-400">CNPJ: {member.startupCnpj}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
              Perfil na comunidade
            </p>
            <Chips items={member.occupationAreas.map(occupationLabel)} />
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
              Interesses
            </p>
            <Chips items={member.interests} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                O que busca
              </p>
              <Chips items={member.needs} />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                O que oferece
              </p>
              <Chips items={member.offers} />
            </div>
          </div>
          {member.socialLinks.length > 0 && (
            <div>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                Links
              </p>
              <div className="flex flex-col gap-1">
                {member.socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[var(--kv-teal-dark)] hover:underline"
                  >
                    <Link2 className="size-3.5" />
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </Modal>

      <ConfirmDialog
        open={pendingRole !== null}
        onClose={() => setPendingRole(null)}
        onConfirm={() => {
          if (pendingRole) changeMemberRole(member, pendingRole)
        }}
        title={`Alterar papel de ${name}?`}
        description={pendingRole ? `${ROLE_LABELS[member.role]} → ${ROLE_LABELS[pendingRole]}` : undefined}
        confirmLabel="Confirmar"
        tone={pendingRole === "admin" ? "default" : "destructive"}
      />
    </>
  )
}

export function MemberEditModal({
  member,
  open,
  onClose,
}: {
  member: AdminMember | null
  open: boolean
  onClose: () => void
}) {
  const { editMember } = useAdmin()
  const [form, setForm] = useState({
    displayName: "",
    city: "",
    state: "",
    company: "",
    position: "",
    bio: "",
  })
  const [initialized, setInitialized] = useState<string | null>(null)

  // Sincroniza o formulário quando o modal abre para um novo membro.
  if (member && open && initialized !== member.id) {
    setForm({
      displayName: member.displayName ?? "",
      city: member.city,
      state: member.state ?? "",
      company: member.company ?? "",
      position: member.position ?? "",
      bio: member.bio ?? "",
    })
    setInitialized(member.id)
  }

  if (!member) return null

  const handleSave = () => {
    editMember(member.id, {
      displayName: form.displayName.trim() || null,
      city: form.city.trim(),
      state: form.state || null,
      company: form.company.trim() || null,
      position: form.position.trim() || null,
      bio: form.bio.trim() || null,
    })
    setInitialized(null)
    onClose()
  }

  const handleClose = () => {
    setInitialized(null)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Editar dados básicos"
      description={member.fullName}
      className="sm:max-w-lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="edit-name">Nome de exibição</Label>
          <Input
            id="edit-name"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-city">Cidade</Label>
          <Input
            id="edit-city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-state">Estado</Label>
          <Select
            id="edit-state"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          >
            <option value="">—</option>
            {BRAZIL_STATES.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-company">Empresa</Label>
          <Input
            id="edit-company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-position">Cargo</Label>
          <Input
            id="edit-position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="edit-bio">Bio</Label>
          <Textarea
            id="edit-bio"
            maxLength={300}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <span className="self-end text-[11px] text-neutral-400">{form.bio.length}/300</span>
        </div>
      </div>
    </Modal>
  )
}
