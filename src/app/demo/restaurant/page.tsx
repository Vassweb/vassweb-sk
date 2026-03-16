'use client';

import { useState, useEffect, useRef, CSSProperties } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, BackToVassweb, useTheme } from '@/components/DemoTheme';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  const ref = useFadeIn();
  return <div ref={ref} style={style}>{children}</div>;
}

const menuData = {
  'Predjedla': [
    { name: 'Bruschetta al Pomodoro', desc: 'Chrumkavý chlieb s paradajkami, bazalkou a olivovym olejom', price: '8,90' },
    { name: 'Carpaccio di Manzo', desc: 'Jemne nakrajane hovadzie s rukolou a parmezanom', price: '12,50' },
    { name: 'Caprese Salat', desc: 'Mozzarella di Bufala s paradajkami a cerstvy bazalkou', price: '9,90' },
  ],
  'Hlavne jedla': [
    { name: 'Risotto ai Funghi Porcini', desc: 'Kremove rizoto s hribikmi a cerstvy parmezanom', price: '16,90' },
    { name: 'Ossobuco alla Milanese', desc: 'Dusene telecacie koleno s gremolata a safranovym rizotom', price: '24,90' },
    { name: 'Spaghetti alle Vongole', desc: 'Spagety s cerstvy muslami, cesnakam a bilym vinom', price: '18,50' },
    { name: 'Pizza Margherita D.O.C.', desc: 'San Marzano paradajky, mozzarella di Bufala, cerstva bazalka', price: '13,90' },
  ],
  'Dezerty': [
    { name: 'Tiramisu Classico', desc: 'Tradicky tiramisu s mascarpone a espressom', price: '8,90' },
    { name: 'Panna Cotta', desc: 'Vanilkova panna cotta s lesnym ovocim', price: '7,50' },
    { name: 'Cannoli Siciliani', desc: 'Krehke trubicky plnene ricottovym kremom', price: '6,90' },
  ],
};

const hours = [
  { day: 'Pondelok - Piatok', time: '11:00 - 22:00' },
  { day: 'Sobota', time: '12:00 - 23:00' },
  { day: 'Nedela', time: '12:00 - 21:00' },
];

