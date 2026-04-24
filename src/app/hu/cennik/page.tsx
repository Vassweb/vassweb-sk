import type { Metadata } from 'next';
import CennikPage from '@/components/landing/CennikPage';
import { pricingContent } from '@/lib/landingContent';

export const metadata: Metadata = {
  title: 'Árak | Vassweb',
  description:
    'Átlátható árak egyedi weboldalakra — Start 990 €-tól, Pro 1 990 €-tól, Enterprise 3 990 €-tól. Egyszeri befektetés, havi meglepetések nélkül. Szállítás 2–6 hét.',
  keywords: ['weboldal ár', 'weboldal készítés ár', 'egyedi weboldal ára', 'vassweb árak'],
  alternates: {
    canonical: 'https://vassweb.com/hu/cennik',
    languages: {
      sk: 'https://vassweb.com/cennik',
      en: 'https://vassweb.com/en/cennik',
      cs: 'https://vassweb.com/cs/cennik',
      hu: 'https://vassweb.com/hu/cennik',
      'x-default': 'https://vassweb.com/cennik',
    },
  },
  openGraph: {
    title: 'Árak | Vassweb',
    description:
      'Átlátható árak egyedi weboldalakra. Start 990 €, Pro 1 990 €, Enterprise 3 990 €. Havi meglepetések nélkül.',
    url: 'https://vassweb.com/hu/cennik',
    siteName: 'Vassweb',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://vassweb.com/hu' },
      { '@type': 'ListItem', position: 2, name: 'Árak', item: 'https://vassweb.com/hu/cennik' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingContent.hu.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function HuCennikRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CennikPage locale="hu" />
    </>
  );
}
