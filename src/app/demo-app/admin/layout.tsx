import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — Demo',
  description: 'Ukážka administračného panelu s prehľadom štatistík, správou obsahu a nastaveniami.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
