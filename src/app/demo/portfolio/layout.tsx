import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfólio Dizajnéra — Demo',
  description: 'Ukážka kreatívneho portfólia s filtrovanými projektmi a moderným minimalistickým dizajnom.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
