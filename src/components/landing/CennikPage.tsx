'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PricingTier from './PricingTier';
import FAQItem from './FAQItem';
import { pricingContent, type Locale } from '@/lib/landingContent';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

const goldGradient = {
  background: 'linear-gradient(90deg, #ffeebb 0%, #d4a843 50%, #8a6a1e 100%)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
};

export default function CennikPage({ locale }: { locale: Locale }) {
  const t = pricingContent[locale];
  const homeHref = locale === 'sk' ? '/' : `/${locale}`;

  return (
    <main style={{ backgroundColor: '#0a0908', color: '#fff', minHeight: '100vh', paddingTop: 80 }}>
      {/* Breadcrumbs */}
      <nav
        aria-label="breadcrumb"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: body,
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        <Link href={homeHref} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          {t.breadcrumbHome}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: '#d4a843' }}>{t.breadcrumbCurrent}</span>
      </nav>

      {/* Hero */}
      <section style={{ padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: body,
              fontSize: 11,
              color: '#d4a843',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {t.hero.kicker}
          </div>
          <h1
            style={{
              fontFamily: heading,
              fontWeight: 400,
              fontSize: 'clamp(36px, 6vw, 64px)',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {t.hero.h1Main}
            <br />
            <span style={goldGradient}>{t.hero.h1Highlight}</span>
          </h1>
          <p
            style={{
              fontFamily: body,
              fontSize: 18,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              maxWidth: 700,
              margin: '0 auto 16px',
            }}
          >
            {t.hero.sub}
          </p>
          <p style={{ fontFamily: body, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            {t.hero.vatNote}
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {t.tiers.map((tier) => (
            <PricingTier key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section style={{ padding: '60px 24px', backgroundColor: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: heading,
              fontWeight: 400,
              fontSize: 'clamp(28px, 4vw, 40px)',
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            {t.addonsLabel}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {t.addons.map((a) => (
              <div
                key={a.name}
                style={{
                  padding: '24px 20px',
                  borderRadius: 14,
                  border: '1px solid rgba(212,168,67,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <h3 style={{ fontFamily: heading, fontSize: 18, fontWeight: 500, color: '#fff' }}>
                    {a.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: body,
                      fontSize: 13,
                      color: '#d4a843',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.price}
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: body,
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 13,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: heading,
              fontWeight: 400,
              fontSize: 'clamp(28px, 4vw, 40px)',
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            {t.faqLabel}
          </h2>
          {t.faqs.map((f, i) => (
            <FAQItem key={i} item={f} index={i} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, rgba(212,168,67,0.05), rgba(10,9,8,0))',
          borderTop: '1px solid rgba(212,168,67,0.12)',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: heading,
              fontWeight: 400,
              fontSize: 'clamp(28px, 4vw, 44px)',
              marginBottom: 16,
            }}
          >
            {t.ctaLabel}
          </h2>
          <p
            style={{
              fontFamily: body,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 17,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            {t.ctaSub}
          </p>
          <Link
            href={locale === 'sk' ? '/vyber-si-web' : `/${locale}/vyber-si-web`}
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              borderRadius: 12,
              background: 'linear-gradient(90deg,#d4a843,#8a6a1e)',
              color: '#0a0908',
              fontFamily: body,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.02em',
              textDecoration: 'none',
            }}
          >
            {t.ctaBtn}
          </Link>
        </div>
      </section>
    </main>
  );
}
