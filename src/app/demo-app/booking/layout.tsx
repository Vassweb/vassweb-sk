import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rezervačný systém — Demo',
  description: 'Ukážka kompletného booking systému s kalendárom, časovými slotmi a admin panelom.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
