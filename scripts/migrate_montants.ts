import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrate() {
  const { data: membres, error: membresError } = await supabase
    .from('membres')
    .select('id, prenom, nom')

  if (membresError) throw membresError

  for (const membre of membres ?? []) {
    console.log(`\nMigration de ${membre.prenom} ${membre.nom}…`)

    const { data: flux, error: fluxError } = await supabase
      .from('flux_capital')
      .select('id, capital_investit')
      .eq('membre_id', membre.id)
      .order('capital_investit', { ascending: true })

    if (fluxError) throw fluxError
    if (!flux || flux.length === 0) continue

    for (let i = 0; i < flux.length; i++) {
      const row = flux[i]
      const prevCapital = i === 0 ? 0 : flux[i - 1].capital_investit
      const montant_investit = row.capital_investit - prevCapital
      const montant_global_investit = row.capital_investit

      const { error: updateError } = await supabase
        .from('flux_capital')
        .update({ montant_investit, montant_global_investit })
        .eq('id', row.id)

      if (updateError) throw updateError
      console.log(`  Ligne ${i + 1}: dépôt=${montant_investit}, total=${montant_global_investit}`)
    }
  }

  console.log('\nMigration terminée.')
}

migrate().catch(console.error)