function PageContent() {
  const { t } = useTheme();
  const [form, setForm] = useState({ date: '', time: '', guests: '2', name: '', phone: '' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const heading: CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    color: t.text,
    margin: 0,
  };

  const accent: CSSProperties = { color: t.accent };

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', scrollBehavior: 'smooth' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 24px',
        background: `linear-gradient(180deg, ${t.bg} 0%, ${t.bgCard} 100%)`,
        borderBottom: `1px solid ${t.border}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `radial-gradient(${t.accent} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: t.accent, marginBottom: 24, fontWeight: 500 }}>
            Ristorante Italiano
          </div>
          <h1 style={{ ...heading, fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            La Cucina
          </h1>
          <p style={{ fontSize: 'clamp(16px, 3vw, 22px)', color: t.textMuted, marginTop: 20, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
            Autenticka talianska kuchyna
          </p>
          <a href="#rezervacia" style={{
            display: 'inline-block', marginTop: 48, padding: '16px 48px', fontSize: 14, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
            color: t.isLight ? '#fff' : t.bg, background: t.accent, borderRadius: 0,
            border: `2px solid ${t.accent}`, transition: 'all 0.3s',
          }}>
            Rezervovat stol
          </a>
        </div>
      </section>

      {/* Menu */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>Nase menu</p>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)' }}>Menu</h2>
            <div style={{ width: 60, height: 1, background: t.accent, margin: '20px auto 0' }} />
          </div>

          {Object.entries(menuData).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 56 }}>
              <h3 style={{ ...heading, fontSize: 22, ...accent, marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                {category}
              </h3>
              {items.map((item) => {
                const isHovered = hoveredItem === item.name;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16,
                      padding: '18px 0', borderBottom: `1px solid ${t.border}`,
                      transition: 'background 0.2s', cursor: 'default',
                      background: isHovered ? `${t.accent}08` : 'transparent',
                      marginLeft: -12, marginRight: -12, paddingLeft: 12, paddingRight: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ ...heading, fontSize: 17, fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: 14, color: t.textMuted, marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: t.accent, whiteSpace: 'nowrap', fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {item.price} &euro;
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </Section>
      </section>

      {/* About */}
      <section style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
          <Section>
            <p style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>Nas pribeh</p>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 32 }}>Tradicia od roku 1987</h2>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: t.textMuted, maxWidth: 620, margin: '0 auto' }}>
              La Cucina vznikla z lasky k autentickej talianskej kuchyni. Uz viac ako 35 rokov prinasiame
              na vase stoly chute Talianska — od cerstvy domacich cestovin az po dezerty pripravovane
              podla receptov nasich starych mam. Kazdy den vyberame len tie najkvalitnejsie suroviny
              od lokalnych dodavatelov a importujeme speciality priamo z Talianska.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 48, flexWrap: 'wrap' }}>
              {[
                { num: '35+', label: 'Rokov tradicie' },
                { num: '200+', label: 'Receptov' },
                { num: '50k+', label: 'Spokojnych hosti' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: t.accent, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4, letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>Fotogaleria</p>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)' }}>Galeria</h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {['Domace cestovin', 'Cerstva pizza', 'Tiramisu', 'Nas interior', 'Degustacne menu', 'Vinny sklad'].map((label, i) => (
              <div key={label} style={{
                aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden', position: 'relative',
                background: `linear-gradient(${135 + i * 25}deg, ${t.accent}22, ${t.bgCard}, ${t.accent}11)`,
                border: `1px solid ${t.border}`, transition: 'transform 0.4s, box-shadow 0.4s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 12px 40px ${t.accent}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient(to top, ${t.bg}cc, transparent)`,
                }}>
                  <span style={{ fontSize: 14, color: t.textMuted, letterSpacing: '0.08em', fontWeight: 500 }}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Reservations */}
      <section id="rezervacia" style={{ background: t.bgCard, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 24px' }}>
          <Section>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>Rezervacia</p>
              <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)' }}>Rezervujte si stol</h2>
            </div>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Datum', type: 'date', key: 'date' as const },
                  { label: 'Cas', type: 'time', key: 'time' as const },
                  { label: 'Pocet hosti', type: 'number', key: 'guests' as const },
                ].map((f) => (
                  <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 12, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</span>
                    <input
                      type={f.type} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{
                        padding: '14px 16px', fontSize: 15, background: t.bg, color: t.text,
                        border: `1px solid ${t.border}`, borderRadius: 0, outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = t.accent}
                      onBlur={e => e.currentTarget.style.borderColor = t.border}
                    />
                  </label>
                ))}
              </div>
              {[
                { label: 'Meno a priezvisko', type: 'text', key: 'name' as const },
                { label: 'Telefonny cislo', type: 'tel', key: 'phone' as const },
              ].map((f) => (
                <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 12, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</span>
                  <input
                    type={f.type} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      padding: '14px 16px', fontSize: 15, background: t.bg, color: t.text,
                      border: `1px solid ${t.border}`, borderRadius: 0, outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = t.accent}
                    onBlur={e => e.currentTarget.style.borderColor = t.border}
                  />
                </label>
              ))}
              <button type="submit" style={{
                marginTop: 8, padding: '16px 32px', fontSize: 14, fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                color: t.isLight ? '#fff' : t.bg, background: t.accent,
                border: 'none', borderRadius: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Odoslat rezervaciu
              </button>
            </form>
          </Section>
        </div>
      </section>

      {/* Contact */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: t.accent, marginBottom: 12 }}>Kde nas najdete</p>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)' }}>Kontakt</h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 48,
          }}>
            <div>
              <h3 style={{ ...heading, fontSize: 18, marginBottom: 20, color: t.accent }}>Kontaktne udaje</h3>
              {[
                { label: 'Adresa', value: 'Hlavna ulica 42, 811 01 Bratislava' },
                { label: 'Telefon', value: '+421 2 1234 5678' },
                { label: 'E-mail', value: 'rezervacie@lacucina.sk' },
              ].map((c) => (
                <div key={c.label} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 15, color: t.text }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ ...heading, fontSize: 18, marginBottom: 20, color: t.accent }}>Otvaracie hodiny</h3>
              {hours.map((h) => (
                <div key={h.day} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                  borderBottom: `1px solid ${t.border}`, fontSize: 15,
                }}>
                  <span style={{ color: t.text }}>{h.day}</span>
                  <span style={{ color: t.textMuted, fontWeight: 500 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <BackToVassweb />
      <ThemeSwitcher />
      <PageContent />
      <PoweredByVassweb />
    </DemoProvider>
  );
}
