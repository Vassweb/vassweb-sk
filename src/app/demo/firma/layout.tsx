import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BuildPro Stavebná firma — Demo',
  description: 'Ukážka profesionálneho firemného webu so službami, portfóliom projektov a kontaktným formulárom.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
