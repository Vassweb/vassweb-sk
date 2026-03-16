import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FitZone Fitness — Demo',
  description: 'Ukážka dynamickej stránky pre fitness štúdio s rozvrhom, trénermi a online registráciou.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
