import { supabaseAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import { formatEuro, formatPct, colorClass } from '@/lib/format'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const MEDALS = ['🥇', '🥈', '🥉']

function monthsSince(since: string | null): string {
  if (!since) return '—'
  const start = new Date(since)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return `${months} mois`
}

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

      const { data: lastFlux } = await supabaseAdmin
        .from('flux_capital')
        .select('capital_investit')
        .eq('membre_id', m.id)
        .order('capital_investit', { ascending: false })
        .limit(1)

      const last = flux?.[0] ?? null
      return {
        ...m,
        last_twr: last?.twr ?? null,
        last_profit: last?.profit ?? null,
        last_roi: last?.roi ?? null,
        depuis_moment: first?.[0]?.moment ?? null,
        last_capital: lastFlux?.[0]?.capital_investit ?? 0,
      }
    })
  )

  return result.sort((a, b) => (b.last_twr ?? -Infinity) - (a.last_twr ?? -Infinity))
}

export default async function ClassementPage() {
  const membres = await getMembres()

  const totalInvesti = membres.reduce((s, m) => s + (m.last_capital ?? 0), 0)
  const totalProfit  = membres.reduce((s, m) => s + (m.last_profit ?? 0), 0)

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

        {/* Summary cards */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 rounded-xl border border-gray-100 bg-white px-8 py-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total investi</p>
            <p className="text-4xl font-semibold text-gray-900">{formatEuro(totalInvesti)}</p>
          </div>

          <span className="text-xl text-gray-300 font-light select-none">+</span>

          <div className="flex-1 rounded-xl border border-gray-100 bg-white px-8 py-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Profit total</p>
            <p
              className="text-4xl font-semibold"
              style={{ color: totalProfit >= 0 ? '#1A7F5A' : '#DC2626' }}
            >
              {formatEuro(totalProfit)}
            </p>
          </div>
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
                  <tr className="border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
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
                    <td className="px-4 py-3.5 text-right text-gray-400">{monthsSince(m.depuis)}</td>
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
