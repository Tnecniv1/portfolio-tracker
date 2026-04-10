import Link from 'next/link'

const CTA = () => (
  <a
    href="#rejoindre"
    className="inline-block bg-[#0D1B2A] text-white rounded-xl px-8 py-4 text-base font-medium hover:bg-[#1a2f45] transition-colors"
  >
    Rejoindre l&apos;équipe
  </a>
)

export default function VentePage() {
  return (
    <main className="min-h-screen bg-white font-lora">

      {/* ── Section 1 — Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4"
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("/hero.jpg")',
          backgroundSize: 'contain',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0d1a1f',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1
            className="font-bold font-lora text-white leading-tight"
            style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', maxWidth: 700 }}
          >
            Accompagnement pour gagner 1&nbsp;million d&apos;euros en 20&nbsp;ans.
          </h1>
          <p className="text-gray-300" style={{ fontSize: 16 }}>
            Premier mois gratuit · Ticket d&apos;entrée 1 500 €
          </p>
        </div>
      </section>

      {/* ── Section 2 — Vidéo + accroche ── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16 items-stretch">
          {/* Vidéo placeholder */}
          <div className="h-full min-h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
            {/* TODO: remplacer par <iframe> YouTube */}
            <span className="text-[#6B7C8F] text-sm">Vidéo de présentation</span>
          </div>

          {/* Texte */}
          <div>
            <p className="mb-5 text-lg leading-relaxed text-[#0D1B2A]">Gagner de l&apos;argent est facile.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#0D1B2A]">Cela demande d&apos;apprendre à faire une chose dont le monde a profondément et sincèrement besoin, pendant une vingtaine d&apos;année.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#0D1B2A]">Et finalement, que ce soit avec du temps ou de l&apos;argent, il s&apos;agit d&apos;investir dans l&apos;opportunité la plus rentable. Faire le bon pari.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#0D1B2A]">Il n&apos;y a donc qu&apos;une seule règle dans ce monde, une petite question qui mène à tous les succès. Plus un homme s&apos;investit dans cette question, plus il devient puissant. Vous devinez laquelle ?</p>
            <p className="mb-5 text-xl font-semibold text-[#0D1B2A]">Qu&apos;est-ce que j&apos;ai à y gagner ?</p>

            <div className="mt-10">
              <CTA />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3 — L'accompagnement ── */}
      <section className="bg-[#F0F2F4] px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold text-[#0D1B2A] mb-12" style={{ fontSize: 32 }}>
            Qu&apos;est-ce que je vais gagner ?
          </h2>
          <div className="grid grid-cols-3 gap-6 mt-10">
            <div className="bg-[#FAFBFC] rounded-2xl p-10 border border-[#DDE3EA] min-h-[220px]">
              <h3 className="font-bold text-[#0D1B2A] mb-3" style={{ fontSize: 20 }}>Financer ses Besoins</h3>
              <p className="text-[#2C3E50] text-base leading-relaxed mb-3">Apprendre à gérer son argent, pour vivre au dessus de ses moyens.</p>
              <p className="text-[#6B7C8F] text-sm leading-relaxed">L&apos;objectif est de maximiser ses revenus et de minimiser ses dépenses, en respectant les contraintes évidentes.</p>
            </div>
            <div className="bg-[#FAFBFC] rounded-2xl p-10 border border-[#DDE3EA] min-h-[220px]">
              <h3 className="font-bold text-[#0D1B2A] mb-3" style={{ fontSize: 20 }}>Investir son Argent</h3>
              <p className="text-[#2C3E50] text-base leading-relaxed mb-3">Apprendre à parier sur les meilleures opportunités, pour réaliser ses rêves.</p>
              <p className="text-[#6B7C8F] text-sm leading-relaxed">L&apos;objectif est de pouvoir financer un projet de vie qui compte pour soi, en équilibrant au mieux son risque.</p>
            </div>
            <div className="bg-[#FAFBFC] rounded-2xl p-10 border border-[#DDE3EA] min-h-[220px]">
              <h3 className="font-bold text-[#0D1B2A] mb-3" style={{ fontSize: 20 }}>Valoriser son Temps</h3>
              <p className="text-[#2C3E50] text-base leading-relaxed mb-3">Apprendre à se concentrer durablement, pour devenir toujours plus intelligent.</p>
              <p className="text-[#6B7C8F] text-sm leading-relaxed">L&apos;objectif est de se libérer progressivement des contraintes, en augmentant la quantité d&apos;argent gagné par unité de temps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4 — Texte équipe ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-semibold text-[#0D1B2A] mb-6 font-lora">On est une équipe.</p>
          <p className="text-lg text-[#2C3E50] leading-relaxed mb-8">
            Chaque personne qui rejoint l&apos;aventure est choisie — ce n&apos;est pas qu&apos;une question d&apos;argent.
          </p>
          <p className="text-lg text-[#2C3E50] leading-relaxed">
            Vous n&apos;achetez pas une formation bidon, mais une maison dans un village. En ce sens que vous aurez accès à toutes les ressources de la communauté, mais qu&apos;en contrepartie vous devrez trouver votre place dans cette dernière — par le travail et l&apos;amitié.
          </p>
        </div>
      </section>

      {/* ── Section 5 — Équipe ── */}
      <section className="bg-white px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-[#0D1B2A] text-center mb-4" style={{ fontSize: 32 }}>
            Les membres actuels de l&apos;équipe
          </h2>
          <p className="text-[#6B7C8F] text-base text-center mb-10">Pour savoir si ça marche, contactez-les !</p>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            {['Membre A', 'Membre B', 'Membre C'].map((prenom) => (
              <div
                key={prenom}
                className="border border-[#DDE3EA] rounded-xl p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-[#0D1B2A]">{prenom}</p>
                    <p className="text-sm text-[#6B7C8F]">Membre depuis [À compléter]</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section id="rejoindre" className="bg-[#F0F2F4] px-4 py-20 flex flex-col items-center text-center">
        <h2 className="font-bold text-[#0D1B2A] mb-6" style={{ fontSize: 32 }}>
          Prêt à rejoindre l&apos;équipe ?
        </h2>
        <CTA />
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 py-10 flex justify-center">
        <Link
          href="/"
          className="text-[#6B7C8F] hover:text-gray-600 transition-colors"
          style={{ fontSize: 14 }}
        >
          ← Retour au classement
        </Link>
      </footer>
    </main>
  )
}
