'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export interface PricingTierData {
  name: string;
  priceFrom: string;
  priceVat: string;
  tagline: string;
  timeline: string;
  features: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  badge?: string;
}

export default function PricingTier({ tier }: { tier: PricingTierData }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '32px 28px',
        borderRadius: 20,
        border: tier.featured
          ? '1px solid rgba(212,168,67,0.45)'
          : '1px solid rgba(212,168,67,0.14)',
        background: tier.featured
          ? 'linear-gradient(180deg, rgba(212,168,67,0.08), rgba(255,255,255,0.02))'
          : 'rgba(255,255,255,0.025)',
        boxShadow: tier.featured ? '0 0 40px rgba(212,168,67,0.12)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {tier.badge && (
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg,#d4a843,#8a6a1e)',
            color: '#0a0908',
            padding: '5px 14px',
            borderRadius: 999,
            fontSize: 10,
            fontFamily: body,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {tier.badge}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontFamily: heading,
            fontSize: 28,
            fontWeight: 500,
            color: '#fff',
            marginBottom: 8,
          }}
        >
          {tier.name}
        </h3>
        <p style={{ fontFamily: body, color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.5 }}>
          {tier.tagline}
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontFamily: heading,
            fontSize: 42,
            fontWeight: 400,
            color: '#d4a843',
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {tier.priceFrom}
        </div>
        <div style={{ fontFamily: body, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
          {tier.priceVat}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: body,
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {tier.timeline}
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
        {tier.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '8px 0',
              borderBottom: i < tier.features.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontFamily: body,
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            <CheckCircle size={16} color="#d4a843" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.ctaHref}
        style={{
          marginTop: 24,
          display: 'inline-block',
          textAlign: 'center',
          padding: '14px 20px',
          borderRadius: 12,
          textDecoration: 'none',
          fontFamily: body,
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: '0.02em',
          background: tier.featured
            ? 'linear-gradient(90deg,#d4a843,#8a6a1e)'
            : 'transparent',
          color: tier.featured ? '#0a0908' : '#d4a843',
          border: tier.featured ? 'none' : '1px solid rgba(212,168,67,0.45)',
          transition: 'all 0.2s',
        }}
      >
        {tier.ctaLabel}
      </Link>
    </div>
  );
}
