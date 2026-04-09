import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fidess — Suivi de portefeuille',
  description: 'Suivi de portefeuilles boursiers entre membres',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
