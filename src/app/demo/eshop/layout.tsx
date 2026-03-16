import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ModaShop E-commerce — Demo',
  description: 'Ukážka moderného e-shopu s produktovým katalógom, košíkom a AI odporúčaniami.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
