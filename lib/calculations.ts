export interface FluxRow {
  id?: string
  membre_id: string
  moment: string
  capital_investit: number
  valeur_ptf: number | null
  profit?: number | null
  roi?: number | null
  twr?: number | null
}

export function computeFlux(rows: FluxRow[]): FluxRow[] {
  // Sort by created_at or insertion order (rows come ordered)
  const result: FluxRow[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = { ...rows[i] }

    if (row.valeur_ptf == null) {
      row.profit = null
      row.roi = null
      row.twr = null
      result.push(row)
      continue
    }

    if (i === 0) {
      // First row with a value
      row.profit = row.valeur_ptf - row.capital_investit
      row.roi = row.profit / row.capital_investit
      row.twr = row.valeur_ptf / row.capital_investit - 1
    } else {
      const prev = result[i - 1]
      const prevCapital = prev.capital_investit
      const prevValeur = prev.valeur_ptf

      row.profit = row.valeur_ptf - row.capital_investit

      if (row.capital_investit !== 0) {
        row.roi = row.profit / row.capital_investit
      } else {
        row.roi = null
      }

      // TWR calculation
      if (prevValeur == null) {
        // Previous row had no value, treat as fresh start
        row.twr = row.valeur_ptf / row.capital_investit - 1
      } else {
        const prevTwr = prev.twr ?? 0
        const cashflow = row.capital_investit - prevCapital
        const denominator = prevValeur + cashflow
        if (denominator !== 0) {
          row.twr = (1 + prevTwr) * (row.valeur_ptf / denominator) - 1
        } else {
          row.twr = null
        }
      }
    }

    result.push(row)
  }

  return result
}
