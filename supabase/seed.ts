/**
 * Seed script — insère le membre Vincent et tous ses flux via l'API.
 * Usage: npx tsx supabase/seed.ts
 * Nécessite que le serveur Next.js soit lancé (npm run dev).
 */

const BASE_URL = 'http://localhost:3000'

const FLUX = [
  { moment: 'jan. 25', capital_investit: 1000,  valeur_ptf: null },
  { moment: 'fév. 25', capital_investit: 1200,  valeur_ptf: 1007.23 },
  { moment: 'mar. 25', capital_investit: 1400,  valeur_ptf: 1136.13 },
  { moment: 'avr. 25', capital_investit: 1600,  valeur_ptf: 1256.28 },
  { moment: 'mai. 25', capital_investit: 1800,  valeur_ptf: 1519.23 },
  { moment: 'jun. 25', capital_investit: 2000,  valeur_ptf: 1812.73 },
  { moment: 'jul. 25', capital_investit: 2200,  valeur_ptf: 2032.47 },
  { moment: 'aoû. 25', capital_investit: 2400,  valeur_ptf: 2542.23 },
  { moment: 'sep. 25', capital_investit: 2600,  valeur_ptf: 2590.39 },
  { moment: 'oct. 25', capital_investit: 2800,  valeur_ptf: 2949.22 },
  { moment: 'nov. 25', capital_investit: 3100,  valeur_ptf: 3265.99 },
  { moment: 'déc. 25', capital_investit: 3300,  valeur_ptf: 3658.28 },
  { moment: 'jan. 26', capital_investit: 3600,  valeur_ptf: 3856.01 },
  { moment: 'fév. 26', capital_investit: 3900,  valeur_ptf: 4253.86 },
  { moment: 'mar. 26', capital_investit: 4200,  valeur_ptf: 4690.87 },
  { moment: 'avr. 26', capital_investit: 4400,  valeur_ptf: 4756.68 },
  { moment: 'avr. 26', capital_investit: 4400,  valeur_ptf: 5060.89 },
]

async function main() {
  // 1. Create membre
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: existing } = await supabase
    .from('membres')
    .select('id')
    .eq('prenom', 'Vincent')
    .limit(1)

  let membreId: string

  if (existing && existing.length > 0) {
    membreId = existing[0].id
    console.log('Membre Vincent déjà existant, id:', membreId)
  } else {
    const { data, error } = await supabase
      .from('membres')
      .insert({ nom: 'Dupont', prenom: 'Vincent' })
      .select()
      .single()
    if (error || !data) throw new Error('Erreur création membre: ' + error?.message)
    membreId = data.id
    console.log('Membre Vincent créé, id:', membreId)
  }

  // 2. Insert flux via API
  for (const flux of FLUX) {
    const res = await fetch(`${BASE_URL}/api/flux`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membre_id: membreId, ...flux }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Erreur flux', flux.moment, data)
    } else {
      console.log(`✓ ${flux.moment} — TWR: ${data.twr != null ? (data.twr * 100).toFixed(2) + '%' : '—'}`)
    }
  }

  console.log('\nSeed terminé. TWR attendu sur la dernière ligne: ~+22.8%')
}

main().catch(console.error)
