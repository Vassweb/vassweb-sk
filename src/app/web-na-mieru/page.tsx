import type { Metadata } from 'next';
import WebNaMieruPage from '@/components/landing/WebNaMieruPage';

export const metadata: Metadata = {
  title: 'Web na mieru | Vassweb',
  description:
    'Staviame weby na mieru v Next.js 14 — rýchle, bezpečné, bez mesačných licencií. Dodanie 2–6 týždňov, 100% vlastníctvo kódu, ceny od 990 € jednorazovo.',
  keywords: ['web na mieru', 'tvorba webu', 'webový vývoj', 'next.js web', 'vlastný web', 'vassweb'],
  alternates: {
    canonical: 'https://vassweb.com/web-na-mieru',
    languages: {
      sk: 'https://vassweb.com/web-na-mieru',
      en: 'https://vassweb.com/en/web-na-mieru',
      cs: 'https://vassweb.com/cs/web-na-mieru',
      hu: 'https://vassweb.com/hu/web-na-mieru',
      'x-default': 'https://vassweb.com/web-na-mieru',
    },
  },
  openGraph: {
    title: 'Web na mieru | Vassweb',
    description:
      'Weby od nuly v Next.js 14. Rýchle, bezpečné, bez mesačných licencií. Dodanie 2–6 týždňov.',
    url: 'https://vassweb.com/web-na-mieru',
    siteName: 'Vassweb',
    locale: 'sk_SK',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web na mieru | Vassweb',
    description: 'Weby od nuly v Next.js 14. Rýchle, bezpečné, bez mesačných licencií.',
    images: ['/opengraph-image'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domov', item: 'https://vassweb.com' },
      { '@type': 'ListItem', position: 2, name: 'Web na mieru', item: 'https://vassweb.com/web-na-mieru' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development',
    name: 'Web na mieru — Vassweb',
    provider: {
      '@type': 'Organization',
      name: 'Vassweb s. r. o.',
      url: 'https://vassweb.com',
    },
    description:
      'Weby na mieru v Next.js 14. Bez šablón, bez mesačných licencií, s plným vlastníctvom kódu.',
    areaServed: [
      { '@type': 'Country', name: 'Slovakia' },
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'Hungary' },
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '990',
      highPrice: '3990',
      offerCount: 3,
    },
  },
];

export default function WebNaMieruRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebNaMieruPage locale="sk" />
    </>
  );
}
