"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  Users,
  Clock,
  UserCheck,
  Ban,
  TrendingUp,
  MapPin,
  Tag,
  Briefcase,
  AlertCircle,
  ArrowRight,
  Rocket,
} from "lucide-react"
import { StatCard } from "@/components/admin/StatCard"
import { BarList } from "@/components/admin/BarList"
import { Avatar } from "@/components/admin/Avatar"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin/store"
import { computeMetrics, profileCompleteness, isIncomplete, CURRENT_MONTH_LABEL } from "@/lib/admin/metrics"
import { formatDate } from "@/lib/admin/labels"

export default function AdminDashboardPage() {
  const { members, interests } = useAdmin()
  const metrics = useMemo(() => computeMetrics(members, interests), [members, interests])

  const pendingRecent = useMemo(
    () =>
      members
        .filter((m) => m.status === "pending")
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    [members]
  )

  const incompleteMembers = useMemo(
    () =>
      members
        .filter((m) => m.status === "approved" && isIncomplete(m))
        .map((m) => ({ member: m, pct: profileCompleteness(m) }))
        .sort((a, b) => a.pct - b.pct)
        .slice(0, 5),
    [members]
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-neutral-500">Visão geral do ecossistema</p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total de membros" value={metrics.total} icon={Users} tone="neutral" />
        <StatCard label="Pendentes" value={metrics.pending} icon={Clock} tone="amber" />
        <StatCard label="Aprovados" value={metrics.approved} icon={UserCheck} tone="teal" />
        <StatCard label="Bloqueados" value={metrics.blocked} icon={Ban} tone="red" />
        <StatCard
          label={`Novos em ${CURRENT_MONTH_LABEL}`}
          value={metrics.newThisMonth}
          icon={TrendingUp}
          tone="gold"
        />
        <StatCard label="Startups cadastradas" value={metrics.startupsCount} icon={Rocket} tone="teal" />
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-[var(--kv-teal)]" />
              Cidades mais presentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.topCities} color="var(--kv-teal)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="size-4 text-[var(--kv-gold-dark)]" />
              Interesses mais comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.topInterests} color="var(--kv-gold)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="size-4 text-[var(--kv-coral)]" />
              Perfis mais comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.topProfiles} color="var(--kv-coral)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="size-4 text-[var(--kv-teal)]" />
              Setores de startup mais comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.topSectors} color="var(--kv-teal)" />
          </CardContent>
        </Card>
      </div>

      {/* Pendências + incompletos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600" />
              Aprovações pendentes
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/aprovacoes" />}
            >
              Ver todas <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            {pendingRecent.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-400">
                Nenhuma solicitação pendente.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-neutral-100">
                {pendingRecent.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-2.5">
                    <Avatar name={m.displayName || m.fullName} photoUrl={m.photoUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {m.displayName || m.fullName}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {m.city} · {formatDate(m.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={m.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-4 text-[var(--kv-coral)]" />
              Perfis incompletos
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                {metrics.incomplete}
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/membros" />}
            >
              Gerenciar <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            {incompleteMembers.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-400">
                Todos os perfis aprovados estão completos.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-neutral-100">
                {incompleteMembers.map(({ member, pct }) => (
                  <li key={member.id} className="flex items-center gap-3 py-2.5">
                    <Avatar
                      name={member.displayName || member.fullName}
                      photoUrl={member.photoUrl}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {member.displayName || member.fullName}
                      </p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-[var(--kv-coral)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-neutral-500">{pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
