'use client';

import { useState } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, BackToVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

function Hero() {
  const { t } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '80px 24px',
      background: t.bg, position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${t.accent}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 32px',
        border: `2px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 300, color: t.accent, fontFamily: font,
      }}>
        M
      </div>
      <h1 style={{
        fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 200, color: t.text,
        fontFamily: font, margin: '0 0 16px', lineHeight: 1.1,
        letterSpacing: '-0.04em',
      }}>
        Marek <span style={{ fontWeight: 600 }}>Dizajn</span>
      </h1>
      <p style={{
        fontSize: 'clamp(16px, 2.5vw, 20px)', color: t.textMuted, maxWidth: 440,
        fontFamily: font, margin: '0 0 48px', lineHeight: 1.6, fontWeight: 300,
        letterSpacing: '0.02em',
      }}>
        UI/UX dizajner &amp; creative director
      </p>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: '14px 40px', fontSize: 14, fontWeight: 500, fontFamily: font,
          background: 'transparent',
          color: t.text,
          border: `1px solid ${hover ? t.accent : t.border}`,
          borderRadius: 999, cursor: 'pointer',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'all 0.4s ease',
        }}
      >
        Pozriet prace
      </button>
    </section>
  );
}

const projectsData = [
  { name: 'Kavej App', cat: 'Mobile', year: '2024', g1: '#f97316', g2: '#fbbf24' },
  { name: 'NovaBanka', cat: 'Web', year: '2024', g1: '#06b6d4', g2: '#3b82f6' },
  { name: 'Zeleny Trh', cat: 'Branding', year: '2023', g1: '#10b981', g2: '#34d399' },
  { name: 'FitTrack Pro', cat: 'Mobile', year: '2023', g1: '#8b5cf6', g2: '#a78bfa' },
  { name: 'Architekt Studio', cat: 'Web', year: '2024', g1: '#f43f5e', g2: '#fb7185' },
  { name: 'Luxus Hotels', cat: 'Branding', year: '2023', g1: '#eab308', g2: '#fde047' },
];

const categories = ['Vsetky', 'Web', 'Branding', 'Mobile'];

function ProjectsSection() {
  const { t } = useTheme();
  const [filter, setFilter] = useState('Vsetky');
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = filter === 'Vsetky' ? projectsData : projectsData.filter(p => p.cat === filter);

  return (
    <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: t.bg }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 200, color: t.text,
          fontFamily: font, margin: '0 0 40px', letterSpacing: '-0.03em',
          textAlign: 'center',
        }}>
          Vybrane <span style={{ fontWeight: 600 }}>prace</span>
        </h2>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48,
          flexWrap: 'wrap',
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 24px', fontSize: 13, fontFamily: font, fontWeight: 500,
                background: filter === cat ? t.accent : 'transparent',
                color: filter === cat ? (t.isLight ? '#ffffff' : '#000000') : t.textMuted,
                border: `1px solid ${filter === cat ? t.accent : t.border}`,
                borderRadius: 999, cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.04em',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((p, i) => (
            <div
              key={p.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 16, overflow: 'hidden',
                background: t.bgCard, border: `1px solid ${t.border}`,
                transition: 'all 0.4s ease',
                transform: hovered === i ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 20px 60px ${t.accent}10` : 'none',
              }}
            >
              <div style={{
                height: 220, background: `linear-gradient(135deg, ${p.g1}, ${p.g2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: hovered === i ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0)',
                  transition: 'background 0.4s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 600, color: t.text, fontFamily: font, margin: 0,
                  }}>{p.name}</h3>
                  <span style={{ fontSize: 12, color: t.textMuted, fontFamily: font }}>{p.year}</span>
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 10, fontSize: 11, color: t.accent,
                  padding: '3px 12px', borderRadius: 999,
                  background: `${t.accent}10`, fontFamily: font, fontWeight: 500,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{p.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useTheme();
  const skills = [
    { name: 'UI Design', pct: 95 },
    { name: 'Branding', pct: 88 },
    { name: 'Development', pct: 72 },
    { name: 'Motion', pct: 80 },
  ];
  return (
    <section style={{
      padding: 'clamp(60px,10vw,120px) 24px',
      background: t.bgCard,
    }}>
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 64, alignItems: 'center',
      }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(24px,4vw,36px)', fontWeight: 200, color: t.text,
            fontFamily: font, margin: '0 0 24px', letterSpacing: '-0.03em',
          }}>
            O <span style={{ fontWeight: 600 }}>mne</span>
          </h2>
          <p style={{
            fontSize: 15, color: t.textMuted, fontFamily: font, margin: '0 0 16px',
            lineHeight: 1.8,
          }}>
            Som dizajner s 8-rocnou praxou v oblasti digitalneho dizajnu. Specializujem sa
            na tvorbu pouzivatelskych rozhrani, vizualnych identit a mobilnych aplikacii
            pre klientov po celom Slovensku.
          </p>
          <p style={{
            fontSize: 15, color: t.textMuted, fontFamily: font, margin: 0,
            lineHeight: 1.8,
          }}>
            Moja filozofia je jednoducha: kazdy projekt musi byt nielen pekny, ale
            predovsetkym funkcny a pouzitelny. Spolupracujem s firmami od startupov
            az po korporacie.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {skills.map(s => (
            <div key={s.name}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', marginBottom: 8,
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: t.text, fontFamily: font }}>
                  {s.name}
                </span>
                <span style={{ fontSize: 13, color: t.accent, fontFamily: font, fontWeight: 600 }}>
                  {s.pct}%
                </span>
              </div>
              <div style={{
                height: 6, borderRadius: 99, background: t.border, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${s.pct}%`, height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${t.accent}, ${t.accentLight})`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const servicesData = [
  {
    title: 'Web Design',
    desc: 'Navrh modernych a responzivnych webovych stranok. Od wireframov az po finalny dizajn pripraveny na implementaciu.',
    price: 'od 800 €',
    icon: 'M4 4h16v12H4z M2 20h20 M12 16v4',
  },
  {
    title: 'Brand Identity',
    desc: 'Kompletna vizualna identita pre vasu znacku. Logo, typografia, farebna paleta a brandbook.',
    price: 'od 1 200 €',
    icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  },
  {
    title: 'Mobile Apps',
    desc: 'UI/UX dizajn mobilnych aplikacii pre iOS a Android. Prototypovanie a uzivatelske testovanie.',
    price: 'od 1 500 €',
    icon: 'M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z M12 18h.01',
  },
];

function ServicesSection() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: t.bg }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(24px,4vw,36px)', fontWeight: 200, color: t.text,
          fontFamily: font, margin: '0 0 48px', letterSpacing: '-0.03em',
          textAlign: 'center',
        }}>
          Moje <span style={{ fontWeight: 600 }}>sluzby</span>
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {servicesData.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: t.bgCard, borderRadius: 16, padding: 36,
                border: `1px solid ${hovered === i ? t.accent : t.border}`,
                transition: 'all 0.4s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'translateY(0)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke={t.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ marginBottom: 24, opacity: 0.8 }}>
                <path d={s.icon} />
              </svg>
              <h3 style={{
                fontSize: 20, fontWeight: 600, color: t.text, fontFamily: font,
                margin: '0 0 12px',
              }}>{s.title}</h3>
              <p style={{
                fontSize: 14, color: t.textMuted, fontFamily: font, margin: '0 0 24px',
                lineHeight: 1.7, flex: 1,
              }}>{s.desc}</p>
              <div style={{
                fontSize: 22, fontWeight: 600, color: t.accent, fontFamily: font,
                paddingTop: 20, borderTop: `1px solid ${t.border}`,
              }}>{s.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonialsData = [
  {
    quote: 'Marek nam navrhol webstranku, ktora presne vystihuje nasu znacku. Profesionalny pristup a skvely vysledok.',
    name: 'Zuzana Kralova',
    company: 'CEO, TechStart s.r.o.',
  },
  {
    quote: 'Spolupráca bola bezproblemova. Dostal sme logo a kompletnu identitu, ktora prevysila nase ocakavania.',
    name: 'Tomas Benes',
    company: 'Zakladatel, GreenMarket',
  },
  {
    quote: 'Aplikacia, ktoru nam Marek navrhol, zvysila nase konverzie o 40%. Odporucam kazdemu.',
    name: 'Lenka Stefanova',
    company: 'CMO, FitLife App',
  },
];

function Testimonials() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section style={{
      padding: 'clamp(60px,10vw,120px) 24px',
      background: t.bgCard,
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(24px,4vw,36px)', fontWeight: 200, color: t.text,
          fontFamily: font, margin: '0 0 48px', letterSpacing: '-0.03em',
          textAlign: 'center',
        }}>
          Co hovoria <span style={{ fontWeight: 600 }}>klienti</span>
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {testimonialsData.map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: t.bg, borderRadius: 16, padding: 32,
                border: `1px solid ${t.border}`,
                transition: 'all 0.4s ease',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{
                fontSize: 40, color: t.accent, fontFamily: 'Georgia, serif',
                lineHeight: 1, marginBottom: 16, opacity: 0.5,
              }}>&ldquo;</div>
              <p style={{
                fontSize: 15, color: t.textMuted, fontFamily: font,
                margin: '0 0 24px', lineHeight: 1.8, fontStyle: 'italic', flex: 1,
              }}>
                {item.quote}
              </p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                paddingTop: 20, borderTop: `1px solid ${t.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.accent}40, ${t.accentLight}40)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 600, color: t.accent, fontFamily: font,
                }}>
                  {item.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: font }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: t.textMuted, fontFamily: font }}>
                    {item.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t } = useTheme();
  const [emailHover, setEmailHover] = useState(false);

  const socialLinks = [
    { name: 'Dribbble', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z M2.05 12h20 M12 2a14 14 0 014 10 14 14 0 01-4 10 M12 2a14 14 0 00-4 10 14 14 0 004 10' },
    { name: 'Behance', icon: 'M22 7h-7 M15 11.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z M3 3v18h4.5a4.5 4.5 0 000-9 4.5 4.5 0 000-9H3z' },
    { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 2a2 2 0 100 4 2 2 0 000-4z' },
    { name: 'Instagram', icon: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01' },
  ];

  return (
    <section style={{ padding: 'clamp(80px,12vw,160px) 24px', background: t.bg, textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(24px,4vw,36px)', fontWeight: 200, color: t.text,
          fontFamily: font, margin: '0 0 16px', letterSpacing: '-0.03em',
        }}>
          Poďme <span style={{ fontWeight: 600 }}>spolupracovat</span>
        </h2>
        <p style={{
          fontSize: 15, color: t.textMuted, fontFamily: font, margin: '0 0 40px',
          lineHeight: 1.7,
        }}>
          Mate projekt, s ktorym vam mozem pomoct? Napiste mi a dohodneme sa na detailoch.
        </p>
        <a
          href="mailto:marek@dizajn.sk"
          onMouseEnter={() => setEmailHover(true)}
          onMouseLeave={() => setEmailHover(false)}
          style={{
            display: 'inline-block', fontSize: 'clamp(18px,3vw,28px)', fontWeight: 500,
            color: emailHover ? t.accentLight : t.accent, fontFamily: font,
            textDecoration: 'none', transition: 'color 0.3s',
            borderBottom: `1px solid ${emailHover ? t.accentLight : t.accent}`,
            paddingBottom: 4,
          }}
        >
          marek@dizajn.sk
        </a>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48,
        }}>
          {socialLinks.map((s, i) => (
            <SocialButton key={i} icon={s.icon} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialButton({ icon, name }: { icon: string; name: string }) {
  const { t } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <button
      aria-label={name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
        background: hover ? `${t.accent}20` : 'transparent',
        border: `1px solid ${hover ? t.accent : t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={hover ? t.accent : t.textMuted} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'stroke 0.3s' }}>
        <path d={icon} />
      </svg>
    </button>
  );
}

function PageContent() {
  const { t } = useTheme();
  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: font, minHeight: '100vh' }}>
      <Hero />
      <ProjectsSection />
      <About />
      <ServicesSection />
      <Testimonials />
      <ContactSection />
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