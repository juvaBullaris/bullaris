'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

interface NetWorthEntry {
  recorded_at: string | Date
  assets_dkk: number
  liabilities_dkk: number
}

interface NetWorthChartProps {
  data: NetWorthEntry[]
}

function fmt(n: number): string {
  return n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' kr.'
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  const chartData = data.map((entry) => ({
    date: format(new Date(entry.recorded_at), 'MMM yy', { locale: da }),
    Aktiver: entry.assets_dkk,
    Forpligtelser: entry.liabilities_dkk,
    Formue: entry.assets_dkk - entry.liabilities_dkk,
  }))

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-semibold mb-4">Formueudvikling</h2>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Ingen data endnu. Tilføj din første formueoversigt.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
              }
            />
            <Tooltip
              formatter={(value: number) => fmt(value)}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Aktiver"
              stroke="#1A56DB"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Forpligtelser"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Formue"
              stroke="#0E9F9F"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
