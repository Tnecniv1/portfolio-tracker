'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatEuro, formatPct, colorClass } from '@/lib/format'

interface Membre {
  id: string
  prenom: string
  nom: string
}

interface FluxRow {
  id: string
  moment: string
  capital_investit: number
  valeur_ptf: number | null
  profit: number | null
  roi: number | null
  twr: number | null
}

interface Props {
  membres: Membre[]
  authenticated: boolean
}

export default function SaisieClient({ membres, authenticated }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [selectedMembre, setSelectedMembre] = useState('')
  const [moment, setMoment] = useState('')
  const [capitalInvesti, setCapitalInvesti] = useState('')
  const [valeurPtf, setValeurPtf] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [recentFlux, setRecentFlux] = useState<FluxRow[]>([])

  useEffect(() => {
    if (membres.length > 0 && !selectedMembre) {
      setSelectedMembre(membres[0].id)
    }
  }, [membres, selectedMembre])

  useEffect(() => {
    if (selectedMembre) loadRecentFlux(selectedMembre)
  }, [selectedMembre])

  async function loadRecentFlux(membreId: string) {
    const res = await fetch(`/api/flux/${membreId}`)
    if (res.ok) {
      const data: FluxRow[] = await res.json()
      setRecentFlux(data.slice(-5).reverse())
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      window.location.reload()
    } else {
      const data = await res.json()
      setLoginError(data.error ?? 'Erreur de connexion')
    }
    setLoginLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setStatusMsg('')

    const res = await fetch('/api/flux', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        membre_id: selectedMembre,
        moment,
        capital_investit: Number(capitalInvesti),
        valeur_ptf: valeurPtf ? Number(valeurPtf) : null,
      }),
    })

    if (res.ok) {
      setStatus('success')
      setStatusMsg('Flux ajouté avec succès.')
      setMoment('')
      setCapitalInvesti('')
      setValeurPtf('')
      await loadRecentFlux(selectedMembre)
    } else {
      const data = await res.json()
      setStatus('error')
      setStatusMsg(data.error ?? 'Une erreur est survenue.')
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.reload()
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Connexion</h1>
            <p className="text-sm text-gray-400 mt-1">Accès réservé</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition"
                required
              />
            </div>
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loginLoading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Retour
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Saisie</h1>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Déconnexion
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Membre</label>
            <select
              value={selectedMembre}
              onChange={(e) => setSelectedMembre(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition bg-white"
            >
              {membres.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.prenom} {m.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Moment</label>
              <input
                type="text"
                placeholder="jan. 25"
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Capital investi (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1000"
                value={capitalInvesti}
                onChange={(e) => setCapitalInvesti(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Valeur ptf (€)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optionnel"
                value={valeurPtf}
                onChange={(e) => setValeurPtf(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gray-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Ajout…' : 'Ajouter'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-emerald-600">{statusMsg}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500">{statusMsg}</p>
          )}
        </form>

        {/* Recent flux */}
        {recentFlux.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">5 dernières saisies</p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Moment', 'Capital', 'Valeur ptf', 'Profit', 'ROI', 'TWR'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentFlux.map((row, i) => (
                    <tr key={row.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'}`}>
                      <td className="px-4 py-2.5 font-medium text-gray-700">{row.moment}</td>
                      <td className="px-4 py-2.5 text-gray-600">{formatEuro(row.capital_investit)}</td>
                      <td className="px-4 py-2.5 text-gray-600">{row.valeur_ptf != null ? formatEuro(row.valeur_ptf) : '—'}</td>
                      <td className={`px-4 py-2.5 font-medium ${colorClass(row.profit)}`}>{formatEuro(row.profit)}</td>
                      <td className={`px-4 py-2.5 font-medium ${colorClass(row.roi)}`}>{formatPct(row.roi)}</td>
                      <td className={`px-4 py-2.5 font-medium ${colorClass(row.twr)}`}>{formatPct(row.twr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
