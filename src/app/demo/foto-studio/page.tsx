'use client'

import { useState } from 'react'

const BG = '#111111'
const BG2 = '#1a1a1a'
const BG3 = '#222222'
const AMBER = '#e8a838'
const AMBER_DIM = '#c48c2a'
const WHITE = '#f0ede8'
const GRAY = '#888888'
const GRAY_LIGHT = '#555555'

const categories = ['Všetky', 'Svadby', 'Portréty', 'Produkty', 'Eventy', 'Architektúra', 'Príroda']

const portfolioItems = [
  { id: 1, category: 'Svadby', ratio: '3/4', label: 'Svadobný moment', sub: 'Bratislava, 2025' },
  { id: 2, category: 'Portréty', ratio: '1/1', label: 'Korporátny portrét', sub: 'Štúdio, 2025' },
  { id: 3, category: 'Produkty', ratio: '4/3', label: 'Produktová séria', sub: 'E-commerce, 2024' },
  { id: 4, category: 'Eventy', ratio: '16/9', label: 'Firemný event', sub: 'Hotel Devín, 2025' },
  { id: 5, category: 'Architektúra', ratio: '2/3', label: 'Interiér', sub: 'Penthouse BA, 2024' },
  { id: 6, category: 'Príroda', ratio: '3/2', label: 'Zlatá hodinka', sub: 'Malé Karpaty, 2025' },
  { id: 7, category: 'Svadby', ratio: '2/3', label: 'Detaily', sub: 'Weinberg Resort, 2025' },
  { id: 8, category: 'Portréty', ratio: '3/4', label: 'Lifestyle séria', sub: 'Exteriér, 2024' },
  { id: 9, category: 'Produkty', ratio: '1/1', label: 'Šperky & hodinky', sub: 'Štúdio, 2025' },
]

const packages = [
  {
    name: 'MINI',
    price: '199 €',
    duration: '1–2 hodiny',
    features: [
      '60–80 finálnych fotografií',
      'Jedno miesto, jedna téma',
      'Online galéria na 6 mesiacov',
      'Základná postprodukcia',
    ],
    highlight: false,
  },
  {
    name: 'ŠTANDARD',
    price: '399 €',
    duration: '3–4 hodiny',
    features: [
      '150–200 finálnych fotografií',
      'Až 3 lokácie alebo témy',
      'Online galéria na 12 mesiacov',
      'Pokročilá retuš & farebná gradácia',
      'Printové súbory vo vysokom rozlíšení',
    ],
    highlight: true,
  },
  {
    name: 'PREMIUM',
    price: '699 €',
    duration: 'Celý deň',
    features: [
      '300+ finálnych fotografií',
      'Neobmedzené lokácie',
      'Online galéria na 24 mesiacov',
      'Komplexná retušér editácia',
      'Printové + digitálne súbory',
      'Fotoalbum A4 (20 strán)',
    ],
    highlight: false,
  },
]

