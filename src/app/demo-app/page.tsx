'use client';
import { useState } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

const demos = [
  {
    name: 'Booking System',
    category: 'Rezervačný systém',
    desc: 'Interaktívny rezervačný systém s kalendárom, správou termínov a notifikáciami.',
    href: '/demo-app/booking',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    name: 'CRM Dashboard',
    category: 'CRM systém',
    desc: 'Komplexný CRM dashboard so správou kontaktov, obchodných príležitostí a štatistikami.',
    href: '/demo-app/crm',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'E-shop Admin',
    category: 'Administrácia',
    desc: 'Plnohodnotný admin panel e-shopu so správou produktov, objednávok a skladu.',
    href: '/demo-app/admin',
    gradient: 'linear-gradient(135deg, #a855f7, #6d28d9)',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
];

function PageContent() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: font, minHeight: '100vh' }}>
      <style>{`
        @keyframes appGalleryFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header style={{ textAlign: 'center', padding: '120px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${t.accent}18 0%, transparent 60%)` }} />
        <div style={{ position: 'relative', zIndex: 1, animation: 'appGalleryFadeIn 0.6s ease' }}>
          <div style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 999,
            border: `1px solid ${t.border}`, background: `${t.accent}11`,
            color: t.accent, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
            marginBottom: 24, textTransform: 'uppercase',
          }}>
            Demo Apps
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, margin: '0 0 16px',
            background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em',
          }}>
            Vassweb Demo Aplikácie
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: t.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Interaktívne demo aplikácie s plnou funkcionalitou. Prepínateľné farebné témy.
          </p>
        </div>
      </header>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {demos.map((demo, i) => (
            <a key={i} href={demo.href}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                textDecoration: 'none', color: t.text, background: t.bgCard,
                border: `1px solid ${hovered === i ? t.accent : t.border}`, borderRadius: 20,
                overflow: 'hidden', transition: 'all 0.3s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 20px 50px ${t.accent}20` : 'none',
                animation: `appGalleryFadeIn 0.5s ease ${i * 0.1}s both`,
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{
                height: 160, background: demo.gradient, display: 'flex',
                alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: hovered === i ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)', transition: 'background 0.3s' }} />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
                  <path d={demo.icon} />
                </svg>
              </div>
              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accent, marginBottom: 8 }}>
                  {demo.category}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{demo.name}</h3>
                <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>{demo.desc}</p>
                <span style={{
                  fontSize: 14, fontWeight: 600, color: t.accent,
                  display: 'inline-flex', alignItems: 'center', gap: hovered === i ? 10 : 6, transition: 'gap 0.2s',
                }}>
                  Spustiť demo <span style={{ fontSize: 16 }}>&rarr;</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '48px 24px', borderTop: `1px solid ${t.border}` }}>
        <p style={{ fontSize: 16, color: t.textMuted, marginBottom: 16 }}>Chcete podobnú aplikáciu?</p>
        <a href="https://vassweb.sk/#kontakt" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-block', padding: '12px 32px', fontSize: 14, fontWeight: 700, borderRadius: 999,
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
            color: t.isLight ? '#fff' : '#000', textDecoration: 'none', transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Kontaktujte nás
        </a>
      </section>
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
