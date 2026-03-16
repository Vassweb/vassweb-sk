import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vassweb.sk'),
  title: {
    default: 'Vassweb | Menej práce. Viac výsledkov.',
    template: '%s | Vassweb', // pre budúce podstránky — automaticky pridá "| Vassweb"
  },
  description: 'Tvoríme weby, automatizácie a AI riešenia, ktoré šetria čas a zarábajú peniaze. Digitalizačný partner pre firmy na Slovensku.',
  keywords: ['webový vývoj', 'AI riešenia', 'automatizácia', 'digitalizácia', 'Slovensko', 'tvorba webov', 'vassweb'],
  authors: [{ name: 'Vassweb', url: 'https://vassweb.sk' }],
  creator: 'Vassweb',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://vassweb.sk',
    languages: {
      'sk': 'https://vassweb.sk',
      'en': 'https://vassweb.sk/en',
      'cs': 'https://vassweb.sk/cs',
      'hu': 'https://vassweb.sk/hu',
      'x-default': 'https://vassweb.sk',
    },
  },
  openGraph: {
    title: 'Vassweb | Digitalizačný partner pre váš biznis',
    description: 'Tvoríme weby, automatizácie a AI riešenia pre firmy na Slovensku.',
    url: 'https://vassweb.sk',
    siteName: 'Vassweb',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'sk_SK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vassweb | Menej práce. Viac výsledkov.',
    description: 'Tvoríme weby, automatizácie a AI riešenia pre firmy na Slovensku.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD structured data — pomáha Googlu pochopiť čo je tvoja firma
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Vassweb',
  description: 'Tvoríme weby, automatizácie a AI riešenia, ktoré šetria čas a zarábajú peniaze.',
  url: 'https://vassweb.sk',
  logo: 'https://vassweb.sk/images/logo-horizontal.png',
  image: 'https://vassweb.sk/images/og-image.png',
  telephone: '+421918668728',
  email: 'info@vassweb.sk',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SK',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Slovakia',
  },
  serviceType: ['Web Development', 'AI Solutions', 'Business Automation', 'Digitalization'],
  priceRange: '€€',
  sameAs: [
    // Sem pridaj linky na sociálne siete keď ich budeš mať:
    // 'https://www.facebook.com/vassweb',
    // 'https://www.instagram.com/vassweb',
    // 'https://www.linkedin.com/company/vassweb',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <meta name="theme-color" content="#0a0908" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Navbar />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
