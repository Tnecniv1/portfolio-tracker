import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { formatEuro, formatPct, colorClass } from '@/lib/format'
import PortfolioChart from '@/components/PortfolioChart'

async function getMembre(id: string) {
  const { data } = await supabaseAdmin.from('membres').select('*').eq('id', id).single()
  return data
}

async function getFlux(id: string) {
  const { data } = await supabaseAdmin
    .from('flux_capital')
    .select('*')
    .eq('membre_id', id)
    .order('created_at', { ascending: true })
  return data ?? []
}

export default async function AnalysePage({ params }: { params: { membre_id: string } }) {
  const [membre, flux] = await Promise.all([
    getMembre(params.membre_id),
    getFlux(params.membre_id),
  ])

  if (!membre) notFound()

  const lastFlux = flux.filter((f) => f.valeur_ptf != null).at(-1)
  const capitalInvesti = lastFlux?.capital_investit ?? 0
  const valeurPtf = lastFlux?.valeur_ptf ?? 0
  const profit = lastFlux?.profit ?? null
  const roi = lastFlux?.roi ?? null
  const twr = lastFlux?.twr ?? null

  const cards = [
    { label: 'Capital investi', value: formatEuro(capitalInvesti), color: 'text-gray-900' },
    { label: 'Valeur portefeuille', value: formatEuro(valeurPtf), color: 'text-gray-900' },
    { label: 'Profit', value: formatEuro(profit), color: colorClass(profit) },
    { label: 'ROI', value: formatPct(roi), color: colorClass(roi) },
    { label: 'TWR', value: formatPct(twr), color: colorClass(twr) },
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Retour
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {membre.prenom} {membre.nom}
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-100 px-4 py-4">
              <p className="text-xs text-gray-400 mb-1">{card.label}</p>
              <p className={`text-base font-semibold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-gray-100 p-6 mb-8">
          <PortfolioChart data={flux} />
        </div>

        {/* Flux table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Moment', 'Capital investi', 'Valeur ptf', 'Profit', 'ROI', 'TWR'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider last:text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flux.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}
                >
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">{row.moment}</td>
                  <td className="px-4 py-3 text-gray-700">{formatEuro(row.capital_investit)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {row.valeur_ptf != null ? formatEuro(row.valeur_ptf) : '—'}
                  </td>
                  <td className={`px-4 py-3 font-medium ${colorClass(row.profit)}`}>
                    {formatEuro(row.profit)}
                  </td>
                  <td className={`px-4 py-3 font-medium ${colorClass(row.roi)}`}>
                    {formatPct(row.roi)}
                  </td>
                  <td className={`px-4 py-3 font-medium text-right ${colorClass(row.twr)}`}>
                    {formatPct(row.twr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
