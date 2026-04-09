'use client';

import { useState, useEffect, useRef } from 'react';

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  navy: '#0f1b2d',
  navyMid: '#162338',
  navyLight: '#1e2f47',
  gold: '#c9a84c',
  goldLight: '#dbb96a',
  goldDim: 'rgba(201,168,76,0.15)',
  goldBorder: 'rgba(201,168,76,0.3)',
  white: '#ffffff',
  offWhite: '#f7f5f0',
  text: '#1a1a2e',
  textMuted: '#5a5a7a',
  textLight: '#e8e4d9',
  border: '#e2ddd4',
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons: Record<string, string> = {
  briefcase: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9-4h2a2 2 0 0 1 2 2v1H9V5a2 2 0 0 1 2-2z M10 5V3m4 2V3',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 0a3 3 0 0 0 0-6m4 10v-2a3 3 0 0 0-3-3',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14a19.79 19.79 0 0 1-3.07-8.67 2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0z',
  scale: 'M12 3v2m0 14v2M3 12h2m14 0h2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4M6.3 17.7l1.4-1.4m8.6-8.6 1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  quote: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  chevronRight: 'M9 18l6-6-6-6',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  x: 'M18 6 6 18M6 6l12 12',
};

function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.5 }: { name: string; size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={Icons[name]} />
    </svg>
  );
}

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── PRACTICE AREAS DATA ──────────────────────────────────────────────────────
const practiceAreas = [
  {
    icon: 'briefcase',
    title: 'Obchodné právo',
    desc: 'Zakladanie obchodných spoločností, korporátne poradenstvo, M&A transakcie a obchodné zmluvy.',
    tags: ['Zmluvy', 'Zakladanie firiem', 'M&A'],
  },
  {
    icon: 'users',
    title: 'Pracovné právo',
    desc: 'Pracovné zmluvy, kolektívne vyjednávanie, riešenie pracovných sporov a výpovede.',
    tags: ['Pracovné zmluvy', 'Spory', 'Výpovede'],
  },
  {
    icon: 'home',
    title: 'Nehnuteľnosti',
    desc: 'Komplexné právne poradenstvo pri kúpe, predaji a nájme nehnuteľností, kataster.',
    tags: ['Kúpa & predaj', 'Nájom', 'Kataster'],
  },
  {
    icon: 'heart',
    title: 'Rodinné právo',
    desc: 'Rozvody, úprava styku s deťmi, výživné a majetkové vyporiadanie po rozvode.',
    tags: ['Rozvody', 'Výživné', 'Opatrovníctvo'],
  },
  {
    icon: 'shield',
    title: 'Trestné právo',
    desc: 'Obhajoba v trestnom konaní, zastupovanie poškodených, trestné oznámenia.',
    tags: ['Obhajoba', 'Zastupovanie', 'Poradenstvo'],
  },
  {
    icon: 'dollar',
    title: 'Vymáhanie pohľadávok',
    desc: 'Mimosúdne aj súdne vymáhanie pohľadávok, exekučné konania, insolvencia.',
    tags: ['Súdne vymáhanie', 'Mimosúdne', 'Exekúcia'],
  },
];

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
const team = [
  {
    initials: 'MK',
    name: 'JUDr. M. K.',
    role: 'Managing Partner',
    specialization: 'Obchodné právo, M&A',
    exp: '15 rokov praxe',
    color: C.gold,
    bio: 'Zakladateľ kancelárie s rozsiahlou praxou v oblasti obchodného práva. Špecialista na fúzie a akvizície, corporate governance a medzinárodné obchodné transakcie.',
  },
  {
    initials: 'KS',
    name: 'Mgr. K. S.',
    role: 'Senior Advokátka',
    specialization: 'Obchodné a pracovné právo',
    exp: '11 rokov praxe',
    color: '#8b7cbc',
    bio: 'Absolventka Právnickej fakulty UK. Dlhoročná odborníčka na pracovnoprávne vzťahy a compliance. Pravidelne prednáša na HR konferenciách.',
  },
  {
    initials: 'TB',
    name: 'JUDr. T. B.',
    role: 'Advokát',
    specialization: 'Trestné právo, Pohľadávky',
    exp: '8 rokov praxe',
    color: '#4a8fa8',
    bio: 'Pred advokátskou praxou pôsobil ako prokurátor. Odborník na obhajobu v trestných veciach a zastupovanie klientov v komplexných sporoch.',
  },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    text: 'Pomohli nám pri komplexnej akvizícii spoločnosti. Profesionálny prístup, rýchla odozva a výsledok prekonal naše očakávania. Odporúčam každému podnikateľovi.',
    author: 'M. H.',
    position: 'Konateľ IT firmy',
    rating: 5,
  },
  {
    text: 'Po rozvode som riešila majetkové vyporiadanie a opatrovníctvo detí. Pridelená advokátka bola empatická, trpezlivá a zároveň dôsledná. Vďaka nej sme dospeli k férovej dohode.',
    author: 'K. N.',
    position: 'Majiteľka e-shopu',
    rating: 5,
  },
  {
    text: 'Vymáhanie pohľadávky vo výške 85 000 € od neplatiaceho odberateľa. Do 4 mesiacov mali sme peniaze na účte. Servis na najvyššej úrovni, vrelo odporúčam.',
    author: 'R. B.',
    position: 'Výkonný riaditeľ, strojárska firma',
    rating: 5,
  },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