const testimonials = [
  {
    initials: 'T. R.',
    text: 'Svadobné fotografie prekonali naše očakávania. Každý záber je príbeh — emócie, svetlo, kompozícia. Tieto fotky budú v rodine navždy.',
    occasion: 'Svadba, september 2025',
  },
  {
    initials: 'L. M.',
    text: 'Korporátne portréty dopadli perfektne. Profesionálny prístup, príjemná atmosféra pri fotení. Celý tím bol spokojný.',
    occasion: 'Firemná fotosession, 2025',
  },
  {
    initials: 'K. S.',
    text: 'Produktové fotografie zvýšili predaj v e-shope o 40 %. Kvalita je úplne iná liga ako to, čo sme mali pred tým.',
    occasion: 'Produktová fotografia, 2024',
  },
]

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${GRAY_LIGHT}22`,
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px',
    }}>
      <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.3rem', letterSpacing: '0.3em', color: WHITE, fontWeight: 400 }}>
        ATELIER <span style={{ color: AMBER }}>NOIR</span>
      </span>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="desk-nav">
        {['Portfólio', 'O mne', 'Balíčky', 'Kontakt'].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace('ó', 'o').replace(' ', '')}`}
            style={{ color: GRAY, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
            onMouseLeave={e => (e.currentTarget.style.color = GRAY)}
          >{l}</a>
        ))}
        <a href="#kontakt" style={{
          background: AMBER, color: '#111', padding: '0.45rem 1.2rem',
          fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          textDecoration: 'none', fontWeight: 600,
        }}>Rezervovať</a>
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: WHITE, fontSize: '1.4rem', display: 'none',
      }} className="hamburger" aria-label="Menu">☰</button>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: BG2, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
          borderBottom: `1px solid ${GRAY_LIGHT}33`,
        }}>
          {['Portfólio', 'O mne', 'Balíčky', 'Kontakt'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace('ó', 'o')}`}
              onClick={() => setMenuOpen(false)}
              style={{ color: WHITE, fontSize: '1rem', letterSpacing: '0.12em', textDecoration: 'none' }}
            >{l}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .desk-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

function Hero() {
  return (
    <section id="hero" style={{
      minHeight: '100vh', background: BG,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background texture lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(232,168,56,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,168,56,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        pointerEvents: 'none',
      }} />

      {/* Cinematic vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Center image placeholder */}
      <div style={{
        position: 'absolute', inset: '10%',
        background: `linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #1a1a1a 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" style={{ opacity: 0.06 }}>
          <circle cx="60" cy="40" r="30" stroke="#e8a838" strokeWidth="1"/>
          <circle cx="60" cy="40" r="15" stroke="#e8a838" strokeWidth="1"/>
          <rect x="10" y="15" width="100" height="50" rx="4" stroke="#e8a838" strokeWidth="1"/>
          <circle cx="85" cy="18" r="5" stroke="#e8a838" strokeWidth="1"/>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.4em',
          color: AMBER, textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>— Photography Studio —</p>

        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 10vw, 7rem)',
          color: WHITE, fontWeight: 300, letterSpacing: '0.08em',
          lineHeight: 1, margin: '0 0 0.2rem',
        }}>ATELIER</h1>
        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 10vw, 7rem)',
          color: AMBER, fontWeight: 700, letterSpacing: '0.08em',
          lineHeight: 1, margin: '0 0 2.5rem',
        }}>NOIR</h1>

        <p style={{
          fontFamily: 'monospace', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
          color: '#aaa', letterSpacing: '0.2em', maxWidth: '500px', margin: '0 auto 3rem',
        }}>Zachytíme váš príbeh</p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#portfolio" style={{
            background: AMBER, color: '#111', padding: '0.85rem 2.5rem',
            fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            textDecoration: 'none', fontWeight: 700,
          }}>Prezrieť portfólio</a>
          <a href="#kontakt" style={{
            border: `1px solid ${GRAY_LIGHT}`, color: WHITE,
            padding: '0.85rem 2.5rem', fontSize: '0.75rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
          }}>Nezáväzná konzultácia</a>
        </div>

        <p style={{
          marginTop: '5rem', fontFamily: 'monospace', fontSize: '0.65rem',
          color: GRAY_LIGHT, letterSpacing: '0.15em',
        }}>↓ SCROLL</p>
      </div>
    </section>
  )
}

