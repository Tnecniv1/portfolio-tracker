import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
import { computeFlux } from '@/lib/calculations'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { membre_id, moment, montant_investit, valeur_ptf } = body

  if (!membre_id || !moment || montant_investit == null) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  // Fetch existing flux for this member (ordered by montant_global_investit)
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('flux_capital')
    .select('*')
    .eq('membre_id', membre_id)
    .order('montant_global_investit', { ascending: true })

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  // Compute new montant_global_investit
  const lastRow = existing && existing.length > 0 ? existing[existing.length - 1] : null
  const montantInvesti = Number(montant_investit)
  const montantGlobalInvesti = (lastRow?.montant_global_investit ?? 0) + montantInvesti
  const capitalInvesti = montantGlobalInvesti

  // Append new row (without computed fields yet)
  const newRow = {
    membre_id,
    moment,
    montant_investit: montantInvesti,
    montant_global_investit: montantGlobalInvesti,
    capital_investit: capitalInvesti,
    valeur_ptf: valeur_ptf != null ? Number(valeur_ptf) : null,
    profit: null,
    roi: null,
    twr: null,
  }

  const allRows = [...(existing ?? []), newRow]
  const computed = computeFlux(allRows)
  const lastComputed = computed[computed.length - 1]

  // Insert new row with computed values
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('flux_capital')
    .insert({
      membre_id: lastComputed.membre_id,
      moment: lastComputed.moment,
      montant_investit: montantInvesti,
      montant_global_investit: montantGlobalInvesti,
      capital_investit: lastComputed.capital_investit,
      valeur_ptf: lastComputed.valeur_ptf,
      profit: lastComputed.profit,
      roi: lastComputed.roi,
      twr: lastComputed.twr,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  // Recompute all rows to keep values consistent
  const { data: allFlux } = await supabaseAdmin
    .from('flux_capital')
    .select('*')
    .eq('membre_id', membre_id)
    .order('montant_global_investit', { ascending: true })

  const recomputed = computeFlux(allFlux ?? [])

  // Update all rows with fresh computed values
  for (const row of recomputed) {
    if (!row.id) continue
    await supabaseAdmin
      .from('flux_capital')
      .update({
        profit: row.profit,
        roi: row.roi,
        twr: row.twr,
      })
      .eq('id', row.id)
  }

  // Update membre: richesse + depuis
  const lastWithValue = recomputed.filter((r) => r.valeur_ptf != null).at(-1)
  const first = recomputed[0]

  if (lastWithValue || first) {
    await supabaseAdmin
      .from('membres')
      .update({
        richesse: lastWithValue?.valeur_ptf ?? null,
        depuis: first ? new Date().toISOString().split('T')[0] : null,
      })
      .eq('id', membre_id)
  }

  return NextResponse.json(inserted, { status: 201 })
}
