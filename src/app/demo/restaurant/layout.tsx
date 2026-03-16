import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Cucina Reštaurácia — Demo',
  description: 'Ukážka webu pre reštauráciu s online rezerváciami, galériou jedál a interaktívnym menu.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
