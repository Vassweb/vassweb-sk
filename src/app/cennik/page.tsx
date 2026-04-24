import type { Metadata } from 'next';
import CennikPage from '@/components/landing/CennikPage';
import { pricingContent } from '@/lib/landingContent';

export const metadata: Metadata = {
  title: 'Cenník | Vassweb',
  description:
    'Transparentné ceny webov na mieru — Start od 990 €, Pro od 1 990 €, Enterprise od 3 990 €. Jednorazová investícia, žiadne mesačné prekvapenia. Dodanie 2–6 týždňov.',
  keywords: ['cenník web', 'cena webovej stránky', 'cena web na mieru', 'vassweb cenník', 'tvorba webu cena'],
  alternates: {
    canonical: 'https://vassweb.com/cennik',
    languages: {
      sk: 'https://vassweb.com/cennik',
      en: 'https://vassweb.com/en/cennik',
      cs: 'https://vassweb.com/cs/cennik',
      hu: 'https://vassweb.com/hu/cennik',
      'x-default': 'https://vassweb.com/cennik',
    },
  },
  openGraph: {
    title: 'Cenník | Vassweb',
    description:
      'Transparentné ceny webov na mieru. Start 990 €, Pro 1 990 €, Enterprise 3 990 €. Jednorazová investícia, žiadne mesačné prekvapenia.',
    url: 'https://vassweb.com/cennik',
    siteName: 'Vassweb',
    locale: 'sk_SK',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cenník | Vassweb',
    description: 'Transparentné ceny webov na mieru. Žiadne mesačné prekvapenia.',
    images: ['/opengraph-image'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domov', item: 'https://vassweb.com' },
      { '@type': 'ListItem', position: 2, name: 'Cenník', item: 'https://vassweb.com/cennik' },
    ],
  },
  ...pricingContent.sk.tiers.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Vassweb ${t.name}`,
    description: t.tagline,
    brand: { '@type': 'Brand', name: 'Vassweb' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: t.name === 'Start' ? '990' : t.name === 'Pro' ? '1990' : '3990',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `https://vassweb.com/cennik`,
      seller: { '@type': 'Organization', name: 'Vassweb s. r. o.' },
    },
  })),
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingContent.sk.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function CennikRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CennikPage locale="sk" />
    </>
  );
}
