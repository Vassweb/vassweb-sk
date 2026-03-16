import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Vassweb App | Business Manager',
  description: 'Vassweb CRM — správa klientov, projektov a faktúr s AI asistentom',
  manifest: '/manifest-app.json',
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: 'VW App',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#d4a843',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
