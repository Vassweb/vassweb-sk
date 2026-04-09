'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Color tokens ───────────────────────────────────────────────────────────
const C = {
  white: '#ffffff',
  bg: '#f8fafc',
  bgCard: '#ffffff',
  indigo: '#6366f1',
  indigoDark: '#4f46e5',
  indigoLight: '#eef2ff',
  indigoMid: '#818cf8',
  dark: '#0f172a',
  mid: '#475569',
  light: '#94a3b8',
  border: '#e2e8f0',
  green: '#22c55e',
  greenLight: '#dcfce7',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  red: '#ef4444',
  redLight: '#fee2e2',
  purple: '#8b5cf6',
  purpleLight: '#ede9fe',
} as const

// ─── Static demo data ────────────────────────────────────────────────────────
const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne']
const DAYS_FULL = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa']
const HOURS = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`)
const SERVICES_LIST = ['Strih', 'Farbenie', 'Manikúra', 'Masáž', 'Konzultácia', 'Ošetrenie', 'Úprava']

type Booking = {
  id: string
  day: number
  hour: number
  service: string
  duration: number
  color: string
  ref: string
}

const COLORS = [C.indigo, C.purple, C.green, C.amber, C.red]

const PRESET_BOOKINGS: Booking[] = [
  { id: 'b1', day: 0, hour: 8,  service: 'Strih',        duration: 1, color: C.indigo, ref: '#1201' },
  { id: 'b2', day: 0, hour: 10, service: 'Farbenie',     duration: 2, color: C.purple, ref: '#1202' },
  { id: 'b3', day: 0, hour: 13, service: 'Masáž',        duration: 1, color: C.green,  ref: '#1203' },
  { id: 'b4', day: 0, hour: 15, service: 'Konzultácia',  duration: 1, color: C.amber,  ref: '#1204' },
  { id: 'b5', day: 1, hour: 9,  service: 'Manikúra',     duration: 1, color: C.green,  ref: '#1205' },
  { id: 'b6', day: 1, hour: 11, service: 'Ošetrenie',    duration: 2, color: C.indigo, ref: '#1206' },
  { id: 'b7', day: 1, hour: 14, service: 'Strih',        duration: 1, color: C.purple, ref: '#1207' },
  { id: 'b8', day: 2, hour: 8,  service: 'Farbenie',     duration: 2, color: C.purple, ref: '#1208' },
  { id: 'b9', day: 2, hour: 11, service: 'Masáž',        duration: 1, color: C.green,  ref: '#1209' },
  { id: 'b10',day: 3, hour: 10, service: 'Konzultácia',  duration: 1, color: C.amber,  ref: '#1210' },
  { id: 'b11',day: 3, hour: 13, service: 'Úprava',       duration: 1, color: C.indigo, ref: '#1211' },
  { id: 'b12',day: 4, hour: 9,  service: 'Strih',        duration: 1, color: C.indigo, ref: '#1212' },
]

// ─── Counter animation hook ───────────────────────────────────────────────────
function useCounter(target: number, duration = 1500, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return val
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function BookingSystemDemo() {
  const [view, setView] = useState<'landing' | 'demo'>('landing')
  const [selectedPlan, setSelectedPlan] = useState<number>(1)
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Demo state
  const [bookings, setBookings] = useState<Booking[]>(PRESET_BOOKINGS)
  const [modal, setModal] = useState<{ day: number; hour: number } | null>(null)
  const [newService, setNewService] = useState(SERVICES_LIST[0])
  const [newNote, setNewNote] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)

  const firms = useCounter(2000, 1800, heroVisible)
  const reservations = useCounter(500000, 2000, heroVisible)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeroVisible(true) }, { threshold: 0.3 })
    if (heroRef.current) obs.observe(heroRef.current)
    return () => obs.disconnect()
  }, [])

  // ── helpers ──
  const getBooking = (day: number, hour: number) =>
    bookings.find(b => b.day === day && b.hour <= hour && b.hour + b.duration > hour)

  const isOccupied = (day: number, hour: number) => !!getBooking(day, hour)

  const addBooking = () => {
    if (!modal) return
    const id = `b${Date.now()}`
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const ref = `#${1300 + bookings.length}`
    setBookings(prev => [...prev, { id, day: modal.day, hour: modal.hour, service: newService, duration: 1, color, ref }])
    setModal(null)
    setNewNote('')
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  const todayBookings = bookings.filter(b => b.day === 0)
  const totalSlots = 11 * 5 // Mon–Fri, 8–18
  const occupiedSlots = bookings.filter(b => b.day < 5).reduce((acc, b) => acc + b.duration, 0)
  const util = Math.round((occupiedSlots / totalSlots) * 100)

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, minHeight: '100vh', color: C.dark }}>

      {/* ── NAV ── */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: C.dark }}>BookIT</span>
            <span style={{ background: C.indigoLight, color: C.indigo, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginLeft: 4 }}>BETA</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {(['landing', 'demo'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '8px 18px', borderRadius: 8, border: view === v ? `1px solid ${C.indigo}` : `1px solid ${C.border}`, background: view === v ? C.indigoLight : 'transparent', color: view === v ? C.indigo : C.mid, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
                {v === 'landing' ? 'Produkt' : 'Live Demo'}
              </button>
            ))}
            <button style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, color: C.white, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Vyskúšať zadarmo
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════
          LANDING VIEW
      ════════════════════════════════════════════════════════ */}
      {view === 'landing' && (
        <>
          {/* HERO */}
          <section ref={heroRef} style={{ background: `linear-gradient(135deg, ${C.dark} 0%, #1e1b4b 60%, #312e81 100%)`, color: C.white, padding: '100px 24px 80px', textAlign: 'center' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 20, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: C.indigoDark }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }}></span>
                <span style={{ color: '#a5b4fc' }}>Nová verzia 2.0 — AI optimalizácia rozvrhu</span>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>
                Inteligentný rezervačný<br />
                <span style={{ background: `linear-gradient(90deg, ${C.indigoDark}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>systém pre váš biznis</span>
              </h1>
              <p style={{ fontSize: 20, color: '#cbd5e1', marginBottom: 48, lineHeight: 1.6 }}>
                Spravujte rezervácie, klientov a platby na jednom mieste.<br />
                Ušetrite 5+ hodín týždenne na administratíve.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
                <button onClick={() => setView('demo')} style={{ padding: '16px 36px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, color: C.white, fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                  Pozrieť demo →
                </button>
                <button style={{ padding: '16px 36px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: C.white, fontWeight: 600, fontSize: 17, cursor: 'pointer' }}>
                  Vyskúšať zadarmo
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 600, margin: '0 auto' }}>
                {[
                  { val: firms.toLocaleString('sk') + '+', label: 'aktívnych firiem' },
                  { val: (reservations / 1000).toFixed(0) + 'k+', label: 'rezervácií mesačne' },
                  { val: '4.9★', label: 'hodnotenie zákazníkov' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: C.white, letterSpacing: '-1px' }}>{s.val}</div>
                    <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRE KOHO */}
          <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ color: C.indigo, fontWeight: 600, fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Riešenie pre každé odvetvie</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>Pre koho je BookIT určený</h2>
              <p style={{ color: C.mid, fontSize: 17, maxWidth: 520, margin: '0 auto' }}>Prispôsobujeme sa vašemu odvetviu. Šablóny, nastavenia a integrácie presne podľa vašich potrieb.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              {[
                { icon: '💇', label: 'Kaderníctva & Salóny', desc: 'Online booking 24/7, SMS pripomenutia' },
                { icon: '🍽️', label: 'Reštaurácie', desc: 'Stolíky, kapacity, špeciálne akcie' },
                { icon: '🏥', label: 'Lekári & Kliniky', desc: 'Pacienti, ordinácie, recept online' },
                { icon: '💪', label: 'Fitness & Štúdiá', desc: 'Skupinové lekcie, tréneri, kapacity' },
                { icon: '🔧', label: 'Autoservisy', desc: 'Termíny, mechanici, čakacia doba' },
                { icon: '👔', label: 'Poradcovia', desc: 'Konzultácie, platby online, zmluvy' },
              ].map((item, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 22px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.indigo; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px rgba(99,102,241,0.12)` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ color: C.mid, fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FUNKCIE */}
          <section style={{ background: C.dark, padding: '80px 24px', color: C.white }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{ color: C.indigoDark, fontWeight: 600, fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Všetko čo potrebujete</p>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Funkcie, ktoré ušetria váš čas</h2>
                <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>Každá funkcia navrhnutá na základe spätnej väzby od tisícok podnikateľov.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                {[
                  { icon: '📅', title: 'Online rezervácie', desc: 'Klienti si rezervujú sami cez web alebo mobilnú appku. 24/7 bez vašej účasti.' },
                  { icon: '🗓️', title: 'Inteligentný kalendár', desc: 'Týždenný, denný aj mesačný pohľad. Sync s Google Calendar a Outlook.' },
                  { icon: '📱', title: 'SMS & Email notifikácie', desc: 'Automatické pripomenutia 24h pred termínom. Znížte no-show o 60%.' },
                  { icon: '💳', title: 'Platby online', desc: 'Zálohy aj plné platby cez Stripe. Faktúry generované automaticky.' },
                  { icon: '🏢', title: 'Multi-pobočky', desc: 'Spravujte viacero prevádzok z jedného dashboardu. Centrálne štatistiky.' },
                  { icon: '📊', title: 'Pokročilé štatistiky', desc: 'Revenue, vyťaženosť, top služby, najlepší klienti. Export do Excelu.' },
                  { icon: '🤖', title: 'AI optimalizácia', desc: 'AI navrhne optimálny rozvrh a upozorní na nevyužité kapacity.' },
                  { icon: '📲', title: 'Mobilná appka', desc: 'Natívna iOS a Android appka pre váš tím aj klientov. Offline režim.' },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 24px' }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CENNÍK */}
          <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ color: C.indigo, fontWeight: 600, fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Transparentné ceny</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Plán pre každý biznis</h2>
              <p style={{ color: C.mid, fontSize: 17 }}>Bez skrytých poplatkov. Zrušiť kedykoľvek.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {[
                {
                  name: 'Štart', price: '0', per: '/mes', badge: null,
                  desc: 'Ideálne pre začínajúce prevádzky',
                  features: ['50 rezervácií/mes', '1 pobočka', '1 zamestnanec', 'Email notifikácie', 'Základné štatistiky'],
                  cta: 'Začať zadarmo',
                },
                {
                  name: 'Profi', price: '29', per: '€/mes', badge: 'Najpopulárnejší',
                  desc: 'Pre rastúce prevádzky s pravidelnou klientelou',
                  features: ['500 rezervácií/mes', '3 pobočky', '5 zamestnancov', 'SMS + Email notifikácie', 'Platby online', 'Pokročilé štatistiky', 'Prioritná podpora'],
                  cta: 'Vyskúšať 14 dní zdarma',
                },
                {
                  name: 'Business', price: '79', per: '€/mes', badge: null,
                  desc: 'Pre väčšie tímy a sieť pobočiek',
                  features: ['Neobmedzené rezervácie', 'Neobmedzené pobočky', 'Neobmedzení zamestnanci', 'AI optimalizácia', 'Multi-pobočkový dashboard', 'API prístup', 'Dedikovaný account manager'],
                  cta: 'Kontaktovať obchod',
                },
              ].map((plan, i) => {
                const active = selectedPlan === i
                return (
                  <div key={i} onClick={() => setSelectedPlan(i)} style={{ background: active ? `linear-gradient(135deg, ${C.indigo}, ${C.purple})` : C.white, border: active ? 'none' : `1px solid ${C.border}`, borderRadius: 20, padding: '36px 28px', cursor: 'pointer', position: 'relative', transform: active ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.2s', boxShadow: active ? `0 16px 48px rgba(99,102,241,0.35)` : '0 2px 8px rgba(0,0,0,0.04)' }}>
                    {plan.badge && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.amber, color: '#78350f', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>{plan.badge}</div>}
                    <div style={{ color: active ? 'rgba(255,255,255,0.8)' : C.mid, fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                      <span style={{ fontSize: 48, fontWeight: 800, color: active ? C.white : C.dark, letterSpacing: '-2px' }}>{plan.price === '0' ? 'Free' : plan.price + '€'}</span>
                      {plan.price !== '0' && <span style={{ color: active ? 'rgba(255,255,255,0.7)' : C.mid, fontSize: 15 }}>{plan.per}</span>}
                    </div>
                    <p style={{ color: active ? 'rgba(255,255,255,0.75)' : C.mid, fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                      {plan.features.map((f, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: active ? 'rgba(255,255,255,0.9)' : C.dark }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? 'rgba(255,255,255,0.9)' : C.green} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button style={{ width: '100%', padding: '14px 0', borderRadius: 10, border: active ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${C.indigo}`, background: active ? 'rgba(255,255,255,0.15)' : C.indigoLight, color: active ? C.white : C.indigo, fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {plan.cta}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ background: C.dark, color: '#64748b', padding: '40px 24px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#94a3b8' }}>BookIT</span>
              </div>
              <p style={{ fontSize: 14, marginBottom: 8 }}>© 2026 BookIT · Všetky práva vyhradené</p>
              <p style={{ fontSize: 13 }}>
                Web vytvoril{' '}
                <span style={{ color: C.indigo, fontWeight: 600 }}>Vassweb</span>
                {' '}— na mieru vytvorené webové aplikácie
              </p>
            </div>
          </footer>
        </>
      )}

      {/* ════════════════════════════════════════════════════════
          DEMO VIEW
      ════════════════════════════════════════════════════════ */}
      {view === 'demo' && (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>

          {/* Demo top bar */}
          <div style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, borderRadius: 14, padding: '16px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Live Demo — BookIT Dashboard</div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>Interaktívny kalendár rezervácií</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', color: C.white, fontSize: 13, fontWeight: 600 }}>
                Kliknite na voľný slot → pridajte rezerváciu
              </div>
            </div>
          </div>

          {/* Success toast */}
          {successMsg && (
            <div style={{ background: C.greenLight, border: `1px solid ${C.green}`, borderRadius: 10, padding: '12px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#166534', fontWeight: 600, fontSize: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Rezervácia bola úspešne pridaná!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

            {/* ── CALENDAR GRID ── */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              {/* Days header */}
              <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(7, 1fr)', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ padding: '12px 8px', background: C.bg }} />
                {DAYS.map((d, i) => (
                  <div key={i} style={{ padding: '12px 4px', textAlign: 'center', background: i === 0 ? C.indigoLight : C.bg, borderLeft: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, color: i === 0 ? C.indigo : C.light, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? C.indigo : C.dark, marginTop: 2 }}>{7 + i}</div>
                  </div>
                ))}
              </div>

              {/* Time rows */}
              <div style={{ maxHeight: 520, overflowY: 'auto' }}>
                {HOURS.map((hour, hi) => (
                  <div key={hi} style={{ display: 'grid', gridTemplateColumns: '64px repeat(7, 1fr)', borderBottom: `1px solid ${C.border}`, minHeight: 48 }}>
                    {/* Time label */}
                    <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', color: C.light, fontSize: 12, fontWeight: 500, background: C.bg, borderRight: `1px solid ${C.border}` }}>
                      {hour}
                    </div>
                    {/* Day cells */}
                    {DAYS.map((_, di) => {
                      const booking = getBooking(di, hi + 8)
                      const isStart = booking && booking.hour === hi + 8
                      const occupied = isOccupied(di, hi + 8)

                      if (occupied && !isStart) {
                        // continuation cell — blank (covered by rowspan visual)
                        return <div key={di} style={{ borderLeft: `1px solid ${C.border}`, background: booking ? booking.color + '18' : 'transparent' }} />
                      }

                      return (
                        <div key={di}
                          onClick={() => !occupied && setModal({ day: di, hour: hi + 8 })}
                          style={{
                            borderLeft: `1px solid ${C.border}`,
                            padding: '4px 6px',
                            cursor: occupied ? 'default' : 'pointer',
                            background: isStart && booking ? booking.color + '18' : 'transparent',
                            position: 'relative',
                            minHeight: isStart && booking ? 48 * booking.duration - 1 : 47,
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { if (!occupied) (e.currentTarget as HTMLDivElement).style.background = C.indigoLight }}
                          onMouseLeave={e => { if (!occupied) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                        >
                          {isStart && booking && (
                            <div style={{ background: booking.color, borderRadius: 6, padding: '4px 8px', height: '90%', overflow: 'hidden' }}>
                              <div style={{ color: C.white, fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{booking.service}</div>
                              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>{booking.ref}</div>
                            </div>
                          )}
                          {!occupied && (
                            <div style={{ color: C.indigo, fontSize: 18, opacity: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'opacity 0.1s', pointerEvents: 'none' }} className="add-icon">+</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Today stats */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: C.dark }}>Štatistiky dnes</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { val: todayBookings.length, label: 'Rezervácií', color: C.indigo, bg: C.indigoLight },
                    { val: Math.max(0, 11 - todayBookings.reduce((a,b)=>a+b.duration,0)), label: 'Voľné sloty', color: C.green, bg: C.greenLight },
                    { val: util + '%', label: 'Vyťaženosť', color: C.purple, bg: C.purpleLight },
                    { val: todayBookings.length * 25 + '€', label: 'Tržby', color: C.amber, bg: C.amberLight },
                  ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2, opacity: 0.8 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's bookings list */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.dark }}>Dnešné rezervácie</div>
                  <span style={{ background: C.indigoLight, color: C.indigo, fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{todayBookings.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                  {todayBookings.length === 0 && (
                    <div style={{ color: C.light, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Žiadne rezervácie na dnes</div>
                  )}
                  {todayBookings.sort((a, b) => a.hour - b.hour).map(b => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: C.bg, borderRadius: 10, borderLeft: `3px solid ${b.color}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>Rezervácia {b.ref}</div>
                        <div style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>
                          {b.hour}:00 – {b.hour + b.duration}:00 · {b.service}
                        </div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: C.dark }}>Rýchle akcie</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Exportovať do PDF', icon: '📄', color: C.indigo },
                    { label: 'Odoslať pripomenutia', icon: '📱', color: C.green },
                    { label: 'Správa zamestnancov', icon: '👥', color: C.purple },
                    { label: 'Štatistiky týždňa', icon: '📊', color: C.amber },
                  ].map((a, i) => (
                    <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 600, color: C.dark, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span>{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Tip */}
              <div style={{ background: `linear-gradient(135deg, ${C.indigoLight}, ${C.purpleLight})`, border: `1px solid ${C.indigoDark}20`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>🤖</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.indigo }}>AI tip</span>
                </div>
                <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.5, margin: 0 }}>
                  Streda 8:00–10:00 je dlhodobo nevyužitá. Skúste pridať zľavovú akciu pre ranné termíny.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          BOOKING MODAL
      ════════════════════════════════════════════════════════ */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div style={{ background: C.white, borderRadius: 20, padding: '32px', width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: 20, margin: 0, color: C.dark }}>Nová rezervácia</h3>
                <p style={{ color: C.mid, fontSize: 14, margin: '4px 0 0' }}>
                  {DAYS_FULL[modal.day]} · {modal.hour}:00 – {modal.hour + 1}:00
                </p>
              </div>
              <button onClick={() => setModal(null)} style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: C.mid }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, display: 'block', marginBottom: 8 }}>Služba</label>
                <select value={newService} onChange={e => setNewService(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 15, color: C.dark, background: C.bg, outline: 'none', cursor: 'pointer' }}>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.dark, display: 'block', marginBottom: 8 }}>Poznámka (voliteľné)</label>
                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Špeciálne požiadavky, poznámky..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, color: C.dark, background: C.bg, outline: 'none', resize: 'none', height: 80, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: C.indigoLight, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: C.indigo, fontWeight: 600, marginBottom: 4 }}>Čas</div>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>{modal.hour}:00 – {modal.hour + 1}:00</div>
                </div>
                <div style={{ background: C.greenLight, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 4 }}>Slot</div>
                  <div style={{ fontWeight: 700, color: C.dark, fontSize: 15 }}>K dispozícii</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, padding: '13px 0', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.mid, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  Zrušiť
                </button>
                <button onClick={addBooking} style={{ flex: 2, padding: '13px 0', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.indigo}, ${C.purple})`, color: C.white, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: `0 4px 14px rgba(99,102,241,0.35)` }}>
                  Pridať rezerváciu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
