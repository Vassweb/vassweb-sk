import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export interface CaseStudyData {
  client: string;
  industry: string;
  challenge: string;
  result: string;
  metrics: ReadonlyArray<{ label: string; value: string }>;
  href?: string;
  linkLabel?: string;
}

export default function CaseStudyCard({ cs }: { cs: CaseStudyData }) {
  return (
    <div
      style={{
        padding: '28px 24px',
        borderRadius: 16,
        border: '1px solid rgba(212,168,67,0.14)',
        backgroundColor: 'rgba(255,255,255,0.025)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          fontFamily: body,
          fontSize: 11,
          color: '#d4a843',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {cs.industry}
      </div>
      <h3
        style={{
          fontFamily: heading,
          fontSize: 22,
          fontWeight: 500,
          color: '#fff',
          marginBottom: 12,
        }}
      >
        {cs.client}
      </h3>
      <p
        style={{
          fontFamily: body,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {cs.challenge}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '14px',
          borderRadius: 10,
          background: 'rgba(212,168,67,0.06)',
          border: '1px solid rgba(212,168,67,0.14)',
          marginBottom: 16,
        }}
      >
        <TrendingUp size={16} color="#d4a843" style={{ flexShrink: 0, marginTop: 2 }} />
        <p
          style={{
            fontFamily: body,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {cs.result}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cs.metrics.length}, 1fr)`,
          gap: 12,
          marginBottom: 16,
          flexGrow: 1,
        }}
      >
        {cs.metrics.map((m, i) => (
          <div key={i}>
            <div
              style={{
                fontFamily: heading,
                fontSize: 24,
                fontWeight: 400,
                color: '#d4a843',
                marginBottom: 2,
                lineHeight: 1,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontFamily: body,
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.05em',
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
      {cs.href && cs.linkLabel && (
        <Link
          href={cs.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#d4a843',
            fontFamily: body,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {cs.linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
