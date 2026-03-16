import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo Aplikácie | Vassweb',
  description: 'Interaktívne ukážky webových aplikácií — rezervačný systém, CRM dashboard, AI automatizácia a admin panel.',
};

export default function DemoAppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
