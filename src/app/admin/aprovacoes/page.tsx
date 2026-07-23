"use client"

import { useMemo } from "react"
import Image from "next/image"
import { MapPin, Link2, CheckCircle2, Calendar, Rocket } from "lucide-react"
import { Avatar } from "@/components/admin/Avatar"
import { MemberActions } from "@/components/admin/MemberActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdmin } from "@/lib/admin/store"
import { formatDate, occupationLabel, sectorLabel } from "@/lib/admin/labels"
import { STARTUP_STAGE_LABELS, COMPANY_TYPE_LABELS } from "@/lib/onboarding/options"

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
        {title}
      </p>
      {items.length === 0 ? (
        <span className="text-sm text-neutral-400">—</span>
      ) : (
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
      )}
    </div>
  )
}

export default function ApprovalsPage() {
  const { members, approveCompany, rejectCompany } = useAdmin()
  const pending = useMemo(
    () =>
      members
        .filter((m) => m.status === "pending")
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [members]
  )
  const pendingCompanies = useMemo(
    () =>
      members
        .filter((m) => m.companyReviewStatus === "pending")
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [members]
  )

  if (pending.length === 0 && pendingCompanies.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[var(--kv-teal)]/12 text-[var(--kv-teal-dark)]">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="text-lg font-semibold text-neutral-900">Tudo em dia!</h2>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">
          Não há solicitações de cadastro ou de empresa aguardando revisão no momento.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {pendingCompanies.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800">
              {pendingCompanies.length} {pendingCompanies.length === 1 ? "empresa aguardando" : "empresas aguardando"} revisão
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {pendingCompanies.map((m) => (
              <Card key={m.id}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    {m.companyLogoUrl ? (
                      <Image
                        src={m.companyLogoUrl}
                        alt={m.companyName ?? ""}
                        width={44}
                        height={44}
                        className="size-11 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
                        <Rocket className="size-5 text-neutral-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="flex flex-wrap items-center gap-1.5 text-base font-semibold text-neutral-900">
                        {m.companyName}
                        {m.companyType && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-normal text-neutral-600">
                            {COMPANY_TYPE_LABELS[m.companyType]}
                          </span>
                        )}
                        {m.companyStage && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-normal text-neutral-600">
                            {STARTUP_STAGE_LABELS[m.companyStage] ?? m.companyStage}
                          </span>
                        )}
                        {m.companySector && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-normal text-neutral-600">
                            {sectorLabel(m.companySector)}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Cadastrada por {m.displayName || m.fullName}
                      </p>
                    </div>
                  </div>
                  {m.companyProblem && <p className="text-sm text-neutral-600">{m.companyProblem}</p>}
                  {m.companyCnpj && <p className="text-xs text-neutral-400">CNPJ: {m.companyCnpj}</p>}
                  <div className="flex gap-2 border-t border-neutral-100 pt-3">
                    <Button size="sm" onClick={() => approveCompany(m.id)}>
                      Aprovar empresa
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => rejectCompany(m.id)}>
                      Rejeitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 ? null : (
      <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800">
          {pending.length} aguardando revisão
        </span>
        <p className="text-sm text-neutral-500">Ordenadas da mais antiga para a mais recente.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {pending.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Avatar name={m.displayName || m.fullName} photoUrl={m.photoUrl} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {m.displayName || m.fullName}
                  </h3>
                  <p className="text-sm text-neutral-500">{m.fullName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {m.city}
                      {m.state ? ` / ${m.state}` : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {formatDate(m.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {m.bio && <p className="text-sm text-neutral-600">{m.bio}</p>}

              <div className="flex flex-col gap-3">
                <Section title="Perfil" items={m.occupationAreas.map(occupationLabel)} />
                <Section title="Interesses" items={m.interests} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Section title="O que busca" items={m.needs} />
                  <Section title="O que oferece" items={m.offers} />
                </div>
                {m.socialLinks.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
                      Links sociais
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {m.socialLinks.map((link) => (
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

              <div className="border-t border-neutral-100 pt-3">
                <MemberActions member={m} layout="compact" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
      )}
    </div>
  )
}
