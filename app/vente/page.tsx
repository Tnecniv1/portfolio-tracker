import Link from 'next/link'

const CTA = () => (
  <a
    href="#rejoindre"
    className="inline-block bg-white text-[#1A1916] rounded-xl px-8 py-4 text-base font-medium hover:bg-gray-100 transition-colors"
  >
    Rejoindre l&apos;équipe
  </a>
)

export default function VentePage() {
  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* ── Section 1 — Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4"
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1
            className="font-bold font-lora italic text-white leading-tight"
            style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', maxWidth: 700 }}
          >
            Accompagnement pour gagner 1 million d&apos;euros en 20 ans.
          </h1>
        </div>
      </section>

      {/* ── Section 2 — Vidéo + accroche ── */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16 items-stretch">
          {/* Vidéo placeholder */}
          <div className="h-full min-h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
            {/* TODO: remplacer par <iframe> YouTube */}
            <span className="text-gray-400 text-sm">Vidéo de présentation</span>
          </div>

          {/* Texte */}
          <div>
            <p className="mb-5 text-lg leading-relaxed text-[#1A1916]">Gagner de l&apos;argent est facile.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#1A1916]">Cela demande d&apos;apprendre à faire une chose dont le monde a profondément et sincèrement besoin, pendant une vingtaine d&apos;année.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#1A1916]">Et finalement, que ce soit avec du temps ou de l&apos;argent, il s&apos;agit d&apos;investir dans l&apos;opportunité la plus rentable. Faire le bon pari.</p>
            <p className="mb-5 text-lg leading-relaxed text-[#1A1916]">Il n&apos;y a donc qu&apos;une seule règle dans ce monde, une petite question qui mène à tous les succès. Plus un homme s&apos;investit dans cette question, plus il devient puissant. Vous devinez laquelle ?</p>
            <p className="mb-5 text-xl font-semibold text-[#1A1916]">Qu&apos;est-ce que j&apos;ai à y gagner ?</p>

            <div className="mt-10">
              <CTA />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3 — L'accompagnement ── */}
      <section className="bg-[#F7F5F0] px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-[#1A1916] mb-12" style={{ fontSize: 32 }}>
            Qu&apos;est-ce que je vais gagner ?
          </h2>
          <div className="grid grid-cols-3 gap-8 mt-10">
            {[
              { titre: 'Financer ses Besoins' },
              { titre: 'Investir son Argent' },
              { titre: 'Valoriser son Temps' },
            ].map(({ titre }) => (
              <div key={titre} className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="font-bold text-[#1A1916] mb-3" style={{ fontSize: 20 }}>
                  {titre}
                </h3>
                <p className="text-gray-500" style={{ fontSize: 16, lineHeight: 1.7 }}>
                  [À compléter]
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 — Témoignages ── */}
      <section className="bg-white px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-[#1A1916] text-center mb-12" style={{ fontSize: 32 }}>
            Ils ont rejoint l&apos;équipe
          </h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            {['Membre A', 'Membre B', 'Membre C'].map((prenom) => (
              <div
                key={prenom}
                className="border border-gray-100 rounded-xl p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
                  <span className="font-medium text-[#1A1916]">{prenom}</span>
                </div>
                <div className="text-yellow-400 tracking-wide text-sm">★★★★★</div>
                <p className="text-gray-400" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  [À compléter]
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section id="rejoindre" className="bg-[#F7F5F0] px-4 py-20 flex flex-col items-center text-center">
        <h2 className="font-bold text-[#1A1916] mb-6" style={{ fontSize: 32 }}>
          Prêt à rejoindre l&apos;équipe ?
        </h2>
        <CTA />
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 py-10 flex justify-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          style={{ fontSize: 14 }}
        >
          ← Retour au classement
        </Link>
      </footer>
    </main>
  )
}
