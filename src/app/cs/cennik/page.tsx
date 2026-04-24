import type { Metadata } from 'next';
import CennikPage from '@/components/landing/CennikPage';
import { pricingContent } from '@/lib/landingContent';

export const metadata: Metadata = {
  title: 'Ceník | Vassweb',
  description:
    'Transparentní ceny webů na míru — Start od 990 €, Pro od 1 990 €, Enterprise od 3 990 €. Jednorázová investice, žádná měsíční překvapení. Dodání 2–6 týdnů.',
  keywords: ['ceník web', 'cena webové stránky', 'cena web na míru', 'vassweb ceník'],
  alternates: {
    canonical: 'https://vassweb.com/cs/cennik',
    languages: {
      sk: 'https://vassweb.com/cennik',
      en: 'https://vassweb.com/en/cennik',
      cs: 'https://vassweb.com/cs/cennik',
      hu: 'https://vassweb.com/hu/cennik',
      'x-default': 'https://vassweb.com/cennik',
    },
  },
  openGraph: {
    title: 'Ceník | Vassweb',
    description:
      'Transparentní ceny webů na míru. Start 990 €, Pro 1 990 €, Enterprise 3 990 €. Žádná měsíční překvapení.',
    url: 'https://vassweb.com/cs/cennik',
    siteName: 'Vassweb',
    locale: 'cs_CZ',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://vassweb.com/cs' },
      { '@type': 'ListItem', position: 2, name: 'Ceník', item: 'https://vassweb.com/cs/cennik' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingContent.cs.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function CsCennikRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CennikPage locale="cs" />
    </>
  );
}
