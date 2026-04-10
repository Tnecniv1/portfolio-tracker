import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'Fidess — Suivi de portefeuille',
  description: 'Suivi de portefeuilles boursiers entre membres',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={lora.variable}>{children}</body>
    </html>
  )
}