function Portfolio() {
  const [active, setActive] = useState('Všetky')

  const filtered = active === 'Všetky'
    ? portfolioItems
    : portfolioItems.filter(i => i.category === active)

  // Fake gradient palettes for placeholder blocks
  const gradients = [
    'linear-gradient(135deg, #1e1e1e, #2d2d2d)',
    'linear-gradient(135deg, #1a1f1a, #252d25)',
    'linear-gradient(135deg, #1f1e1a, #2d2b25)',
    'linear-gradient(160deg, #1a1a2a, #222238)',
    'linear-gradient(135deg, #1e1a1a, #2d2525)',
    'linear-gradient(135deg, #1a1e1e, #252d2d)',
  ]

  return (
    <section id="portfolio" style={{ background: BG, padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.4em', color: AMBER, marginBottom: '0.8rem' }}>02 / PORTFÓLIO</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: WHITE, fontWeight: 300, letterSpacing: '0.05em', margin: 0 }}>
            Vybrané práce
          </h2>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              background: active === cat ? AMBER : 'transparent',
              color: active === cat ? '#111' : GRAY,
              border: `1px solid ${active === cat ? AMBER : GRAY_LIGHT}`,
              padding: '0.4rem 1rem', fontSize: '0.7rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: active === cat ? 700 : 400,
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
        }}>
          {filtered.map((item, idx) => (
            <div key={item.id} style={{
              aspectRatio: item.ratio,
              background: gradients[idx % gradients.length],
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
              minHeight: '200px',
            }}
              onMouseEnter={e => {
                const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                if (overlay) overlay.style.opacity = '1'
              }}
              onMouseLeave={e => {
                const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement
                if (overlay) overlay.style.opacity = '0'
              }}
            >
              {/* Camera icon watermark */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="48" height="36" viewBox="0 0 48 36" fill="none" style={{ opacity: 0.07 }}>
                  <rect x="2" y="8" width="44" height="26" rx="3" stroke="#e8a838" strokeWidth="1.5"/>
                  <circle cx="24" cy="21" r="9" stroke="#e8a838" strokeWidth="1.5"/>
                  <circle cx="24" cy="21" r="5" stroke="#e8a838" strokeWidth="1"/>
                  <rect x="16" y="2" width="16" height="8" rx="2" stroke="#e8a838" strokeWidth="1.5"/>
                  <circle cx="38" cy="13" r="2" fill="#e8a838" opacity="0.3"/>
                </svg>
              </div>

              {/* Hover overlay */}
              <div className="overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(17,17,17,0.85)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.3s',
                padding: '1.5rem', textAlign: 'center',
              }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.3em', marginBottom: '0.5rem' }}>{item.category.toUpperCase()}</p>
                <p style={{ fontFamily: 'Georgia, serif', color: WHITE, fontSize: '1rem', margin: '0 0 0.4rem' }}>{item.label}</p>
                <p style={{ fontFamily: 'monospace', color: GRAY, fontSize: '0.65rem', letterSpacing: '0.1em' }}>{item.sub}</p>
              </div>

              {/* Bottom label (always visible) */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '0.6rem 0.8rem',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: GRAY, letterSpacing: '0.15em', margin: 0 }}>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  const stats = [
    { num: '10+', label: 'rokov praxe' },
    { num: '800+', label: 'spokojných klientov' },
    { num: '50+', label: 'svadieb ročne' },
    { num: '12', label: 'ocenení' },
  ]

  return (
    <section id="omne" style={{ background: BG2, padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

        {/* Image placeholder */}
        <div style={{
          aspectRatio: '3/4', background: 'linear-gradient(160deg, #1e1e1e, #2a2a2a)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.06 }}>
              <circle cx="40" cy="32" r="14" stroke="#e8a838" strokeWidth="1.5"/>
              <path d="M20 68c0-11 9-20 20-20s20 9 20 20" stroke="#e8a838" strokeWidth="1.5"/>
            </svg>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '2rem 1.5rem',
          }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: AMBER, letterSpacing: '0.3em', margin: '0 0 0.3rem' }}>FOTOGRAF</p>
            <p style={{ fontFamily: 'Georgia, serif', color: WHITE, fontSize: '1.1rem', margin: 0 }}>Atelier NOIR</p>
          </div>

          {/* Amber corner accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '60px', height: '60px',
            borderTop: `2px solid ${AMBER}`, borderRight: `2px solid ${AMBER}`,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            width: '60px', height: '60px',
            borderBottom: `2px solid ${AMBER}`, borderLeft: `2px solid ${AMBER}`,
          }} />
        </div>

        {/* Text */}
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.4em', color: AMBER, marginBottom: '1rem' }}>03 / O MNE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: WHITE, fontWeight: 300, lineHeight: 1.2, margin: '0 0 1.5rem' }}>
            Svetlo, emócia,<br /><em style={{ fontStyle: 'italic', color: AMBER }}>príbeh.</em>
          </h2>

          <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.2rem' }}>
            Profesionálny fotograf s 10-ročnou praxou. Špecializujem sa na svadobnú, komerčnú a portrétnú fotografiu — všade tam, kde záleží na každom detaile.
          </p>
          <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            Každá fotografia je pre mňa dialóg medzi svetlom a emóciou. Nepracujem len s technikou — pracujem s ľuďmi, aby sme spolu vytvorili niečo nadčasové.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {stats.map(s => (
              <div key={s.num} style={{ borderLeft: `2px solid ${AMBER}`, paddingLeft: '1rem' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: AMBER, margin: '0 0 0.2rem', fontWeight: 700 }}>{s.num}</p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: GRAY, letterSpacing: '0.15em', margin: 0, textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 750px) {
            #omne > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

function Packages() {
  return (
    <section id="balicky" style={{ background: BG, padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.4em', color: AMBER, marginBottom: '0.8rem' }}>04 / BALÍČKY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: WHITE, fontWeight: 300, margin: 0 }}>Cenník</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: GRAY_LIGHT + '33' }}>
          {packages.map(pkg => (
            <div key={pkg.name} style={{
              background: pkg.highlight ? BG3 : BG2,
              padding: '3rem 2rem',
              position: 'relative',
              borderTop: pkg.highlight ? `3px solid ${AMBER}` : `3px solid transparent`,
            }}>
              {pkg.highlight && (
                <div style={{
                  position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                  background: AMBER, color: '#111', fontSize: '0.6rem',
                  letterSpacing: '0.2em', padding: '0.25rem 1rem', fontWeight: 700,
                  textTransform: 'uppercase',
                }}>Najpopulárnejší</div>
              )}

              <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.3em', color: AMBER, marginBottom: '1rem' }}>{pkg.name}</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: WHITE, fontWeight: 700, margin: '0 0 0.3rem', lineHeight: 1 }}>{pkg.price}</p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: GRAY, letterSpacing: '0.15em', marginBottom: '2rem' }}>{pkg.duration}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem' }}>
                {pkg.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                    color: '#aaa', fontSize: '0.88rem', marginBottom: '0.75rem', lineHeight: 1.5,
                  }}>
                    <span style={{ color: AMBER, flexShrink: 0, marginTop: '2px' }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#kontakt" style={{
                display: 'block', textAlign: 'center',
                background: pkg.highlight ? AMBER : 'transparent',
                color: pkg.highlight ? '#111' : WHITE,
                border: `1px solid ${pkg.highlight ? AMBER : GRAY_LIGHT}`,
                padding: '0.85rem',
                fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', fontWeight: pkg.highlight ? 700 : 400,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  if (!pkg.highlight) {
                    e.currentTarget.style.background = AMBER + '15'
                    e.currentTarget.style.borderColor = AMBER
                    e.currentTarget.style.color = AMBER
                  }
                }}
                onMouseLeave={e => {
                  if (!pkg.highlight) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = GRAY_LIGHT
                    e.currentTarget.style.color = WHITE
                  }
                }}
              >
                Vybrať balíček
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.65rem', color: GRAY, marginTop: '1.5rem', letterSpacing: '0.1em' }}>
          Ceny sú bez DPH. Na svadobné balíčky sa vzťahuje individuálna konzultácia.
        </p>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="hodnotenia" style={{ background: BG2, padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.4em', color: AMBER, marginBottom: '0.8rem' }}>05 / HODNOTENIA</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: WHITE, fontWeight: 300, margin: 0 }}>Čo hovoria klienti</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: GRAY_LIGHT + '22' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: BG, padding: '2.5rem', position: 'relative' }}>
              <div style={{
                fontFamily: 'Georgia, serif', fontSize: '4rem', color: AMBER, opacity: 0.25,
                lineHeight: 1, marginBottom: '1rem', display: 'block',
              }}>"</div>

              <p style={{ color: '#bbb', lineHeight: 1.8, fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                {t.text}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: BG3, border: `1px solid ${AMBER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontSize: '0.7rem', color: AMBER, letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>{t.initials}</div>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: WHITE, margin: '0 0 0.2rem', letterSpacing: '0.1em' }}>{t.initials}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: GRAY, letterSpacing: '0.1em', margin: 0 }}>{t.occasion}</p>
                </div>

                {/* Star rating */}
                <div style={{ marginLeft: 'auto', color: AMBER, fontSize: '0.7rem', letterSpacing: '2px' }}>★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle = {
    width: '100%', background: BG3, border: `1px solid ${GRAY_LIGHT}`,
    color: WHITE, padding: '0.85rem 1rem', fontSize: '0.9rem',
    fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  }

  return (
    <section id="kontakt" style={{ background: BG, padding: '7rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>

        {/* Left info */}
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.4em', color: AMBER, marginBottom: '1rem' }}>06 / KONTAKT</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: WHITE, fontWeight: 300, margin: '0 0 2rem', lineHeight: 1.3 }}>
            Začnime<br /><em style={{ color: AMBER }}>spoluprácu</em>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { label: 'Email', val: 'info@ateliernoir.sk' },
              { label: 'Telefón', val: '+421 9XX XXX XXX' },
              { label: 'Štúdio', val: 'Bratislava, Slovakia' },
              { label: 'Pracovné hodiny', val: 'Po–Pi 9:00–18:00' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>{item.label}</p>
                <p style={{ color: '#bbb', fontSize: '0.95rem', margin: 0 }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {[
              { name: 'IG', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { name: 'FB', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { name: 'YT', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            ].map(s => (
              <a key={s.name} href="#" aria-label={s.name} style={{
                width: '40px', height: '40px', border: `1px solid ${GRAY_LIGHT}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.background = AMBER + '15' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_LIGHT; e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={GRAY}>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem',
            }}>
              <div style={{ color: AMBER, fontSize: '2.5rem' }}>✓</div>
              <h3 style={{ fontFamily: 'Georgia, serif', color: WHITE, fontSize: '1.5rem', margin: 0 }}>Správa odoslaná</h3>
              <p style={{ color: GRAY, fontFamily: 'monospace', fontSize: '0.8rem' }}>Ozvem sa do 24 hodín.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>MENO</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Vaše meno" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = AMBER}
                  onBlur={e => e.target.style.borderColor = GRAY_LIGHT}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>EMAIL</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="vas@email.sk" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = AMBER}
                  onBlur={e => e.target.style.borderColor = GRAY_LIGHT}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>ZÁUJEM O</label>
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  style={{ ...inputStyle, color: form.service ? WHITE : GRAY }}
                >
                  <option value="">Vyberte typ fotografie</option>
                  <option value="svadba">Svadobná fotografia</option>
                  <option value="portret">Portrét / Lifestyle</option>
                  <option value="produkty">Produktová fotografia</option>
                  <option value="event">Event / Firemná akcia</option>
                  <option value="architektura">Architektúra / Interiér</option>
                  <option value="ine">Iné</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: AMBER, letterSpacing: '0.2em', display: 'block', marginBottom: '0.4rem' }}>SPRÁVA</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Opíšte váš projekt, termín, miesto..." rows={4} required
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = AMBER}
                  onBlur={e => e.target.style.borderColor = GRAY_LIGHT}
                />
              </div>
              <button type="submit" style={{
                background: AMBER, color: '#111', border: 'none',
                padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = AMBER_DIM}
                onMouseLeave={e => e.currentTarget.style.background = AMBER}
              >
                Odoslať dopyt
              </button>
            </form>
          )}
        </div>

        <style>{`
          @media (max-width: 700px) {
            #kontakt > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a', borderTop: `1px solid ${GRAY_LIGHT}22`,
      padding: '2.5rem 2rem',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', letterSpacing: '0.3em', color: WHITE }}>
          ATELIER <span style={{ color: AMBER }}>NOIR</span>
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: GRAY, letterSpacing: '0.1em' }}>
          © 2026 Atelier NOIR. Všetky práva vyhradené.
        </span>
      </div>

      <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer" style={{
        fontFamily: 'monospace', fontSize: '0.65rem', color: GRAY,
        textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = AMBER}
        onMouseLeave={e => e.currentTarget.style.color = GRAY}
      >
        Web by <span style={{ color: AMBER }}>Vassweb</span>
      </a>
    </footer>
  )
}

export default function FotoStudioPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: WHITE, fontFamily: 'system-ui, sans-serif' }}>
      <NavBar />
      <Hero />
      <Portfolio />
      <About />
      <Packages />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
