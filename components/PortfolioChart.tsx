'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface FluxRow {
  moment: string
  capital_investit: number
  valeur_ptf: number | null
}

interface Props {
  data: FluxRow[]
}

function formatEuroShort(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k€`
  return `${value}€`
}

export default function PortfolioChart({ data }: Props) {
  const chartData = data.map((r) => ({
    moment: r.moment,
    capital: r.capital_investit,
    valeur: r.valeur_ptf,
  }))

  const maxVal = Math.max(
    ...data.map((r) => Math.max(r.capital_investit, r.valeur_ptf ?? 0))
  )

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
        <XAxis
          dataKey="moment"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatEuroShort}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          domain={[0, Math.ceil(maxVal * 1.05 / 100) * 100]}
        />
        <Tooltip
          formatter={(value, name) => {
            const label = name === 'capital' ? 'Capital investi' : 'Valeur ptf'
            const num = typeof value === 'number' ? value : Number(value)
            return [
              new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num),
              label,
            ]
          }}
          contentStyle={{ border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
        />
        <Legend
          formatter={(value) => (value === 'capital' ? 'Capital investi' : 'Valeur ptf')}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        {/* Break-even reference: capital line as reference */}
        <Bar dataKey="capital" fill="#A8C8E8" radius={[3, 3, 0, 0]} maxBarSize={40} />
        <Line
          dataKey="valeur"
          stroke="#7B4FBF"
          strokeWidth={2.5}
          dot={false}
          type="monotone"
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
