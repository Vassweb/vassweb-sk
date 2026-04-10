'use client'

import { useState } from 'react'

const sage = '#7d8c6e'
const sageDark = '#2d3a2d'
const sageLight = '#b8c9a8'
const pink = '#e8c4c4'
const pinkLight = '#f5e8e8'
const cream = '#fefcf6'
const creamDark = '#f4f0e6'
const textDark = '#2d3a2d'
const textMid = '#5a6b52'
const textLight = '#8a9a82'

const products = [
  { name: 'Kytice', price: 'od 25 €', icon: '🌷', desc: 'Čerstvé sezónne kytice viazané s láskou — pre každú príležitosť i bez dôvodu.' },
  { name: 'Svadobné', price: 'od 89 €', icon: '🤍', desc: 'Svadobné kytice, aranžmány a výzdoba — váš veľký deň si zaslúži dokonalé kvety.' },
  { name: 'Smútočné', price: 'od 35 €', icon: '🕊️', desc: 'Dôstojné vence a smútočné väzby. Pomôžeme vám vyjadriť úctu a spomienku.' },
  { name: 'Izbové rastliny', price: 'od 12 €', icon: '🌿', desc: 'Zelené rastliny, kaktusy, orchidey — oživte váš domov kúskom prírody.' },
  { name: 'Dekorácie', price: 'od 19 €', icon: '🌸', desc: 'Sušené kvety, venčeky, dekoratívne aranžmány — prírodný štýl do každého interiéru.' },
  { name: 'Darčekové boxy', price: 'od 45 €', icon: '🎁', desc: 'Kvety v krabici, flower boxy, romantické darčeky — prekvapte niekoho blízkeho.' },
]

const gallery = [
  { bg: '#e8d5c4', overlay: 'rgba(125,140,110,0.12)', label: 'Jarné kytice' },
  { bg: '#e8c4c4', overlay: 'rgba(232,196,196,0.25)', label: 'Svadobná výzdoba' },
  { bg: '#c4d5c4', overlay: 'rgba(125,140,110,0.18)', label: 'Izbové rastliny' },
  { bg: '#d5c4e8', overlay: 'rgba(180,160,200,0.2)', label: 'Darčekové boxy' },
  { bg: '#e8e0c4', overlay: 'rgba(200,185,130,0.2)', label: 'Sušené kvety' },
  { bg: '#c4e8e0', overlay: 'rgba(100,160,150,0.18)', label: 'Smútočné väzby' },
]

const testimonials = [
  { name: 'Spokojná nevesta', text: 'Priestor pre recenziu — napríklad ohľadom svadobnej kytice, ako bola krásna, čerstvá a zodpovedala predstavám.', rating: 5 },
  { name: 'Spokojná zákazníčka', text: 'Priestor pre druhú recenziu — napríklad ohľadom flower boxu ako darčeka, doručenia a trvanlivosti kvetov.', rating: 5 },
  { name: 'Spokojný zákazník', text: 'Priestor pre tretiu recenziu — napríklad ohľadom smútočného venca, profesionálneho prístupu a rýchleho doručenia.', rating: 5 },
]

const hours = [
  { day: 'Pondelok – Piatok', time: '8:00 – 18:00' },
  { day: 'Sobota', time: '8:00 – 14:00' },
  { day: 'Nedeľa', time: 'Zatvorené' },
]

const occasions = ['Narodeniny', 'Svadba', 'Výročie', 'Pohreb / smútočné', 'Darček bez príležitosti', 'Iné']

