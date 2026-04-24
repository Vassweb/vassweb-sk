import type { LucideIcon } from 'lucide-react';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export interface ProcessStepData {
  num: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  duration: string;
}

export default function ProcessStep({ step }: { step: ProcessStepData }) {
  const Icon = step.Icon;
  return (
    <div
      style={{
        padding: '28px 24px',
        borderRadius: 16,
        border: '1px solid rgba(212,168,67,0.14)',
        backgroundColor: 'rgba(255,255,255,0.025)',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: 'linear-gradient(135deg,rgba(212,168,67,0.2),rgba(212,168,67,0.05))',
            border: '1px solid rgba(212,168,67,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} color="#d4a843" />
        </div>
        <div
          style={{
            fontFamily: body,
            fontSize: 11,
            color: 'rgba(212,168,67,0.8)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {step.num}
        </div>
      </div>
      <h3
        style={{
          fontFamily: heading,
          fontSize: 20,
          fontWeight: 500,
          color: '#fff',
          marginBottom: 8,
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontFamily: body,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {step.desc}
      </p>
      <div
        style={{
          fontFamily: body,
          fontSize: 12,
          color: '#d4a843',
          fontWeight: 600,
        }}
      >
        {step.duration}
      </div>
    </div>
  );
}
