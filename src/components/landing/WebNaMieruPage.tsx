'use client';

import { ChevronRight, MessageSquare, Palette, Code, Rocket, Quote } from 'lucide-react';
import Link from 'next/link';
import ProcessStep from './ProcessStep';
import CaseStudyCard from './CaseStudyCard';
import { webContent, type Locale } from '@/lib/landingContent';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

const goldGradient = {
  background: 'linear-gradient(90deg, #ffeebb 0%, #d4a843 50%, #8a6a1e 100%)',
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
};

const processIcons = [MessageSquare, Palette, Code, Rocket];

export default function WebNaMieruPage({ locale }: { locale: Locale }) {
  const t = webContent[locale];
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
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
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
              fontSize: 'clamp(36px, 6vw, 68px)',
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
              maxWidth: 720,
              margin: '0 auto 32px',
            }}
          >
            {t.hero.sub}
          </p>

          {/* Hero stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              maxWidth: 600,
              margin: '0 auto 36px',
            }}
          >
            {t.hero.stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: heading,
                    fontSize: 'clamp(28px, 4vw, 42px)',
                    fontWeight: 400,
                    color: '#d4a843',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: body,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href={t.hero.ctaPrimaryHref}
              style={{
                padding: '14px 28px',
                borderRadius: 12,
                background: 'linear-gradient(90deg,#d4a843,#8a6a1e)',
                color: '#0a0908',
                fontFamily: body,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href={t.hero.ctaSecondaryHref}
              style={{
                padding: '14px 28px',
                borderRadius: 12,
                border: '1px solid rgba(212,168,67,0.45)',
                color: '#d4a843',
                fontFamily: body,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '80px 24px', backgroundColor: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                fontFamily: body,
                fontSize: 11,
                color: '#d4a843',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {t.processLabel}
            </div>
            <h2
              style={{
                fontFamily: heading,
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
              }}
            >
              {t.processHeading}
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {t.process.map((step, i) => (
              <ProcessStep
                key={step.title}
                step={{ ...step, Icon: processIcons[i] ?? Rocket }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                fontFamily: body,
                fontSize: 11,
                color: '#d4a843',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {t.stackLabel}
            </div>
            <h2
              style={{
                fontFamily: heading,
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
                marginBottom: 16,
              }}
            >
              {t.stackHeading}
            </h2>
            <p
              style={{
                fontFamily: body,
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
                lineHeight: 1.6,
                maxWidth: 720,
                margin: '0 auto',
              }}
            >
              {t.stackDesc}
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {t.stack.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: '20px',
                  borderRadius: 12,
                  border: '1px solid rgba(212,168,67,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  style={{
                    fontFamily: heading,
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#d4a843',
                    marginBottom: 8,
                  }}
                >
                  {s.name}
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
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section style={{ padding: '80px 24px', backgroundColor: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                fontFamily: body,
                fontSize: 11,
                color: '#d4a843',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {t.casesLabel}
            </div>
            <h2
              style={{
                fontFamily: heading,
                fontWeight: 400,
                fontSize: 'clamp(28px, 4vw, 44px)',
              }}
            >
              {t.casesHeading}
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {t.cases.map((c) => (
              <CaseStudyCard
                key={c.client}
                cs={{
                  client: c.client,
                  industry: c.industry,
                  challenge: c.challenge,
                  result: c.result,
                  metrics: [...c.metrics],
                  href: c.href,
                  linkLabel: c.linkLabel,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: heading,
              fontWeight: 400,
              fontSize: 'clamp(28px, 4vw, 40px)',
              textAlign: 'center',
              marginBottom: 48,
            }}
          >
            {t.testimonialsLabel}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {t.testimonials.map((tt) => (
              <div
                key={tt.author}
                style={{
                  padding: '28px 24px',
                  borderRadius: 16,
                  border: '1px solid rgba(212,168,67,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.025)',
                }}
              >
                <Quote size={24} color="#d4a843" style={{ marginBottom: 12, opacity: 0.6 }} />
                <p
                  style={{
                    fontFamily: body,
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 15,
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  &ldquo;{tt.quote}&rdquo;
                </p>
                <div style={{ fontFamily: body, fontSize: 14, color: '#fff', fontWeight: 600 }}>
                  {tt.author}
                </div>
                <div
                  style={{
                    fontFamily: body,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tt.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing link */}
      <section style={{ padding: '40px 24px', textAlign: 'center' }}>
        <Link
          href={t.pricingLinkHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#d4a843',
            fontFamily: body,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: 10,
            border: '1px solid rgba(212,168,67,0.3)',
          }}
        >
          {t.pricingLink} <ChevronRight size={16} />
        </Link>
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
            {t.finalCtaLabel}
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
            {t.finalCtaSub}
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
            {t.finalCtaBtn}
          </Link>
        </div>
      </section>
    </main>
  );
}
