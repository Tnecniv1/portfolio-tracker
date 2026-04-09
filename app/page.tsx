import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import { formatEuro, formatPct, colorClass } from '@/lib/format'

const MEDALS = ['🥇', '🥈', '🥉']

async function getMembres() {
  const { data: membres } = await supabaseAdmin
    .from('membres')
    .select('*')
    .order('created_at', { ascending: true })

  if (!membres) return []

  const result = await Promise.all(
    membres.map(async (m) => {
      const { data: flux } = await supabaseAdmin
        .from('flux_capital')
        .select('twr, profit, roi, valeur_ptf, moment')
        .eq('membre_id', m.id)
        .not('valeur_ptf', 'is', null)
        .order('capital_investit', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)

      const { data: first } = await supabaseAdmin
        .from('flux_capital')
        .select('moment')
        .eq('membre_id', m.id)
        .order('created_at', { ascending: true })
        .limit(1)

      const last = flux?.[0] ?? null
      return {
        ...m,
        last_twr: last?.twr ?? null,
        last_profit: last?.profit ?? null,
        last_roi: last?.roi ?? null,
        depuis_moment: first?.[0]?.moment ?? null,
      }
    })
  )

  return result.sort((a, b) => (b.last_twr ?? -Infinity) - (a.last_twr ?? -Infinity))
}

export default async function ClassementPage() {
  const membres = await getMembres()

  const totalProfit = membres.reduce((sum, m) => sum + (m.last_profit ?? 0), 0)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Classement</h1>
          <span className="text-sm text-gray-400 capitalize">{today}</span>
        </div>

        {/* Total profit card */}
        <div className="flex items-center justify-between mb-5 px-5 py-3 rounded-xl border border-gray-100 bg-[#F9FAFB]">
          <span className="text-sm text-gray-500">Profit total généré</span>
          <span className={`text-sm font-semibold ${colorClass(totalProfit)}`}>
            {formatEuro(totalProfit)}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">Rang</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prénom</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Richesse</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">ROI</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">TWR</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Depuis</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((m, i) => (
                <Link key={m.id} href={`/analyse/${m.id}`} legacyBehavior>
                  <tr
                    className="border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-base">{MEDALS[i] ?? i + 1}</td>
                    <td className="px-4 py-3.5 font-medium text-gray-900">{m.pseudo ?? m.prenom}</td>
                    <td className="px-4 py-3.5 text-right text-gray-700">{formatEuro(m.richesse)}</td>
                    <td className={`px-4 py-3.5 text-right font-medium ${colorClass(m.last_profit)}`}>
                      {formatEuro(m.last_profit)}
                    </td>
                    <td className={`px-4 py-3.5 text-right font-medium ${colorClass(m.last_roi)}`}>
                      {formatPct(m.last_roi)}
                    </td>
                    <td className={`px-4 py-3.5 text-right font-medium ${colorClass(m.last_twr)}`}>
                      {formatPct(m.last_twr)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-400">{m.depuis_moment ?? '—'}</td>
                  </tr>
                </Link>
              ))}
              {membres.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Aucun membre enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <Link href="/saisie" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Saisie →
          </Link>
        </div>
      </div>
    </main>
  )
}
