'use client';

import { useState } from 'react';

const TEAL = '#0891b2';
const TEAL_DARK = '#0e7490';
const TEAL_LIGHT = '#e0f2fe';
const DARK = '#0f172a';
const GRAY = '#f8fafb';
const BORDER = '#e2e8f0';
const TEXT_MUTED = '#64748b';

export default function DentKlinika() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const chatMessages = [
    { from: 'bot', text: 'Dobrý deň! Som AI asistent DentCare Kliniky. Ako vám môžem pomôcť?' },
    { from: 'user', text: 'Chcel by som sa objednať na prehliadku.' },
    { from: 'bot', text: 'Rád vám pomôžem s objednaním. Aký typ ošetrenia vás zaujíma? (Preventívna prehliadka, bielenie, implantáty, iné?)' },
    { from: 'user', text: 'Preventívna prehliadka.' },
    { from: 'bot', text: 'Výborne! Najbližší voľný termín je v utorok 14.4.2026 o 9:00. Vyhovuje vám? Ak áno, potrebujem vaše meno a telefón.' },
    { from: 'user', text: 'Áno, vyhovuje.' },
    { from: 'bot', text: 'Perfekt! Zavolajte nám na +421 2 XXXX XXXX alebo vypíšte formulár nižšie a potvrdzujeme termín do 1 hodiny.' },
  ];

  const visibleMessages = chatMessages.slice(0, chatStep + 1);

  const services = [
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Preventívna prehliadka', desc: 'Komplexné vyšetrenie chrupu a ďasien každých 6 mesiacov' },
    { icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z', label: 'Bielenie zubov', desc: 'Profesionálne bielenie s dlhodobým výsledkom až o 8 odtieňov' },
    { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', label: 'Implantáty', desc: 'Titánové implantáty s 10-ročnou zárukou, prirodzený výsledok' },
    { icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Ortodoncia', desc: 'Fixné aj snímateľné strojčeky, vrátane neviditeľných Invisalign' },
    { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Detská stomatológia', desc: 'Šetrný prístup k deťom od 2 rokov, bez stresu a bolesti' },
    { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', label: 'Chirurgia', desc: 'Extrakcie, rezy, chirurgická liečba ďasien pod anestézou' },
    { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Estetická stomatológia', desc: 'Fazety, korunky, kompozitné náhrady pre dokonalý úsmev' },
    { icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z', label: 'Protetika', desc: 'Mostíky, náhrady, protézy — funkčné aj estetické riešenia' },
  ];

  const team = [
    { initials: '—', name: 'Primár kliniky', specialty: 'Implantológia', years: 18 },
    { initials: '—', name: 'Zubná lekárka', specialty: 'Estetická stomatológia', years: 12 },
    { initials: '—', name: 'Zubná lekárka', specialty: 'Ortodoncia, Detská stomatológia', years: 9 },
    { initials: '—', name: 'Zubný lekár', specialty: 'Chirurgia, Protetika', years: 14 },
  ];

  const technologies = [
    { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: '3D Skener iTero', desc: 'Presné digitálne odtlačky bez nepríjemnej hmoty. Výsledok okamžite na obrazovke.' },
    { icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18', title: 'Digitálny RTG', desc: 'Röntgen s 90% nižšou radiáciou oproti klasickému. Okamžitý výsledok.' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Laserová liečba', desc: 'Bezbolestná liečba ďasien a kazov laserom. Bez rezov, rýchlejšie hojenie.' },
    { icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'CAD/CAM systém', desc: 'Korunky a fazety vyrobené na miesto počas jednej návštevy.' },
  ];

  const blogPosts = [
    {
      date: '2 apr 2026',
      tag: 'Prevencia',
      title: '5 návykov pre zdravé zuby, ktoré vám zubár nikdy nepovie',
      excerpt: 'Správna technika čistenia, medzizubné kefky a správna strava môžu ušetriť tisíce eur na ošetreniach. Prečítajte si, čo odporúčajú naši odborníci.',
      readTime: '4 min',
    },
    {
      date: '25 mar 2026',
      tag: 'Implantáty',
      title: 'Implantát vs. mostík: čo si vybrať a prečo záleží na veku',
      excerpt: 'Oba riešenia majú svoje miesto. Vysvetlíme vám rozdiely, ceny, trvácnosť a kedy je každé z nich tou správnou voľbou pre váš chrup.',
      readTime: '6 min',
    },
    {
      date: '15 mar 2026',
      tag: 'Estetika',
      title: 'Bielenie zubov doma vs. v klinike — čo hovorí veda',
      excerpt: 'Páskové bielenie a domáce gély sú populárne, ale sú bezpečné? Porovnáme efektivitu, riziká a výsledky s profesionálnym ošetrením.',
      readTime: '5 min',
    },
  ];

  const prices = [
    { service: 'Preventívna prehliadka', price: 'od 35 €' },
    { service: 'Profesionálne čistenie (hygiena)', price: 'od 60 €' },
    { service: 'Plomba (kompozit)', price: 'od 80 €' },
    { service: 'Bielenie zubov (klinika)', price: 'od 280 €' },
    { service: 'Keramická korunka', price: 'od 450 €' },
    { service: 'Zubný implantát', price: 'od 850 €' },
    { service: 'Neviditeľné strojčeky (Invisalign)', price: 'od 1 800 €' },
    { service: 'Keramická fazeta', price: 'od 380 €' },
  ];

  const reviews = [
    { initials: '★', name: 'Spokojný pacient', rating: 5, text: 'Priestor pre recenziu — pacienti môžu zdielať svoju pozitívnu skúsenosť s profesionálnym prístupom a kvalitou ošetrenia.', date: 'nedávno' },
    { initials: '★', name: 'Spokojný pacient', rating: 5, text: 'Priestor pre druhú recenziu — napríklad ohľadom implantátu, jasného vysvetlenia procesu a kľudnej atmosféry počas ošetrenia.', date: 'nedávno' },
    { initials: '★', name: 'Spokojná rodina', rating: 5, text: 'Priestor pre tretiu recenziu — napríklad od rodiny s deťmi, ktoré chodia pravidelne. Prístup k deťom, atmosféra, výsledky.', date: 'nedávno' },
    { initials: '★', name: 'Spokojný pacient', rating: 4, text: 'Priestor pre štvrtú recenziu — napríklad ohľadom bielenia zubov, výsledku a pomeru ceny a kvality.', date: 'nedávno' },
  ];

  const navLinks = ['Služby', 'Tím', 'Technológie', 'Blog', 'Cenník', 'Hodnotenia', 'Kontakt'];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: DARK, background: '#fff', lineHeight: 1.6 }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${BORDER}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>DentCare <span style={{ color: TEAL }}>Klinika</span></span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: TEXT_MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}>
                {link}
              </a>
            ))}
            <a href="#kontakt" style={{ background: TEAL, color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = TEAL_DARK)}
              onMouseLeave={e => (e.currentTarget.style.background = TEAL)}>
              Objednať sa
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafb 100%)`, padding: '80px 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(8,145,178,0.1)', color: TEAL, borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 20, border: `1px solid rgba(8,145,178,0.2)` }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Certifikovaná stomatologická klinika
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
              Váš úsmev<br />
              <span style={{ color: TEAL }}>v bezpečných rukách</span>
            </h1>
            <p style={{ fontSize: 18, color: TEXT_MUTED, marginBottom: 36, maxWidth: 480, lineHeight: 1.7 }}>
              Moderná stomatologická klinika s dôrazom na bezbolestnú liečbu, najnovšie technológie a individuálny prístup ku každému pacientovi.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
              <a href="#kontakt" style={{ background: TEAL, color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = TEAL_DARK; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.transform = 'none'; }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Objednať sa online
              </a>
              <a href="tel:+421244445555" style={{ background: '#fff', color: DARK, padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${BORDER}` }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +421 2 XXXX XXXX
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['15+', 'rokov skúseností'], ['10 000+', 'spokojných pacientov'], ['4', 'špecialisti'], ['98%', 'odporúčaní']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: TEAL, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 20px 60px rgba(8,145,178,0.15)', border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Rýchle objednanie</div>
                  <div style={{ color: TEXT_MUTED, fontSize: 13 }}>Potvrdzujeme do 1 hodiny</div>
                </div>
              </div>
              {[['Preventívna prehliadka', '35 €'], ['Profesionálne čistenie', '60 €'], ['Konzultácia zadarmo', '0 €']].map(([s, p]) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, color: DARK }}>{s}</span>
                  <span style={{ fontWeight: 700, color: TEAL, fontSize: 14 }}>{p}</span>
                </div>
              ))}
              <a href="#kontakt" style={{ display: 'block', background: TEAL, color: '#fff', textAlign: 'center', padding: '14px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', marginTop: 20, fontSize: 15 }}>
                Rezervovať termín
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: DARK, padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            ['Bezbolestná liečba', 'M9 12l2 2 4-4'],
            ['Pohotovostné termíny', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
            ['Bezúročné splátky', 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'],
            ['Parkovanie zadarmo', 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'],
          ].map(([label, path]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
              <svg width="16" height="16" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="služby" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Naše služby</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>Kompletná starostlivosť<br />o váš chrup</h2>
            <p style={{ color: TEXT_MUTED, maxWidth: 520, margin: '0 auto', fontSize: 16 }}>Od preventívnej prehliadky až po komplexnú estetickú rekonštrukciu — všetko pod jednou strechou.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {services.map((s) => (
              <div key={s.label} style={{ padding: 28, borderRadius: 16, border: `1.5px solid ${BORDER}`, background: '#fff', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 8px 32px rgba(8,145,178,0.12)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="24" height="24" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.label}</h3>
                <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="tím" style={{ padding: '88px 24px', background: GRAY }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Náš tím</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>Skúsení odborníci<br />pre váš úsmev</h2>
            <p style={{ color: TEXT_MUTED, maxWidth: 480, margin: '0 auto', fontSize: 16 }}>Každý člen nášho tímu pravidelne absolvuje medzinárodné školenia a konferencie.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {team.map((doc) => (
              <div key={doc.initials} style={{ background: '#fff', borderRadius: 20, padding: '36px 28px', textAlign: 'center', border: `1px solid ${BORDER}`, transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(8,145,178,0.12)`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '0.5px' }}>
                  {doc.initials}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{doc.name}</div>
                <div style={{ color: TEAL, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{doc.specialty}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: TEAL_LIGHT, color: TEAL, borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>
                  {doc.years} rokov praxe
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section id="technológie" style={{ padding: '88px 24px', background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Technológie</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, color: '#fff' }}>Špičkové vybavenie<br />pre presné výsledky</h2>
            <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto', fontSize: 16 }}>Investujeme do najnovších technológií, aby bola vaša liečba rýchlejšia, presnejšia a pohodlnejšia.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {technologies.map((tech) => (
              <div key={tech.title} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(8,145,178,0.15)'; e.currentTarget.style.borderColor = 'rgba(8,145,178,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(8,145,178,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="24" height="24" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={tech.icon} /></svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#fff' }}>{tech.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65 }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG / CMS */}
      <section id="blog" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Blog &amp; CMS</div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Odborné články<br />od našich lekárov</h2>
              <p style={{ color: TEXT_MUTED, fontSize: 15 }}>Obsah spravovaný cez vlastný CMS — žiadne mesačné poplatky.</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#16a34a', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
              CMS aktívny — 47 článkov
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {blogPosts.map((post) => (
              <article key={post.title} style={{ border: `1.5px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 8px 32px rgba(8,145,178,0.1)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ background: `linear-gradient(135deg, ${TEAL_LIGHT}, #f0fdfa)`, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" fill="none" stroke={TEAL} strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div style={{ padding: '24px 24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ background: TEAL_LIGHT, color: TEAL, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{post.tag}</span>
                    <span style={{ color: TEXT_MUTED, fontSize: 12 }}>{post.date}</span>
                    <span style={{ color: TEXT_MUTED, fontSize: 12, marginLeft: 'auto' }}>{post.readTime} čítania</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4, marginBottom: 10 }}>{post.title}</h3>
                  <p style={{ color: TEXT_MUTED, fontSize: 14, lineHeight: 1.6 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: TEAL, fontWeight: 600, fontSize: 13, marginTop: 16 }}>
                    Čítať viac
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="cenník" style={{ padding: '88px 24px', background: GRAY }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Cenník</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>Transparentné ceny</h2>
            <p style={{ color: TEXT_MUTED, fontSize: 16 }}>Bez skrytých poplatkov. Konečná cena vždy po vyšetrení a konzultácii.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            {prices.map((item, i) => (
              <div key={item.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', background: i % 2 === 0 ? '#fff' : '#fafbfc', borderBottom: i < prices.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{item.service}</span>
                <span style={{ fontWeight: 700, color: TEAL, fontSize: 15 }}>{item.price}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: TEXT_MUTED, fontSize: 13, marginTop: 16 }}>
            * Ceny sú orientačné. Finálna cena závisí od rozsahu ošetrenia. Konzultácia je zadarmo.
          </p>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: TEAL_LIGHT, color: TEAL, borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Bezúročné splátky 0% — rozložte platbu na 12 mesiacov
            </span>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="hodnotenia" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Hodnotenia pacientov</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Čo hovoria naši pacienti</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 20 }}>{s}</span>)}
              <span style={{ fontWeight: 700, fontSize: 18, marginLeft: 8 }}>4.9</span>
              <span style={{ color: TEXT_MUTED, fontSize: 14 }}>(218 hodnotení na Google)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {reviews.map((rev) => (
              <div key={rev.initials} style={{ padding: 28, border: `1.5px solid ${BORDER}`, borderRadius: 16, background: '#fff', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.boxShadow = `0 8px 24px rgba(8,145,178,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    {rev.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{rev.name}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{rev.date}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                    {Array(rev.rating).fill(0).map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                    {Array(5 - rev.rating).fill(0).map((_, i) => <span key={i} style={{ color: '#e2e8f0', fontSize: 14 }}>★</span>)}
                  </div>
                </div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.65, fontStyle: 'italic' }}>"{rev.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  <span style={{ fontSize: 12, color: TEXT_MUTED }}>Google recenzia</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontakt" style={{ padding: '88px 24px', background: GRAY }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: TEAL, fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Kontakt</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px' }}>Objednajte sa k nám</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40 }}>
            {/* Info + Map */}
            <div>
              <div style={{ background: '#fff', borderRadius: 20, padding: 32, marginBottom: 20, border: `1px solid ${BORDER}` }}>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Kontaktné údaje</h3>
                {[
                  ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', 'Adresa', 'Vaša adresa, vaše mesto'],
                  ['M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', 'Telefón', '+421 2 XXXX XXXX'],
                  ['M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 'Email', 'info@dentcare.sk'],
                ].map(([path, label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: TEAL_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" fill="none" stroke={TEAL} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{value}</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20, marginTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Otváracie hodiny</div>
                  {[['Po – Pi', '8:00 – 18:00'], ['Sobota', '9:00 – 13:00'], ['Nedeľa', 'Zatvorené']].map(([day, hours]) => (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                      <span style={{ color: TEXT_MUTED }}>{day}</span>
                      <span style={{ fontWeight: 600 }}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Map placeholder */}
              <div style={{ background: '#e2e8f0', borderRadius: 16, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: `1px solid ${BORDER}` }}>
                <svg width="32" height="32" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                <span style={{ color: TEXT_MUTED, fontSize: 13, fontWeight: 500 }}>Interaktívna mapa (Google Maps)</span>
                <span style={{ color: TEXT_MUTED, fontSize: 12 }}>Vaša adresa, vaše mesto</span>
              </div>
            </div>

            {/* Booking Form */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 36, border: `1px solid ${BORDER}` }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Online objednávka</h3>
              <p style={{ color: TEXT_MUTED, fontSize: 14, marginBottom: 28 }}>Vyplňte formulár — potvrdzujeme termín do 1 hodiny.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['Meno', 'text', 'Vaše meno'], ['Priezvisko', 'text', 'Vaše priezvisko']].map(([label, type, placeholder]) => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: DARK }}>{label}</label>
                    <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => (e.target.style.borderColor = TEAL)}
                      onBlur={e => (e.target.style.borderColor = BORDER)} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: DARK }}>Telefón</label>
                <input type="tel" placeholder="+421 9XX XXX XXX" style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor = TEAL)}
                  onBlur={e => (e.target.style.borderColor = BORDER)} />
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: DARK }}>Typ ošetrenia</label>
                <select style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff', color: DARK }}>
                  <option value="">Vyberte službu...</option>
                  {services.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: DARK }}>Preferovaný dátum</label>
                <input type="date" style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => (e.target.style.borderColor = TEAL)}
                  onBlur={e => (e.target.style.borderColor = BORDER)} />
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: DARK }}>Správa (nepovinné)</label>
                <textarea rows={3} placeholder="Popíšte váš problém alebo otázku..." style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = TEAL)}
                  onBlur={e => (e.target.style.borderColor = BORDER)} />
              </div>
              <button style={{ width: '100%', background: TEAL, color: '#fff', padding: '15px', borderRadius: 10, fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = TEAL_DARK)}
                onMouseLeave={e => (e.currentTarget.style.background = TEAL)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Odoslať objednávku
              </button>
              <p style={{ textAlign: 'center', color: TEXT_MUTED, fontSize: 12, marginTop: 12 }}>
                Vaše údaje sú chránené v súlade s GDPR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: DARK, color: '#94a3b8', padding: '56px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>DentCare Klinika</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>
                Moderná stomatologická klinika s viac ako 15-ročnou tradíciou. Staráme sa o zdravý úsmev celej vašej rodiny.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z'].map((d, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(8,145,178,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Služby</h4>
              {['Preventívna prehliadka', 'Bielenie zubov', 'Implantáty', 'Ortodoncia', 'Detská stomatológia', 'Estetická stomatológia'].map(s => (
                <a key={s} href="#služby" style={{ display: 'block', fontSize: 14, color: '#94a3b8', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>{s}</a>
              ))}
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Klinika</h4>
              {['O nás', 'Náš tím', 'Technológie', 'Blog', 'Cenník', 'Kontakt'].map(s => (
                <a key={s} href="#" style={{ display: 'block', fontSize: 14, color: '#94a3b8', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>{s}</a>
              ))}
            </div>
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Otváracie hodiny</h4>
              {[['Pondelok – Piatok', '8:00 – 18:00'], ['Sobota', '9:00 – 13:00'], ['Nedeľa', 'Zatvorené']].map(([day, hours]) => (
                <div key={day} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{day}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{hours}</div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(8,145,178,0.15)', borderRadius: 10, border: '1px solid rgba(8,145,178,0.3)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 4 }}>POHOTOVOSŤ</div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>+421 2 XXXX XXXX</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>24/7 pre akútne prípady</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13 }}>© 2026 DentCare Klinika. Všetky práva vyhradené.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              Web by
              <a href="https://vassweb.sk" target="_blank" rel="noopener noreferrer" style={{ color: TEAL, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Vassweb
              </a>
              — Business tier
            </div>
          </div>
        </div>
      </footer>

      {/* AI CHATBOT WIDGET */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>
        {chatOpen && (
          <div style={{ width: 340, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: `1px solid ${BORDER}`, marginBottom: 12, overflow: 'hidden', animation: 'slideUp 0.25s ease' }}>
            {/* Chat Header */}
            <div style={{ background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>DentCare AI Asistent</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                  Online — odpovedám ihneď
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '4px 8px', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            {/* Chat Messages */}
            <div style={{ padding: 16, maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visibleMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user' ? TEAL : GRAY,
                    color: msg.from === 'user' ? '#fff' : DARK,
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatStep < chatMessages.length - 1 && (
                <button onClick={() => setChatStep(s => Math.min(s + 1, chatMessages.length - 1))}
                  style={{ alignSelf: 'center', background: TEAL_LIGHT, color: TEAL, border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
                  Pokračovať demo konverzáciu →
                </button>
              )}
            </div>

            {/* Chat Input */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Napíšte správu..." style={{ flex: 1, padding: '10px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = TEAL)}
                onBlur={e => (e.target.style.borderColor = BORDER)} />
              <button style={{ background: TEAL, border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <div style={{ padding: '8px 16px 12px', background: GRAY }}>
              <p style={{ fontSize: 11, color: TEXT_MUTED, textAlign: 'center' }}>
                AI chatbot — 24/7 k dispozícii. Powered by <span style={{ color: TEAL, fontWeight: 600 }}>Vassweb AI</span>
              </p>
            </div>
          </div>
        )}

        {/* Chat Bubble Button */}
        <button onClick={() => setChatOpen(o => !o)}
          style={{ width: 60, height: 60, borderRadius: '50%', background: chatOpen ? TEAL_DARK : TEAL, border: 'none', boxShadow: '0 4px 20px rgba(8,145,178,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s', position: 'relative' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
          {chatOpen ? (
            <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <>
              <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>1</div>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 64px; }
      `}</style>
    </div>
  );
}
