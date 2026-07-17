"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Input, Label, Select } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin/store"
import type { AdminInterest } from "@/lib/admin/types"

const CATEGORIES = ["Setores", "Negócios", "Habilidades", "Outros"]

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function InterestFormModal({
  interest,
  open,
  onClose,
}: {
  interest: AdminInterest | null
  open: boolean
  onClose: () => void
}) {
  const { createInterest, updateInterest } = useAdmin()
  const isEdit = Boolean(interest)
  const [name, setName] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [active, setActive] = useState(true)
  const [initialized, setInitialized] = useState<string | null>(null)

  const key = interest?.id ?? "new"
  if (open && initialized !== key) {
    setName(interest?.name ?? "")
    setCategory(interest?.category ?? CATEGORIES[0])
    setActive(interest?.active ?? true)
    setInitialized(key)
  }

  const handleClose = () => {
    setInitialized(null)
    onClose()
  }

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const payload = { name: trimmed, slug: slugify(trimmed), category, active }
    if (interest) updateInterest(interest.id, payload)
    else createInterest(payload)
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Editar interesse" : "Novo interesse"}
      className="sm:max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEdit ? "Salvar" : "Criar interesse"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interest-name">Nome</Label>
          <Input
            id="interest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Inteligência Artificial"
            autoFocus
          />
          {name.trim() && (
            <span className="text-[11px] text-neutral-400">slug: {slugify(name)}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="interest-category">Categoria</Label>
          <Select
            id="interest-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-neutral-800">Ativo</p>
            <p className="text-xs text-neutral-500">
              Interesses inativos não aparecem no cadastro de novos membros.
            </p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} aria-label="Ativar interesse" />
        </div>
      </div>
    </Modal>
  )
}
