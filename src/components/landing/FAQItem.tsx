'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const heading = 'var(--font-heading), Playfair Display, Georgia, serif';
const body = 'var(--font-inter), Inter, system-ui, sans-serif';

export interface FAQData {
  q: string;
  a: string;
}

export default function FAQItem({ item, index }: { item: FAQData; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(212,168,67,0.12)',
        padding: '20px 0',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          color: '#fff',
          fontFamily: heading,
          fontSize: 18,
          fontWeight: 500,
        }}
        aria-expanded={open}
      >
        <span style={{ flexGrow: 1 }}>{item.q}</span>
        <ChevronDown
          size={20}
          color="#d4a843"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, margin 0.3s',
          marginTop: open ? 14 : 0,
          color: 'rgba(255,255,255,0.7)',
          fontFamily: body,
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: 0 }}>{item.a}</p>
      </div>
    </div>
  );
}
