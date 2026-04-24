import type { Metadata } from 'next';
import WebNaMieruPage from '@/components/landing/WebNaMieruPage';

export const metadata: Metadata = {
  title: 'Custom Website | Vassweb',
  description:
    'We build custom websites in Next.js 14 — fast, secure, no monthly licenses. Delivery 2–6 weeks, 100% code ownership, prices from €990 one-time.',
  keywords: ['custom website', 'web development', 'next.js website', 'bespoke website', 'vassweb'],
  alternates: {
    canonical: 'https://vassweb.com/en/web-na-mieru',
    languages: {
      sk: 'https://vassweb.com/web-na-mieru',
      en: 'https://vassweb.com/en/web-na-mieru',
      cs: 'https://vassweb.com/cs/web-na-mieru',
      hu: 'https://vassweb.com/hu/web-na-mieru',
      'x-default': 'https://vassweb.com/web-na-mieru',
    },
  },
  openGraph: {
    title: 'Custom Website | Vassweb',
    description:
      'Websites built from scratch in Next.js 14. Fast, secure, no monthly licenses. Delivery 2–6 weeks.',
    url: 'https://vassweb.com/en/web-na-mieru',
    siteName: 'Vassweb',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vassweb.com/en' },
      { '@type': 'ListItem', position: 2, name: 'Custom Website', item: 'https://vassweb.com/en/web-na-mieru' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development',
    name: 'Custom Website — Vassweb',
    provider: { '@type': 'Organization', name: 'Vassweb s. r. o.', url: 'https://vassweb.com' },
    description: 'Custom websites in Next.js 14. No templates, no monthly licenses, full code ownership.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '990',
      highPrice: '3990',
      offerCount: 3,
    },
  },
];

export default function EnWebNaMieruRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebNaMieruPage locale="en" />
    </>
  );
}