export default function KvetinarstvoPage() {
  const [form, setForm] = useState({ name: '', phone: '', occasion: '', message: '' })
  const [sent, setSent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: cream, color: textDark, overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(254,252,246,0.95)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${creamDark}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌸</span>
            <span style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 20, fontWeight: 700, color: sageDark, letterSpacing: '0.02em' }}>Kvety & Radosť</span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['Ponuka', 'O nás', 'Galéria', 'Doručenie', 'Kontakt'].map(item => (
              <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '-')}`}
                style={{ color: textMid, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = sage)}
                onMouseLeave={e => (e.currentTarget.style.color = textMid)}>
                {item}
              </a>
            ))}
            <a href="#kontakt" style={{ background: sage, color: '#fff', padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = sageDark)}
              onMouseLeave={e => (e.currentTarget.style.background = sage)}>
              Objednať
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 64 }}>
        {/* Organic background blobs */}
        <div style={{ position: 'absolute', top: -80, right: -120, width: 500, height: 500, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: `radial-gradient(circle, ${pinkLight} 0%, transparent 70%)`, opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: -60, left: -100, width: 420, height: 420, borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%', background: `radial-gradient(circle, ${sageLight} 0%, transparent 70%)`, opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: 200, height: 200, borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%', background: `radial-gradient(circle, ${creamDark} 0%, transparent 70%)`, opacity: 0.8 }} />

        {/* Floating flower accents */}
        <div style={{ position: 'absolute', top: 120, right: '12%', fontSize: 48, opacity: 0.25, transform: 'rotate(15deg)' }}>🌷</div>
        <div style={{ position: 'absolute', bottom: 160, right: '25%', fontSize: 36, opacity: 0.2, transform: 'rotate(-10deg)' }}>🌸</div>
        <div style={{ position: 'absolute', top: 200, left: '8%', fontSize: 32, opacity: 0.2, transform: 'rotate(5deg)' }}>🌿</div>
        <div style={{ position: 'absolute', bottom: 200, left: '20%', fontSize: 28, opacity: 0.18, transform: 'rotate(-20deg)' }}>🌺</div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 24px', maxWidth: 720 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: pinkLight, border: `1px solid ${pink}`, borderRadius: 24, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>🌸</span>
            <span style={{ fontSize: 13, color: textMid, fontWeight: 500 }}>Čerstvé kvety každý deň od roku 2018</span>
          </div>

          <h1 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 700, color: sageDark, lineHeight: 1.1, margin: '0 0 20px' }}>
            Kvety & Radosť
          </h1>

          <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: sage, fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', marginBottom: 16 }}>
            Kvety pre každú príležitosť
          </p>

          <p style={{ fontSize: 16, color: textMid, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            Rodinný kvetinárstvo vo vašom meste. S láskou viažeme každú kyticu, aranžujeme každú svadobnú výzdobu a staráme sa o to, aby vaše kvety priniesli radosť.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#ponuka" style={{ background: sage, color: '#fff', padding: '14px 30px', borderRadius: 32, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'background 0.2s', boxShadow: `0 4px 20px ${sage}40` }}
              onMouseEnter={e => (e.currentTarget.style.background = sageDark)}
              onMouseLeave={e => (e.currentTarget.style.background = sage)}>
              Zobraziť ponuku
            </a>
            <a href="#kontakt" style={{ background: 'transparent', color: sageDark, padding: '14px 30px', borderRadius: 32, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: `2px solid ${sage}`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = sage; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = sageDark }}>
              Objednať kyticou
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {[['6+', 'rokov skúseností'], ['500+', 'spokojných zákazníkov'], ['100%', 'čerstvé kvety']].map(([num, label]) => (
              <div key={num} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: sage }}>{num}</div>
                <div style={{ fontSize: 13, color: textLight, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PONUKA */}
      <section id="ponuka" style={{ padding: '96px 24px', background: creamDark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sage }}>Naša ponuka</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', color: sageDark, margin: '12px 0 16px', fontWeight: 700 }}>Čo pre vás pripravíme</h2>
            <p style={{ color: textMid, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>Od jednoduchej kytice po kompletnú svadobnú výzdobu — každé zadanie berieme s rovnakou starostlivosťou.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} style={{ background: cream, borderRadius: 20, padding: 28, border: `1px solid ${pink}`, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px ${sage}20` }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{p.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 20, color: sageDark, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                  <span style={{ background: pinkLight, color: sage, fontWeight: 700, fontSize: 14, padding: '4px 12px', borderRadius: 16, whiteSpace: 'nowrap' }}>{p.price}</span>
                </div>
                <p style={{ color: textMid, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O NÁS */}
      <section id="o-nas" style={{ padding: '96px 24px', background: cream }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
          {/* Visual side */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '40% 60% 55% 45% / 45% 55% 45% 55%', background: `linear-gradient(135deg, ${pinkLight}, ${sageLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
              🌷
            </div>
            <div style={{ position: 'absolute', top: -16, right: -16, width: 80, height: 80, borderRadius: '50%', background: pink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌿</div>
            <div style={{ position: 'absolute', bottom: -16, left: -8, width: 64, height: 64, borderRadius: '50%', background: sageLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🌸</div>
            {/* Est. badge */}
            <div style={{ position: 'absolute', bottom: 20, right: 20, background: sageDark, color: cream, borderRadius: 16, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>2018</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Rok vzniku</div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sage }}>Náš príbeh</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(26px, 4vw, 38px)', color: sageDark, margin: '12px 0 20px', fontWeight: 700, lineHeight: 1.25 }}>
              Rodinné kvetinárstvo so srdcom
            </h2>
            <p style={{ color: textMid, fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>
              Priestor pre krátky príbeh vášho kvetinárstva — kedy vzniklo, z akej myšlienky, čo prinášate zákazníkom. Ideálne 2–3 vety, ktoré vyjadrujú váš osobný prístup.
            </p>
            <p style={{ color: textMid, fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
              Každé ráno dostávame čerstvé kvety priamo od overených pestovateľov. Nič neplánujeme vopred — každá kytica vzniká tu a teraz, s láskou a pozornosťou k detailu.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['🌺', 'Čerstvé každý deň'], ['🚚', 'Doručenie po BA'], ['👨‍👩‍👧', 'Rodinný podnik'], ['💚', 'Udržateľné zdroje']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: textMid, fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALÉRIA */}
      <section id="galeria" style={{ padding: '96px 24px', background: creamDark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sage }}>Galéria</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', color: sageDark, margin: '12px 0 0', fontWeight: 700 }}>Naše práce</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {gallery.map((item, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: i === 0 || i === 5 ? '30% 10% 30% 10% / 20% 30% 20% 30%' : 16, overflow: 'hidden', background: item.bg, cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <div style={{ position: 'absolute', inset: 0, background: item.overlay }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 16 }}>
                  <span style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: '5px 12px', fontSize: 13, fontWeight: 600, color: sageDark }}>{item.label}</span>
                </div>
                {/* Decorative flower overlay */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 48, opacity: 0.2 }}>
                  {['🌷', '🤍', '🕊️', '🎁', '🌸', '🌿'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DORUČENIE */}
      <section id="dorucenie" style={{ padding: '96px 24px', background: cream }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sage }}>Doručenie</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', color: sageDark, margin: '12px 0 16px', fontWeight: 700 }}>Donieseme kvety k vám</h2>
            <p style={{ color: textMid, fontSize: 16, maxWidth: 480, margin: '0 auto' }}>Nemusíte ísť nikam — my prinesieme radosť priamo k vašim dverám.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 48 }}>
            {[
              { icon: '⚡', title: 'Doručenie do 2 hodín', desc: 'Expresné doručenie po celom meste. Objednajte a dostanete kvety ešte dnes.', badge: 'Expresné', badgeBg: '#fff3cd' },
              { icon: '🚚', title: 'Celé Slovensko do 24 h', desc: 'Doručujeme do všetkých miest na Slovensku. Kvety bezpečne zabalené, aby dorazili čerstvé.', badge: 'Štandardné', badgeBg: pinkLight },
              { icon: '🌹', title: 'Express doručenie', desc: 'Zabudli ste na výročie? Objednajte do 12:00 a doručíme ešte dnes do 18:00 kamkoľvek v BA.', badge: 'Záchrana dňa', badgeBg: sageLight },
            ].map((item, i) => (
              <div key={i} style={{ background: creamDark, borderRadius: 20, padding: 28, border: `1px solid ${creamDark}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, background: item.badgeBg, borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: textMid }}>{item.badge}</div>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 18, color: sageDark, fontWeight: 700, margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ color: textMid, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Delivery note */}
          <div style={{ background: pinkLight, border: `1px solid ${pink}`, borderRadius: 16, padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>ℹ️</span>
            <p style={{ color: textMid, fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: sageDark }}>Ako objednať?</strong> Zavolajte nám, napíšte správu alebo vyplňte formulár nižšie. Potvrdíme dostupnosť a čas doručenia. Platba v hotovosti pri doručení alebo vopred prevodom.
            </p>
          </div>
        </div>
      </section>

      {/* HODNOTENIA */}
      <section id="hodnotenia" style={{ padding: '96px 24px', background: sageDark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sageLight }}>Hodnotenia</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', color: cream, margin: '12px 0 0', fontWeight: 700 }}>Čo hovoria zákazníci</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(254,252,246,0.07)', border: '1px solid rgba(254,252,246,0.15)', borderRadius: 20, padding: 28 }}>
                <div style={{ color: '#f5c842', fontSize: 18, marginBottom: 14, letterSpacing: 2 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: 'rgba(254,252,246,0.85)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${sage}, ${pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cream, fontWeight: 700, fontSize: 13, fontFamily: 'Georgia, Palatino, serif' }}>
                    {t.name.split('.')[0]}
                  </div>
                  <span style={{ color: sageLight, fontWeight: 600, fontSize: 14 }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" style={{ padding: '96px 24px', background: cream }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: sage }}>Kontakt</span>
            <h2 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', color: sageDark, margin: '12px 0 0', fontWeight: 700 }}>Objednajte sa alebo nás navštívte</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
            {/* Info */}
            <div>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 20, color: sageDark, fontWeight: 700, margin: '0 0 16px' }}>Kde nás nájdete</h3>
                {[
                  { icon: '📍', label: 'Adresa', val: 'Vaša adresa, vaše mesto' },
                  { icon: '📞', label: 'Telefón', val: '+421 9XX XXX XXX' },
                  { icon: '✉️', label: 'Email', val: 'info@kvetiny.sk' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18, width: 24, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: textLight, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{row.label}</div>
                      <div style={{ fontSize: 15, color: textDark, fontWeight: 500, marginTop: 2 }}>{row.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 20, color: sageDark, fontWeight: 700, margin: '0 0 16px' }}>Otváracie hodiny</h3>
                {hours.map(h => (
                  <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${creamDark}` }}>
                    <span style={{ fontSize: 14, color: textMid }}>{h.day}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: h.time === 'Zatvorené' ? '#c0392b' : sageDark }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{ background: creamDark, borderRadius: 24, padding: 32, border: `1px solid ${pink}` }}>
              <h3 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 20, color: sageDark, fontWeight: 700, margin: '0 0 24px' }}>Objednávkový formulár</h3>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>🌸</div>
                  <h4 style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 22, color: sageDark, margin: '0 0 10px' }}>Ďakujeme za objednávku!</h4>
                  <p style={{ color: textMid, fontSize: 14, lineHeight: 1.65 }}>Ozveme sa vám čo najskôr na potvrdenie detailov.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { id: 'name', label: 'Meno a priezvisko', type: 'text', placeholder: 'Vaše meno' },
                    { id: 'phone', label: 'Telefónne číslo', type: 'tel', placeholder: '+421 9XX XXX XXX' },
                  ].map(field => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textMid, marginBottom: 6 }}>{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder} required
                        value={form[field.id as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1px solid ${pink}`, background: cream, fontSize: 14, color: textDark, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.currentTarget.style.borderColor = sage)}
                        onBlur={e => (e.currentTarget.style.borderColor = pink)} />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textMid, marginBottom: 6 }}>Príležitosť</label>
                    <select required value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1px solid ${pink}`, background: cream, fontSize: 14, color: textDark, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.currentTarget.style.borderColor = sage)}
                      onBlur={e => (e.currentTarget.style.borderColor = pink)}>
                      <option value="">Vyberte príležitosť...</option>
                      {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textMid, marginBottom: 6 }}>Správa / detaily</label>
                    <textarea placeholder="Napíšte nám čo by ste si predstavovali, farby, rozpočet, termín doručenia..." rows={4}
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: `1px solid ${pink}`, background: cream, fontSize: 14, color: textDark, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.currentTarget.style.borderColor = sage)}
                      onBlur={e => (e.currentTarget.style.borderColor = pink)} />
                  </div>

                  <button type="submit" style={{ background: sage, color: '#fff', padding: '14px', borderRadius: 14, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = sageDark)}
                    onMouseLeave={e => (e.currentTarget.style.background = sage)}>
                    Odoslať objednávku 🌸
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: sageDark, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>🌸</span>
            <span style={{ fontFamily: 'Georgia, Palatino, serif', fontStyle: 'italic', fontSize: 18, color: cream, fontWeight: 700 }}>Kvety & Radosť</span>
          </div>
          <p style={{ color: 'rgba(254,252,246,0.5)', fontSize: 13, margin: '0 0 6px' }}>© 2026 Vaše kvetinárstvo · Vaša adresa</p>
          <p style={{ color: 'rgba(254,252,246,0.35)', fontSize: 12, margin: 0 }}>
            Web by{' '}
            <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer" style={{ color: sageLight, textDecoration: 'none', fontWeight: 600 }}>Vassweb</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
