"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Textarea, Label } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason?: string) => void
  title: string
  description?: string
  confirmLabel?: string
  tone?: "default" | "destructive"
  /** Quando true, exibe campo de motivo (opcional) enviado ao confirmar. */
  withReason?: boolean
  reasonLabel?: string
}

/**
 * Diálogo de confirmação para ações relevantes/destrutivas — RN: nenhuma ação
 * crítica sem confirmação explícita.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  tone = "default",
  withReason = false,
  reasonLabel = "Motivo (opcional)",
}: ConfirmDialogProps) {
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined)
    setReason("")
    onClose()
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant={tone === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {tone === "destructive" && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-5" />
          </span>
        )}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
            {description && <p className="text-sm text-neutral-500">{description}</p>}
          </div>
          {withReason && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-reason">{reasonLabel}</Label>
              <Textarea
                id="confirm-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Registrado no log de auditoria e enviado ao membro."
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
