"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
  ArrowRight,
  Rocket,
  Radar,
  CalendarDays,
  PieChart,
} from "lucide-react"
import { StatCard } from "@/components/admin/StatCard"
import { BarList } from "@/components/admin/BarList"
import { GrowthChart } from "@/components/admin/dashboard/GrowthChart"
import { GrowthPeriodToggle } from "@/components/admin/dashboard/GrowthPeriodToggle"
import { StatusRadial } from "@/components/admin/dashboard/StatusRadial"
import { WeekdayChart } from "@/components/admin/dashboard/WeekdayChart"
import { CompletenessHistogram } from "@/components/admin/dashboard/CompletenessHistogram"
import { PendingApprovalsList } from "@/components/admin/dashboard/PendingApprovalsList"
import { IncompleteProfilesList } from "@/components/admin/dashboard/IncompleteProfilesList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdmin } from "@/lib/admin/store"
import { computeMetrics, computeGrowthSeries, profileCompleteness, isIncomplete, CURRENT_MONTH_LABEL } from "@/lib/admin/metrics"
import type { MemberStatus } from "@/lib/admin/types"

const DEFAULT_GROWTH_MONTHS = 6

export default function AdminDashboardPage() {
  const router = useRouter()
  const { members, interests } = useAdmin()
  const metrics = useMemo(() => computeMetrics(members, interests), [members, interests])

  const [growthMonths, setGrowthMonths] = useState(DEFAULT_GROWTH_MONTHS)
  const growthSeries = useMemo(
    () => (growthMonths === DEFAULT_GROWTH_MONTHS ? metrics.growthSeries : computeGrowthSeries(members, growthMonths)),
    [members, growthMonths, metrics.growthSeries]
  )

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

  function goToMembers(params: Record<string, string>) {
    const search = new URLSearchParams(params).toString()
    router.push(`/admin/membros?${search}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="flex items-center gap-1.5 text-sm text-neutral-500">
          <span className="kv-pulse-dot" />
          Visão geral do ecossistema · atualizado agora
        </p>

        {metrics.pending > 0 && (
          <Link
            href="/admin/aprovacoes"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
            </span>
            {metrics.pending} aguardando aprovação
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Total de membros"
          value={metrics.total}
          icon={Users}
          tone="neutral"
          trend={metrics.growthSeries.map((p) => p.total)}
        />
        <StatCard label="Pendentes" value={metrics.pending} icon={Clock} tone="amber" live={metrics.pending > 0} />
        <StatCard label="Aprovados" value={metrics.approved} icon={UserCheck} tone="teal" />
        <StatCard label="Bloqueados" value={metrics.blocked} icon={Ban} tone="red" />
        <StatCard
          label={`Novos em ${CURRENT_MONTH_LABEL}`}
          value={metrics.newThisMonth}
          icon={TrendingUp}
          tone="gold"
        />
        <StatCard label="Empresas cadastradas" value={metrics.companiesCount} icon={Rocket} tone="teal" />
      </div>

      {/* Crescimento + status do ecossistema */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-[var(--kv-teal)]" />
              Crescimento da comunidade
            </CardTitle>
            <GrowthPeriodToggle value={growthMonths} onChange={setGrowthMonths} />
          </CardHeader>
          <CardContent>
            <GrowthChart data={growthSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="size-4 text-[var(--kv-coral)]" />
              Status do ecossistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusRadial
              approved={metrics.approved}
              pending={metrics.pending}
              blocked={metrics.blocked}
              rejected={metrics.rejected}
              onSelect={(status: MemberStatus) => goToMembers({ status })}
            />
          </CardContent>
        </Card>
      </div>

      {/* Padrões de cadastro e completude */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="kv-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[var(--kv-teal)]" />
              Cadastros por dia da semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeekdayChart data={metrics.weekdaySignups} />
          </CardContent>
        </Card>

        <Card className="kv-fade-in-up" style={{ animationDelay: "80ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="size-4 text-[var(--kv-coral)]" />
              Completude de perfil (aprovados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompletenessHistogram data={metrics.completenessHistogram} />
          </CardContent>
        </Card>
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
            <BarList
              items={metrics.topCities}
              color="var(--kv-teal)"
              onItemClick={(city) => goToMembers({ city })}
            />
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
            <BarList items={metrics.topInterests} color="var(--kv-gold-dark)" />
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
              Setores de empresa mais comuns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.topSectors} color="var(--kv-teal)" />
          </CardContent>
        </Card>
      </div>

      {/* Pendências + incompletos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PendingApprovalsList members={pendingRecent} />
        <IncompleteProfilesList entries={incompleteMembers} total={metrics.incomplete} />
      </div>
    </div>
  )
}
