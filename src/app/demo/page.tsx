'use client';

import { useState } from 'react';
import { DemoProvider, ThemeSwitcher, PoweredByVassweb, useTheme } from '@/components/DemoTheme';

const font = 'Inter, system-ui, sans-serif';

const demos = [
  {
    name: 'La Cucina',
    category: 'Reštaurácia',
    desc: 'Elegantná webstránka talianskej reštaurácie s online rezerváciami a jedálnym lístkom.',
    href: '/demo/restaurant',
    gradient: 'linear-gradient(135deg, #d4a843, #8a6a1e)',
    icon: '🍝',
  },
  {
    name: 'ModaShop',
    category: 'E-shop',
    desc: 'Moderný e-shop s módou, produktovými kartami a nákupným košíkom.',
    href: '/demo/eshop',
    gradient: 'linear-gradient(135deg, #a855f7, #6d28d9)',
    icon: '👗',
  },
  {
    name: 'BuildPro',
    category: 'Stavebná firma',
    desc: 'Profesionálna prezentácia stavebnej firmy s portfóliom realizácií.',
    href: '/demo/firma',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    icon: '🏗️',
  },
  {
    name: 'Marek Dizajn',
    category: 'Portfólio',
    desc: 'Kreatívne portfólio dizajnéra s galériou prác a kontaktným formulárom.',
    href: '/demo/portfolio',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    icon: '🎨',
  },
  {
    name: 'FitZone',
    category: 'Fitness',
    desc: 'Dynamický web pre fitness štúdio s rozvrhom lekcií a cenníkom.',
    href: '/demo/fitness',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: '💪',
  },
];

function PageContent() {
  const { t } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: font, minHeight: '100vh' }}>
      <style>{`
        @keyframes galleryFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '120px 24px 60px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${t.accent}18 0%, transparent 60%)`,
        }} />
        <div style={{ position: 'relative', zIndex: 1, animation: 'galleryFadeIn 0.6s ease' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            borderRadius: 999,
            border: `1px solid ${t.border}`,
            background: `${t.accent}11`,
            color: t.accent,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            marginBottom: 24,
            textTransform: 'uppercase',
          }}>
            Showcase
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            margin: '0 0 16px',
            background: `linear-gradient(135deg, ${t.text}, ${t.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            Vassweb Demo Galéria
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: t.textMuted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Ukážky webov, ktoré tvoríme. Každý s prepínateľnými farebnými témami.
          </p>
        </div>
      </header>

      {/* Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {demos.map((demo, i) => (
            <a
              key={i}
              href={demo.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textDecoration: 'none',
                color: t.text,
                background: t.bgCard,
                border: `1px solid ${hovered === i ? t.accent : t.border}`,
                borderRadius: 20,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                transform: hovered === i ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === i ? `0 20px 50px ${t.accent}20` : 'none',
                animation: `galleryFadeIn 0.5s ease ${i * 0.08}s both`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Gradient placeholder */}
              <div style={{
                height: 160,
                background: demo.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: hovered === i ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)',
                  transition: 'background 0.3s',
                }} />
                <span style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
                  {demo.icon}
                </span>
              </div>
              {/* Content */}
              <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: t.accent,
                  marginBottom: 8,
                }}>
                  {demo.category}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{demo.name}</h3>
                <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>
                  {demo.desc}
                </p>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: t.accent,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'gap 0.2s',
                  ...(hovered === i ? { gap: 10 } : {}),
                }}>
                  Pozrieť demo <span style={{ fontSize: 16 }}>&rarr;</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{
        textAlign: 'center',
        padding: '48px 24px',
        borderTop: `1px solid ${t.border}`,
      }}>
        <p style={{ fontSize: 16, color: t.textMuted, marginBottom: 16 }}>
          Chcete podobný web?
        </p>
        <a
          href="https://vassweb.sk/#kontakt"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
            color: t.isLight ? '#fff' : '#000',
            textDecoration: 'none',
            transition: 'transform 0.2s',
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
