import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI & Automatizácia — Demo',
  description: 'Interaktívne demo AI chatbotu, email automatizácie, automatickej fakturácie a real-time analytiky.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
