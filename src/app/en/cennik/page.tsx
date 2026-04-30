import type { Metadata } from 'next';
import CennikPage from '@/components/landing/CennikPage';
import { pricingContent } from '@/lib/landingContent';

export const metadata: Metadata = {
  title: 'Pricing | Vassweb',
  description:
    'Transparent pricing for custom websites — Start from €990, Pro from €1,990, Enterprise from €3,990. One-time investment, no monthly surprises. Delivery 2–6 weeks.',
  keywords: ['website pricing', 'web development cost', 'custom website cost', 'vassweb pricing'],
  alternates: {
    canonical: 'https://vassweb.com/en/cennik',
    languages: {
      sk: 'https://vassweb.com/cennik',
      en: 'https://vassweb.com/en/cennik',
      cs: 'https://vassweb.com/cs/cennik',
      hu: 'https://vassweb.com/hu/cennik',
      'x-default': 'https://vassweb.com/cennik',
    },
  },
  openGraph: {
    title: 'Pricing | Vassweb',
    description:
      'Transparent pricing for custom websites. Start €990, Pro €1,990, Enterprise €3,990. No monthly surprises.',
    url: 'https://vassweb.com/en/cennik',
    siteName: 'Vassweb',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Vassweb',
    description: 'Transparent pricing for custom websites. No monthly surprises.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vassweb.com/en' },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://vassweb.com/en/cennik' },
    ],
  },
  ...pricingContent.en.tiers.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Vassweb ${t.name}`,
    description: t.tagline,
    serviceType: 'Web Development',
    provider: {
      '@type': 'Organization',
      name: 'Vassweb s. r. o.',
      url: 'https://vassweb.com',
    },
    areaServed: [
      { '@type': 'Country', name: 'Slovakia' },
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'Hungary' },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: t.name === 'Start' ? '990' : t.name === 'Pro' ? '1990' : '3990',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: 'https://vassweb.com/en/cennik',
      seller: { '@type': 'Organization', name: 'Vassweb s. r. o.' },
    },
  })),
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingContent.en.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function EnCennikRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CennikPage locale="en" />
    </>
  );
}
