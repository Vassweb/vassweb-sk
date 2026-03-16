import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demo | Vassweb',
  description: 'Pozrite si živé ukážky webov vytvorených Vassweb — reštaurácia, e-shop, firemný web, portfólio a fitness štúdio.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
