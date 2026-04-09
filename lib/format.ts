export function formatEuro(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPct(value: number | null | undefined): string {
  if (value == null) return '—'
  const pct = value * 100
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

export function colorClass(value: number | null | undefined): string {
  if (value == null) return 'text-gray-400'
  return value >= 0 ? 'text-emerald-600' : 'text-red-500'
}
