import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    type: 'website',
    locale: 'sk_SK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vassweb | Menej práce. Viac výsledkov.',
    description: 'Tvoríme weby, automatizácie a AI riešenia pre firmy na Slovensku.',
    images: ['/opengraph-image'],
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
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vassweb',
    legalName: 'VVD s.r.o.',
    url: 'https://vassweb.sk',
    logo: 'https://vassweb.sk/images/logo-horizontal.webp',
    image: 'https://vassweb.sk/images/og-image.webp',
    email: 'info@vassweb.sk',
    telephone: '+421918668728',
    taxID: '2122501524',
    vatID: 'SK2122501524',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Blatná na Ostrove 281',
      postalCode: '930 32',
      addressLocality: 'Blatná na Ostrove',
      addressCountry: 'SK',
    },
    sameAs: [],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Vassweb',
    legalName: 'VVD s.r.o.',
    description: 'Tvoríme weby, automatizácie a AI riešenia, ktoré šetria čas a zarábajú peniaze.',
    url: 'https://vassweb.sk',
    logo: 'https://vassweb.sk/images/logo-horizontal.webp',
    image: 'https://vassweb.sk/images/og-image.webp',
    telephone: '+421918668728',
    email: 'info@vassweb.sk',
    taxID: '2122501524',
    vatID: 'SK2122501524',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Blatná na Ostrove 281',
      postalCode: '930 32',
      addressLocality: 'Blatná na Ostrove',
      addressCountry: 'SK',
    },
    areaServed: [
      { '@type': 'Country', name: 'Slovakia' },
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'Hungary' },
    ],
    serviceType: ['Web Development', 'AI Solutions', 'Business Automation', 'Digitalization'],
    priceRange: '€€',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Starter Website', description: 'Responsive website up to 5 pages' }, price: '1500', priceCurrency: 'EUR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Business Website', description: 'Website with CMS, AI chatbot, analytics' }, price: '3500', priceCurrency: 'EUR' },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Premium Solution', description: 'Custom application with AI integration' }, price: '6000', priceCurrency: 'EUR' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vassweb',
    url: 'https://vassweb.sk',
    inLanguage: ['sk', 'en', 'cs', 'hu'],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <meta name="theme-color" content="#0a0908" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        {/* Meta Pixel & Google Analytics — načítavajú sa cez CookieConsent komponent po súhlase používateľa (GDPR/ePrivacy compliance) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </head>
      <body className={`${playfair.variable} ${inter.variable}`}>
        <Navbar />
        {children}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
