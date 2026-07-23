"use client"

import { useState } from "react"
import { Check, Ban, X, Eye, Pencil, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "./ConfirmDialog"
import { useAdmin } from "@/lib/admin/store"
import type { AdminMember } from "@/lib/admin/types"

type DialogKind = "approve" | "reject" | "block" | "unblock" | null

interface MemberActionsProps {
  member: AdminMember
  onViewDetails?: (member: AdminMember) => void
  onEdit?: (member: AdminMember) => void
  layout?: "row" | "compact"
}

export function MemberActions({
  member,
  onViewDetails,
  onEdit,
  layout = "row",
}: MemberActionsProps) {
  const { currentUser, approveMember, rejectMember, blockMember, unblockMember } = useAdmin()
  const [dialog, setDialog] = useState<DialogKind>(null)

  const isAdmin = currentUser.role === "admin"
  // Embaixadores acompanham indicações mas não moderam (só admin altera status).
  const canModerate = isAdmin
  const name = member.displayName || member.fullName

  return (
    <>
      <div className={layout === "row" ? "flex items-center gap-1.5" : "flex flex-wrap gap-2"}>
        {onViewDetails && (
          <Button
            variant="outline"
            size={layout === "compact" ? "sm" : "icon-sm"}
            onClick={() => onViewDetails(member)}
            aria-label="Ver detalhes"
            title="Ver detalhes"
          >
            <Eye />
            {layout === "compact" && "Detalhes"}
          </Button>
        )}

        {(member.status === "pending" || member.status === "rejected") && canModerate && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setDialog("approve")}
            className="bg-[var(--kv-teal)] text-white hover:bg-[var(--kv-teal-dark)]"
          >
            <Check /> Aprovar
          </Button>
        )}

        {member.status === "pending" && canModerate && (
          <Button variant="outline" size="sm" onClick={() => setDialog("reject")}>
            <X /> Rejeitar
          </Button>
        )}

        {member.status === "approved" && isAdmin && (
          <Button variant="destructive" size="sm" onClick={() => setDialog("block")}>
            <Ban /> Bloquear
          </Button>
        )}

        {member.status === "blocked" && isAdmin && (
          <Button variant="outline" size="sm" onClick={() => setDialog("unblock")}>
            <RotateCcw /> Desbloquear
          </Button>
        )}

        {onEdit && isAdmin && (
          <Button
            variant="ghost"
            size={layout === "compact" ? "sm" : "icon-sm"}
            onClick={() => onEdit(member)}
            aria-label="Editar"
            title="Editar dados básicos"
          >
            <Pencil />
            {layout === "compact" && "Editar"}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={dialog === "approve"}
        onClose={() => setDialog(null)}
        onConfirm={() => approveMember(member.id)}
        title={`Aprovar ${name}?`}
        description="O membro passará a ter acesso à plataforma e aparecerá no diretório conforme sua privacidade."
        confirmLabel="Aprovar"
      />

      <ConfirmDialog
        open={dialog === "reject"}
        onClose={() => setDialog(null)}
        onConfirm={(reason) => rejectMember(member.id, reason)}
        title={`Rejeitar ${name}?`}
        description="O solicitante será notificado. Poderá enviar nova solicitação após 30 dias."
        confirmLabel="Rejeitar"
        withReason
      />

      <ConfirmDialog
        open={dialog === "block"}
        onClose={() => setDialog(null)}
        onConfirm={(reason) => blockMember(member.id, reason)}
        title={`Bloquear ${name}?`}
        description="O acesso será revogado imediatamente e o membro sairá do diretório."
        confirmLabel="Bloquear"
        tone="destructive"
        withReason
      />

      <ConfirmDialog
        open={dialog === "unblock"}
        onClose={() => setDialog(null)}
        onConfirm={() => unblockMember(member.id)}
        title={`Desbloquear ${name}?`}
        description="O membro voltará ao status aprovado e recuperará o acesso."
        confirmLabel="Desbloquear"
      />
    </>
  )
}
