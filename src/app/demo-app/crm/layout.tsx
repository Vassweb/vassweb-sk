import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CRM Dashboard — Demo',
  description: 'Ukážka moderného CRM s pipeline kanbanom, správou klientov a grafmi príjmov.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
