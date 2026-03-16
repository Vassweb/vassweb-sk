'use client';

import { useState } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

function Hero() {
  const { t } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '80px 24px',
      background: `radial-gradient(ellipse at 50% 0%, ${t.accent}18 0%, ${t.bg} 70%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.accent}12, transparent 70%)`,
      }} />
      <div style={{
        display: 'inline-block', padding: '6px 20px', borderRadius: 999,
        border: `1px solid ${t.border}`, marginBottom: 24,
        fontSize: 13, color: t.textMuted, letterSpacing: '0.1em', fontFamily: font,
        textTransform: 'uppercase',
      }}>
        Stavebna firma od 2009
      </div>
      <h1 style={{
        fontSize: 'clamp(48px, 10vw, 96px)', fontWeight: 800, color: t.text,
        fontFamily: font, margin: '0 0 16px', lineHeight: 1,
        letterSpacing: '-0.03em',
      }}>
        Build<span style={{ color: t.accent }}>Pro</span>
      </h1>
      <p style={{
        fontSize: 'clamp(18px, 3vw, 26px)', color: t.textMuted, maxWidth: 560,
        fontFamily: font, margin: '0 0 48px', lineHeight: 1.5, fontWeight: 300,
      }}>
        Stavby, ktore vydrzia generacie
      </p>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: '18px 48px', fontSize: 16, fontWeight: 700, fontFamily: font,
          background: hover ? t.accentLight : t.accent,
          color: t.isLight ? '#ffffff' : '#000000',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          boxShadow: `0 8px 32px ${t.accent}40`,
          transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        Bezplatna konzultacia
      </button>
      <style>{`
        @keyframes buildFadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  );
}

const serviceData = [
  { title: 'Novostavby', desc: 'Komplexna vystavba rodinnych domov a bytovych jednotiek na kluc.', icon: 'M3 21V9l9-7 9 7v12H3z M9 21v-6h6v6' },
  { title: 'Rekonstrukcie', desc: 'Modernizacia starsich budov s dorazom na kvalitu a detail.', icon: 'M12 2L2 7v15h20V7L12 2z M8 12h8 M8 16h8 M8 8h8' },
  { title: 'Interiery', desc: 'Navrh a realizacia interierov od podlahy po strop.', icon: 'M4 4h16v16H4z M4 12h16 M12 4v16' },
  { title: 'Strechy', desc: 'Pokryvacske prace, opravy a kompletne vymeny striech.', icon: 'M2 20L12 4l10 16H2z M7 20v-6h4v6 M13 14h4' },
  { title: 'Zateplenie', desc: 'Tepelna izolacia fasad pre energeticku ucinnost budov.', icon: 'M4 2v20h16V2H4z M4 7h16 M4 13h16 M9 7v6 M15 13v9' },
  { title: 'Projekty', desc: 'Architektonicke a stavebne projekty od navrhu po realizaciu.', icon: 'M14 2H6v20h12V6l-4-4z M14 2v4h4 M8 13h8 M8 17h5' },
];

function Services() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: t.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: t.text,
          fontFamily: font, margin: '0 0 12px', letterSpacing: '-0.02em',
        }}>
          Nase <span style={{ color: t.accent }}>sluzby</span>
        </h2>
        <p style={{ fontSize: 16, color: t.textMuted, fontFamily: font, margin: '0 0 56px', maxWidth: 500 }}>
          Ponukame kompletny rozsah stavebnych sluzieb pre vasich klientov.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {serviceData.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: t.bgCard, borderRadius: 10, padding: 32,
                borderLeft: `4px solid ${hovered === i ? t.accent : t.border}`,
                transition: 'all 0.35s ease',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 12px 40px ${t.accent}15` : 'none',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginBottom: 20 }}>
                <path d={s.icon} />
              </svg>
              <h3 style={{
                fontSize: 20, fontWeight: 700, color: t.text, fontFamily: font,
                margin: '0 0 10px',
              }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: t.textMuted, fontFamily: font, margin: 0, lineHeight: 1.7 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const statsData = [
  { num: '15+', label: 'Rokov skusenosti' },
  { num: '200+', label: 'Dokoncenych projektov' },
  { num: '50+', label: 'Zamestnancov' },
  { num: '98%', label: 'Spokojnost klientov' },
];

function Stats() {
  const { t } = useTheme();
  return (
    <section style={{
      padding: 'clamp(60px,10vw,100px) 24px',
      background: `linear-gradient(135deg, ${t.accent}10, ${t.bgCard})`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 40, textAlign: 'center',
      }}>
        {statsData.map((s, i) => (
          <div key={i}>
            <div style={{
              fontSize: 'clamp(40px, 7vw, 64px)', fontWeight: 900, color: t.accent,
              fontFamily: font, lineHeight: 1, marginBottom: 8,
            }}>{s.num}</div>
            <div style={{
              fontSize: 15, color: t.textMuted, fontFamily: font,
              textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const projectsData = [
  { name: 'Vila Harmonia', cat: 'Novostavba', year: '2024', g1: '#f97316', g2: '#ea580c' },
  { name: 'Bytovy dom Centrum', cat: 'Rekonstrukcia', year: '2023', g1: '#06b6d4', g2: '#0891b2' },
  { name: 'Kancelarie Prestige', cat: 'Interiery', year: '2024', g1: '#8b5cf6', g2: '#7c3aed' },
  { name: 'Rodinny dom Zeleny Vrch', cat: 'Novostavba', year: '2023', g1: '#10b981', g2: '#059669' },
  { name: 'Historicka budova Staromestska', cat: 'Rekonstrukcia', year: '2022', g1: '#f43f5e', g2: '#e11d48' },
  { name: 'Penthouse Panorama', cat: 'Interiery', year: '2024', g1: '#eab308', g2: '#ca8a04' },
];

function Projects() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: t.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: t.text,
          fontFamily: font, margin: '0 0 12px', letterSpacing: '-0.02em',
        }}>
          Nase <span style={{ color: t.accent }}>projekty</span>
        </h2>
        <p style={{ fontSize: 16, color: t.textMuted, fontFamily: font, margin: '0 0 56px', maxWidth: 500 }}>
          Vyber z nasich najlepsich realizacii za posledne roky.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {projectsData.map((p, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 10, overflow: 'hidden',
                background: t.bgCard, border: `1px solid ${t.border}`,
                transition: 'all 0.35s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 16px 48px ${t.accent}12` : 'none',
              }}
            >
              <div style={{
                height: 200, background: `linear-gradient(135deg, ${p.g1}, ${p.g2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, fontFamily: font, margin: 0 }}>
                    {p.name}
                  </h3>
                  <span style={{ fontSize: 13, color: t.textMuted, fontFamily: font }}>{p.year}</span>
                </div>
                <span style={{
                  display: 'inline-block', fontSize: 12, color: t.accent,
                  padding: '3px 10px', borderRadius: 999,
                  background: `${t.accent}15`, fontFamily: font, fontWeight: 500,
                }}>{p.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const teamData = [
  { initials: 'JN', name: 'Jan Novak', role: 'Generálny riaditel', bio: 'Viac ako 20 rokov skusenosti v stavebnom priemysle. Vedie firmu s dorazom na kvalitu a inovacie.' },
  { initials: 'MK', name: 'Maria Kovacova', role: 'Hlavna architektka', bio: 'Autorka desiatok architektonickych navrhov. Specializuje sa na moderne rodinne domy.' },
  { initials: 'PH', name: 'Peter Horvath', role: 'Stavbyveduci', bio: 'Zodpovedny za realizaciu projektov v terene. Garantuje dodrzanie terminov a rozpoctov.' },
];

function Team() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{
      padding: 'clamp(60px,10vw,120px) 24px',
      background: t.bgCard,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: t.text,
          fontFamily: font, margin: '0 0 12px', letterSpacing: '-0.02em', textAlign: 'center',
        }}>
          Nas <span style={{ color: t.accent }}>tim</span>
        </h2>
        <p style={{
          fontSize: 16, color: t.textMuted, fontFamily: font, margin: '0 auto 56px',
          maxWidth: 500, textAlign: 'center',
        }}>
          Profesionali, ktori stoja za kazdym uspesnym projektom.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {teamData.map((m, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: t.bg, borderRadius: 12, padding: 36, textAlign: 'center',
                border: `2px solid ${hovered === i ? t.accent : t.border}`,
                transition: 'all 0.35s ease',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, color: t.isLight ? '#ffffff' : '#000000',
                fontFamily: font,
              }}>
                {m.initials}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: t.text, fontFamily: font, margin: '0 0 4px' }}>
                {m.name}
              </h3>
              <div style={{
                fontSize: 13, color: t.accent, fontFamily: font, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16,
              }}>
                {m.role}
              </div>
              <p style={{ fontSize: 14, color: t.textMuted, fontFamily: font, margin: 0, lineHeight: 1.7 }}>
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useTheme();
  const [focused, setFocused] = useState<string | null>(null);
  const [btnHover, setBtnHover] = useState(false);

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', padding: '14px 16px', fontSize: 15, fontFamily: font,
    background: t.bgCard, color: t.text,
    border: `2px solid ${focused === name ? t.accent : t.border}`,
    borderRadius: 8, outline: 'none', transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  });

  const contactItems = [
    { label: 'Adresa', value: 'Stavbarska 42, 831 04 Bratislava', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' },
    { label: 'Telefon', value: '+421 2 1234 5678', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
    { label: 'Email', value: 'info@buildpro.sk', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  ];

  return (
    <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: t.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: t.text,
          fontFamily: font, margin: '0 0 12px', letterSpacing: '-0.02em',
        }}>
          Kontaktujte <span style={{ color: t.accent }}>nas</span>
        </h2>
        <p style={{ fontSize: 16, color: t.textMuted, fontFamily: font, margin: '0 0 56px', maxWidth: 500 }}>
          Mate otazku alebo chcete bezplatnu konzultaciu? Napisite nam.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input
              placeholder="Meno a priezvisko"
              style={inputStyle('name')}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
            <input
              placeholder="Email"
              type="email"
              style={inputStyle('email')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
            <input
              placeholder="Telefon"
              type="tel"
              style={inputStyle('phone')}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
            <textarea
              placeholder="Vasa sprava..."
              rows={5}
              style={{ ...inputStyle('msg'), resize: 'vertical' }}
              onFocus={() => setFocused('msg')}
              onBlur={() => setFocused(null)}
            />
            <button
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                padding: '16px 40px', fontSize: 15, fontWeight: 700, fontFamily: font,
                background: btnHover ? t.accentLight : t.accent,
                color: t.isLight ? '#ffffff' : '#000000',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                transition: 'all 0.3s ease', alignSelf: 'flex-start',
              }}
            >
              Odoslat spravu
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 8 }}>
            {contactItems.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                  background: `${t.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontSize: 12, color: t.textMuted, fontFamily: font,
                    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4,
                  }}>{c.label}</div>
                  <div style={{ fontSize: 16, color: t.text, fontFamily: font, fontWeight: 500 }}>
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              marginTop: 16, padding: 24, borderRadius: 10,
              background: `${t.accent}08`, border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: 14, color: t.text, fontFamily: font, fontWeight: 600, marginBottom: 8 }}>
                Otvaracie hodiny
              </div>
              <div style={{ fontSize: 14, color: t.textMuted, fontFamily: font, lineHeight: 1.8 }}>
                Pondelok - Piatok: 8:00 - 17:00<br />
                Sobota: 9:00 - 12:00<br />
                Nedela: Zatvorene
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageContent() {
  const { t } = useTheme();
  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: font, minHeight: '100vh' }}>
      <Hero />
      <Services />
      <Stats />
      <Projects />
      <Team />
      <Contact />
    </div>
  );
}

export default function Page() {
  return (
    <DemoProvider>
      <ThemeSwitcher />
      <PageContent />
      <PoweredByVassweb />
    </DemoProvider>
  );
}