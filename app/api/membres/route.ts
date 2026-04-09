import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data: membres, error } = await supabaseAdmin
    .from('membres')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch last flux for each membre to get TWR
  const result = await Promise.all(
    membres.map(async (m) => {
      const { data: flux } = await supabaseAdmin
        .from('flux_capital')
        .select('twr, profit, roi, valeur_ptf, moment')
        .eq('membre_id', m.id)
        .not('valeur_ptf', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      const last = flux?.[0] ?? null
      return {
        ...m,
        last_twr: last?.twr ?? null,
        last_profit: last?.profit ?? null,
        last_roi: last?.roi ?? null,
      }
    })
  )

  return NextResponse.json(result)
}