const stats = [
  { value: 15, suffix: '+', label: 'rokov praxe' },
  { value: 2000, suffix: '+', label: 'prípadov' },
  { value: 95, suffix: '%', label: 'úspešnosť' },
  { value: 6, suffix: '', label: 'právnikov' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdvokatKovac() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', area: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Oblasti práva', id: 'oblasti' },
    { label: 'O kancelárii', id: 'o-nas' },
    { label: 'Tím', id: 'tim' },
    { label: 'Hodnotenia', id: 'hodnotenia' },
    { label: 'Kontakt', id: 'kontakt' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text, background: C.white, overflowX: 'hidden' }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.goldDim}; color: ${C.navy}; }
        .nav-link:hover { color: ${C.gold} !important; }
        .area-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .area-card:hover .area-icon { background: ${C.gold} !important; }
        .area-card:hover .area-icon svg { stroke: ${C.navy} !important; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important; }
        .cta-btn:hover { background: ${C.goldLight} !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.4) !important; }
        .cta-btn-outline:hover { background: ${C.goldDim} !important; }
        .form-input:focus { outline: none; border-color: ${C.gold} !important; box-shadow: 0 0 0 3px ${C.goldDim} !important; }
        .submit-btn:hover { background: ${C.goldLight} !important; transform: translateY(-1px); }
        .footer-link:hover { color: ${C.gold} !important; }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.4rem !important; }
          .hero-sub { font-size: 1rem !important; }
          .section-title { font-size: 2rem !important; }
          .areas-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .testimonials-row { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .hero-btns { flex-direction: column !important; align-items: flex-start !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(15,27,45,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.goldBorder}` : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 4,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="scale" size={20} color={C.navy} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: 0.3, lineHeight: 1.2 }}>JUDr. Kováč</div>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500 }}>& Partners</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map(l => (
              <button key={l.id} className="nav-link" onClick={() => scrollTo(l.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500,
                letterSpacing: 0.3, transition: 'color 0.2s',
              }}>{l.label}</button>
            ))}
            <button className="cta-btn" onClick={() => scrollTo('kontakt')} style={{
              background: C.gold, color: C.navy, border: 'none', cursor: 'pointer',
              padding: '10px 22px', borderRadius: 4, fontSize: 13, fontWeight: 600,
              letterSpacing: 0.5, transition: 'all 0.2s',
            }}>Bezplatná konzultácia</button>
          </div>

          {/* Mobile menu button */}
          <button className="nav-mobile-btn" onClick={() => setMobileOpen(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={mobileOpen ? 'x' : 'menu'} size={24} color={C.white} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mobile-menu" style={{
            background: C.navy, borderTop: `1px solid ${C.goldBorder}`,
            padding: '20px 5%',
          }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 500,
                padding: '12px 0', borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}>{l.label}</button>
            ))}
            <button className="cta-btn" onClick={() => scrollTo('kontakt')} style={{
              display: 'block', width: '100%', marginTop: 16,
              background: C.gold, color: C.navy, border: 'none', cursor: 'pointer',
              padding: '14px 22px', borderRadius: 4, fontSize: 15, fontWeight: 600,
              transition: 'all 0.2s',
            }}>Bezplatná konzultácia</button>
          </div>
        )}
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${C.navy} 0%, #0d1f38 45%, #142840 100%)`,
        display: 'flex', alignItems: 'center',
        padding: '120px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: `radial-gradient(ellipse at 80% 40%, rgba(201,168,76,0.06) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px',
          background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)`,
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
            <div style={{ width: 40, height: 2, background: C.gold }} />
            <span style={{ color: C.gold, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
              Advokátska kancelária · od 2011
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800, color: C.white, lineHeight: 1.15,
            marginBottom: 24, maxWidth: 720,
          }}>
            JUDr. Kováč<br />
            <span style={{ color: C.gold }}>&</span> Partners
          </h1>

          <p className="hero-sub" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: C.textLight, fontWeight: 300, lineHeight: 1.7,
            marginBottom: 16, maxWidth: 560,
          }}>
            Právna istota pre váš biznis aj súkromie
          </p>

          <p style={{
            fontSize: 14, color: 'rgba(232,228,217,0.6)',
            marginBottom: 44, fontWeight: 400, letterSpacing: 0.3,
          }}>
            Advokátska kancelária s 15-ročnou praxou · Bratislava
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="cta-btn" onClick={() => scrollTo('kontakt')} style={{
              background: C.gold, color: C.navy, border: 'none', cursor: 'pointer',
              padding: '16px 36px', borderRadius: 4, fontSize: 15, fontWeight: 700,
              letterSpacing: 0.5, transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              Bezplatná konzultácia
            </button>
            <button className="cta-btn-outline" onClick={() => scrollTo('oblasti')} style={{
              background: 'transparent', color: C.white,
              border: `1.5px solid rgba(255,255,255,0.3)`, cursor: 'pointer',
              padding: '16px 36px', borderRadius: 4, fontSize: 15, fontWeight: 500,
              letterSpacing: 0.5, transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              Oblasti práva
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 32, marginTop: 64, flexWrap: 'wrap' }}>
            {[
              { label: 'Člen SAK', sub: 'Slovenská advokátska komora' },
              { label: 'ISO 27001', sub: 'Ochrana dôverných dát' },
              { label: '100% diskrétnosť', sub: 'Advokátske tajomstvo' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: C.gold, flexShrink: 0,
                }} />
                <div>
                  <div style={{ color: C.white, fontSize: 13, fontWeight: 600 }}>{b.label}</div>
                  <div style={{ color: 'rgba(232,228,217,0.5)', fontSize: 11 }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OBLASTI PRÁVA ───────────────────────────────────────────────────── */}
      <section id="oblasti" style={{ background: C.offWhite, padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: C.gold }} />
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Naše odbornosti</span>
              <div style={{ width: 28, height: 1, background: C.gold }} />
            </div>
            <h2 className="section-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700, color: C.navy, marginBottom: 16,
            }}>Oblasti práva</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Poskytujeme komplexné právne poradenstvo v kľúčových oblastiach práva. Každý prípad riešime individuálne s maximálnym nasadením.
            </p>
          </div>

          <div className="areas-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {practiceAreas.map((area, i) => (
              <div key={i} className="area-card" style={{
                background: C.white, borderRadius: 8,
                padding: '32px 28px', cursor: 'default',
                border: `1px solid ${C.border}`,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div className="area-icon" style={{
                  width: 52, height: 52, borderRadius: 8,
                  background: C.goldDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, transition: 'all 0.3s ease',
                }}>
                  <Icon name={area.icon} size={24} color={C.gold} strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18, fontWeight: 700, color: C.navy,
                  marginBottom: 10,
                }}>{area.title}</h3>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                  {area.desc}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {area.tags.map(tag => (
                    <span key={tag} style={{
                      background: C.goldDim, color: C.gold,
                      fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                      padding: '3px 10px', borderRadius: 20,
                      border: `1px solid ${C.goldBorder}`,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── O KANCELÁRII ─────────────────────────────────────────────────────── */}
      <section id="o-nas" style={{ background: C.navy, padding: '96px 5%', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 400, height: 400,
          background: `radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 28, height: 1, background: C.gold }} />
                <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>O nás</span>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 700, color: C.white, lineHeight: 1.25,
                marginBottom: 24,
              }}>
                Právna excelentnosť<br />
                <span style={{ color: C.gold }}>od roku 2011</span>
              </h2>
              <p style={{ color: 'rgba(232,228,217,0.75)', fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                Advokátska kancelária JUDr. Kováč & Partners bola založená v roku 2011 s jasným cieľom — poskytovať klientom právne poradenstvo na najvyššej odbornej úrovni.
              </p>
              <p style={{ color: 'rgba(232,228,217,0.75)', fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
                Náš tím šiestich advokátov a právnych poradcov spracoval viac ako 2 000 prípadov v oblasti obchodného, pracovného, rodinného a trestného práva. Sme hrdými členmi Slovenskej advokátskej komory.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Člen Slovenskej advokátskej komory (SAK)',
                  'Zapísaní v zozname advokátov SAK od roku 2011',
                  'Špecializácia na obchodné a korporátne právo',
                  'Bezplatná úvodná konzultácia pre každého klienta',
                  'Plná mlčanlivosť a ochrana advokátskeho tajomstva',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: C.goldDim, border: `1px solid ${C.goldBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <Icon name="check" size={11} color={C.gold} strokeWidth={2.5} />
                    </div>
                    <span style={{ color: 'rgba(232,228,217,0.8)', fontSize: 14 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { label: 'Rok založenia', value: '2011', icon: 'scale' },
                { label: 'Právnici v tíme', value: '6', icon: 'users' },
                { label: 'Vyriešených prípadov', value: '2000+', icon: 'briefcase' },
                { label: 'Úspešnosť', value: '95 %', icon: 'shield' },
              ].map((card, i) => (
                <div key={i} style={{
                  background: C.navyMid, borderRadius: 8, padding: '28px 24px',
                  border: `1px solid ${C.goldBorder}`,
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, background: C.goldDim,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}>
                    <Icon name={card.icon} size={22} color={C.gold} strokeWidth={1.5} />
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 26, fontWeight: 800, color: C.gold, marginBottom: 4,
                  }}>{card.value}</div>
                  <div style={{ color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 500 }}>{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TÍM ──────────────────────────────────────────────────────────────── */}
      <section id="tim" style={{ background: C.white, padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: C.gold }} />
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Naši odborníci</span>
              <div style={{ width: 28, height: 1, background: C.gold }} />
            </div>
            <h2 className="section-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700, color: C.navy, marginBottom: 16,
            }}>Náš tím</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Skúsení právnici s hĺbkovou znalosťou slovenského aj európskeho práva.
            </p>
          </div>

          <div className="team-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28,
          }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{
                background: C.white, borderRadius: 10,
                border: `1px solid ${C.border}`,
                overflow: 'hidden', transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                {/* Top colored bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${member.color}, transparent)` }} />

                <div style={{ padding: '36px 28px 28px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: member.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: `0 4px 16px ${member.color}40`,
                  }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: 1,
                    }}>{member.initials}</span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 4,
                  }}>{member.name}</h3>
                  <div style={{ color: member.color, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                    {member.role}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 16 }}>
                    {member.specialization} · {member.exp}
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.7 }}>{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ČÍSLA ────────────────────────────────────────────────────────────── */}
      <section ref={statsRef} style={{
        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
        padding: '72px 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="stats-row" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
          }}>
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} visible={statsVisible} delay={i * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HODNOTENIA ───────────────────────────────────────────────────────── */}
      <section id="hodnotenia" style={{ background: C.offWhite, padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: C.gold }} />
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Čo hovoria klienti</span>
              <div style={{ width: 28, height: 1, background: C.gold }} />
            </div>
            <h2 className="section-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700, color: C.navy, marginBottom: 16,
            }}>Hodnotenia klientov</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
              Dôvera a spokojnosť klientov je základom každého nášho vzťahu.
            </p>
          </div>

          <div className="testimonials-row" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
          }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: C.white, borderRadius: 10, padding: '32px 28px',
                border: `1px solid ${C.border}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}>
                {/* Quote icon */}
                <div style={{ color: C.gold, opacity: 0.5 }}>
                  <Icon name="quote" size={28} color={C.gold} />
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Icon key={si} name="star" size={14} color={C.gold} />
                  ))}
                </div>

                <p style={{ color: C.text, fontSize: 14.5, lineHeight: 1.8, flex: 1 }}>
                  {t.text}
                </p>

                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: C.goldDim, border: `1px solid ${C.goldBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.gold }}>
                      {t.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div style={{ color: C.navy, fontSize: 14, fontWeight: 600 }}>{t.author}</div>
                    <div style={{ color: C.textMuted, fontSize: 12 }}>{t.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KONTAKT ──────────────────────────────────────────────────────────── */}
      <section id="kontakt" style={{ background: C.navy, padding: '96px 5%', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: 1,
          background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)`,
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: C.gold }} />
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Spojte sa s nami</span>
              <div style={{ width: 28, height: 1, background: C.gold }} />
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700, color: C.white, marginBottom: 16,
            }}>Kontaktujte nás</h2>
            <div style={{
              display: 'inline-block',
              background: C.goldDim, border: `1px solid ${C.goldBorder}`,
              borderRadius: 4, padding: '8px 20px',
              color: C.gold, fontSize: 14, fontWeight: 600, marginBottom: 12,
            }}>
              Prvá konzultácia zadarmo
            </div>
          </div>

          <div className="contact-grid" style={{
            display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 56, alignItems: 'start',
          }}>
            {/* Contact info */}
            <div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 28,
              }}>Kontaktné údaje</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { icon: 'map', title: 'Adresa', lines: ['Štúrova 12, 4. poschodie', '811 02 Bratislava'] },
                  { icon: 'phone', title: 'Telefón', lines: ['+421 2 5443 1122', '+421 9XX XXX XXX (mobil)'] },
                  { icon: 'mail', title: 'E-mail', lines: ['office@kovac-partners.sk'] },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, background: C.goldDim,
                      border: `1px solid ${C.goldBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon name={item.icon} size={20} color={C.gold} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                        {item.title}
                      </div>
                      {item.lines.map((line, li) => (
                        <div key={li} style={{ color: 'rgba(232,228,217,0.8)', fontSize: 14, lineHeight: 1.6 }}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 36, padding: '20px 20px',
                background: C.navyMid, borderRadius: 8,
                border: `1px solid ${C.goldBorder}`,
              }}>
                <div style={{ color: C.gold, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Pracovné hodiny</div>
                <div style={{ color: 'rgba(232,228,217,0.7)', fontSize: 13, lineHeight: 1.8 }}>
                  Pondelok – Piatok: 8:00 – 17:30<br />
                  Sobota: 9:00 – 12:00 (po dohode)<br />
                  Nedeľa: Zatvorené
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              {formSent ? (
                <div style={{
                  background: C.navyMid, borderRadius: 10,
                  border: `1px solid ${C.goldBorder}`,
                  padding: '60px 40px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: C.goldDim,
                    border: `2px solid ${C.gold}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <Icon name="check" size={28} color={C.gold} strokeWidth={2.5} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 12,
                  }}>Správa odoslaná</h3>
                  <p style={{ color: 'rgba(232,228,217,0.7)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                    Ďakujeme za váš záujem. Ozveme sa vám do 24 hodín na uvedenej e-mailovej adrese.
                  </p>
                  <button onClick={() => setFormSent(false)} style={{
                    background: 'transparent', border: `1px solid ${C.goldBorder}`,
                    color: C.gold, cursor: 'pointer', padding: '10px 24px',
                    borderRadius: 4, fontSize: 13, fontWeight: 600,
                  }}>Odoslať ďalší dotaz</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{
                  background: C.navyMid, borderRadius: 10,
                  border: `1px solid ${C.goldBorder}`,
                  padding: '36px 36px',
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 24,
                  }}>Napíšte nám</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
                        Meno a priezvisko *
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData(v => ({ ...v, name: e.target.value }))}
                        placeholder="Vaše meno"
                        style={{
                          width: '100%', background: C.navyLight,
                          border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6,
                          color: C.white, fontSize: 14, padding: '11px 14px',
                          transition: 'all 0.2s',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
                        Telefón
                      </label>
                      <input
                        className="form-input"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData(v => ({ ...v, phone: e.target.value }))}
                        placeholder="+421 9XX XXX XXX"
                        style={{
                          width: '100%', background: C.navyLight,
                          border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6,
                          color: C.white, fontSize: 14, padding: '11px 14px',
                          transition: 'all 0.2s',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
                      E-mailová adresa *
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(v => ({ ...v, email: e.target.value }))}
                      placeholder="vas@email.sk"
                      style={{
                        width: '100%', background: C.navyLight,
                        border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6,
                        color: C.white, fontSize: 14, padding: '11px 14px',
                        transition: 'all 0.2s',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
                      Oblasť práva
                    </label>
                    <select
                      className="form-input"
                      value={formData.area}
                      onChange={e => setFormData(v => ({ ...v, area: e.target.value }))}
                      style={{
                        width: '100%', background: C.navyLight,
                        border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6,
                        color: formData.area ? C.white : 'rgba(255,255,255,0.4)',
                        fontSize: 14, padding: '11px 14px',
                        transition: 'all 0.2s', appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">-- Vyberte oblasť práva --</option>
                      <option value="obchodne">Obchodné právo</option>
                      <option value="pracovne">Pracovné právo</option>
                      <option value="nehnutelnosti">Nehnuteľnosti</option>
                      <option value="rodinne">Rodinné právo</option>
                      <option value="trestne">Trestné právo</option>
                      <option value="pohladavky">Vymáhanie pohľadávok</option>
                      <option value="ine">Iné</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', color: 'rgba(232,228,217,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
                      Váš dotaz *
                    </label>
                    <textarea
                      className="form-input"
                      required
                      value={formData.message}
                      onChange={e => setFormData(v => ({ ...v, message: e.target.value }))}
                      placeholder="Stručne popíšte vašu situáciu..."
                      rows={4}
                      style={{
                        width: '100%', background: C.navyLight,
                        border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6,
                        color: C.white, fontSize: 14, padding: '11px 14px',
                        transition: 'all 0.2s', resize: 'vertical',
                        minHeight: 100, fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{
                    width: '100%', background: C.gold, color: C.navy,
                    border: 'none', cursor: 'pointer',
                    padding: '15px 24px', borderRadius: 6,
                    fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
                    transition: 'all 0.2s',
                  }}>
                    Odoslať dopyt
                  </button>

                  <p style={{ color: 'rgba(232,228,217,0.35)', fontSize: 11, marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
                    Vaše údaje sú chránené advokátskym tajomstvom. Odpovieme do 24 hodín.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#080f1a', padding: '64px 5% 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="footer-grid" style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48,
            marginBottom: 48, paddingBottom: 48,
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 4,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="scale" size={18} color={C.navy} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.white }}>
                    JUDr. Kováč & Partners
                  </div>
                  <div style={{ fontSize: 10, color: C.gold, letterSpacing: 1.5, textTransform: 'uppercase' }}>Advokátska kancelária</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 260, marginBottom: 20 }}>
                Poskytujeme komplexné právne poradenstvo pre fyzické a právnické osoby od roku 2011.
              </p>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                Člen Slovenskej advokátskej komory
              </div>
            </div>

            {/* Practice areas */}
            <div>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
                Oblasti práva
              </div>
              {practiceAreas.map(a => (
                <div key={a.title} style={{ marginBottom: 10 }}>
                  <button className="footer-link" onClick={() => scrollTo('oblasti')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 400,
                    padding: 0, transition: 'color 0.2s', textAlign: 'left',
                  }}>{a.title}</button>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
                Navigácia
              </div>
              {[
                { label: 'O kancelárii', id: 'o-nas' },
                { label: 'Náš tím', id: 'tim' },
                { label: 'Hodnotenia', id: 'hodnotenia' },
                { label: 'Kontakt', id: 'kontakt' },
              ].map(l => (
                <div key={l.id} style={{ marginBottom: 10 }}>
                  <button className="footer-link" onClick={() => scrollTo(l.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 400,
                    padding: 0, transition: 'color 0.2s',
                  }}>{l.label}</button>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>
                Kontakt
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: 'map', text: 'Štúrova 12, 811 02 Bratislava' },
                  { icon: 'phone', text: '+421 2 XXXX XXXX' },
                  { icon: 'mail', text: 'office@kovac-partners.sk' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon name={c.icon} size={14} color={C.gold} strokeWidth={1.5} />
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.5 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
              © 2026 JUDr. Kováč & Partners, s.r.o. · Všetky práva vyhradené
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Ochrana osobných údajov</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Podmienky použitia</span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>Web by{' '}
                <span style={{ color: 'rgba(201,168,76,0.45)' }}>Vassweb</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── STAT ITEM COMPONENT ──────────────────────────────────────────────────────
function StatItem({ stat, visible, delay }: { stat: { value: number; suffix: string; label: string }; visible: boolean; delay: number }) {
  const [started, setStarted] = useState(false);
  const count = useCountUp(stat.value, 1800, started);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [visible, delay]);

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
        fontWeight: 800, color: C.navy, lineHeight: 1,
        marginBottom: 8,
      }}>
        {count}{stat.suffix}
      </div>
      <div style={{
        color: C.navy, fontSize: 14, fontWeight: 600,
        opacity: 0.65, textTransform: 'uppercase', letterSpacing: 1,
      }}>{stat.label}</div>
    </div>
  );
}
