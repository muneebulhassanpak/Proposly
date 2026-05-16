"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatMoney } from "@/lib/utils/format.utils"
import { useAnalytics } from "../hooks/use-analytics.hook"
import type { DateRangePreset } from "../analytics.types"

interface AnalyticsPageProps {
  companyId: string
}

const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  year: "This year",
}

export function AnalyticsPage({ companyId }: AnalyticsPageProps) {
  const { data, isLoading, dateRange, setDateRange } = useAnalytics(companyId)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Analytics</h1>
          <p className="mt-1 text-sm text-ink-mute">
            Performance metrics and trends.
          </p>
        </div>
        <Select
          value={dateRange}
          onValueChange={(v) => setDateRange(v as DateRangePreset)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Win Rate"
          value={data ? `${data.metrics.winRate}%` : undefined}
          isLoading={isLoading}
        />
        <MetricCard
          label="Avg Quote Value"
          value={
            data
              ? formatMoney(data.metrics.avgQuoteValue, data.metrics.currency)
              : undefined
          }
          isLoading={isLoading}
        />
        <MetricCard
          label="Avg Time to Close"
          value={data ? `${data.metrics.avgTimeToClose}d` : undefined}
          isLoading={isLoading}
        />
        <MetricCard
          label="Revenue Won"
          value={
            data
              ? formatMoney(data.metrics.totalRevenueWon, data.metrics.currency)
              : undefined
          }
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quote Volume */}
        <ChartCard title="Quote Volume by Month" isLoading={isLoading}>
          {data && data.quoteVolume.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.quoteVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
                <XAxis dataKey="month" fontSize={12} stroke="var(--ink-mute)" />
                <YAxis
                  fontSize={12}
                  stroke="var(--ink-mute)"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid var(--hairline)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Revenue Won vs Pipeline */}
        <ChartCard title="Revenue Won vs Pipeline" isLoading={isLoading}>
          {data && data.revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
                <XAxis dataKey="month" fontSize={12} stroke="var(--ink-mute)" />
                <YAxis fontSize={12} stroke="var(--ink-mute)" />
                <Tooltip
                  contentStyle={{
                    border: "1px solid var(--hairline)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="won"
                  name="Won"
                  fill="var(--moss)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pipeline"
                  name="Pipeline"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Top 5 Products */}
        <ChartCard title="Top 5 Most Quoted Products" isLoading={isLoading}>
          {data && data.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
                <XAxis
                  type="number"
                  fontSize={12}
                  stroke="var(--ink-mute)"
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  fontSize={12}
                  stroke="var(--ink-mute)"
                  width={120}
                  tick={{ fill: "var(--ink-soft)" }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid var(--hairline)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--amber)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>

        {/* Win Rate per Rep */}
        <ChartCard title="Win Rate per Rep" isLoading={isLoading}>
          {data && data.repWinRates.length > 0 ? (
            <div className="space-y-3 py-2">
              {data.repWinRates.map((rep) => (
                <div key={rep.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{rep.name}</span>
                    <span className="font-mono text-ink-mute tabular-nums">
                      {rep.winRate}%
                      <span className="ml-2 text-xs">
                        ({rep.accepted}/{rep.sent})
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-hairline">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${Math.min(rep.winRate, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string | undefined
  isLoading: boolean
}) {
  return (
    <div className="rounded-[10px] border border-hairline bg-surface p-5">
      <p className="text-xs font-medium tracking-wide text-ink-mute uppercase">
        {label}
      </p>
      <div className="mt-2 font-mono text-2xl font-semibold text-ink tabular-nums">
        {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : (value ?? "—")}
      </div>
    </div>
  )
}

function ChartCard({
  title,
  isLoading,
  children,
}: {
  title: string
  isLoading: boolean
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[10px] border border-hairline bg-surface p-5">
      <h3 className="mb-4 text-sm font-medium text-ink">{title}</h3>
      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[6px]" />
      ) : (
        children
      )}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-ink-mute">
      No data for this period.
    </div>
  )
}
