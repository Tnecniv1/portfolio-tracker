import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
import SaisieClient from './SaisieClient'

async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-auth')?.value
  if (!token) return false

  try {
    const { data } = await supabaseAdmin.auth.getUser(token)
    return !!data.user
  } catch {
    return false
  }
}

async function getMembres() {
  const { data } = await supabaseAdmin
    .from('membres')
    .select('id, prenom, nom')
    .order('prenom', { ascending: true })
  return data ?? []
}

export default async function SaisiePage() {
  const [authed, membres] = await Promise.all([isAuthenticated(), getMembres()])

  if (!authed) {
    // Show login form — client component handles this
    return <SaisieClient membres={[]} authenticated={false} />
  }

  return <SaisieClient membres={membres} authenticated={true} />
}
