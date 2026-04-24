import type { Metadata } from 'next';
import WebNaMieruPage from '@/components/landing/WebNaMieruPage';

export const metadata: Metadata = {
  title: 'Egyedi weboldal | Vassweb',
  description:
    'Egyedi weboldalakat építünk Next.js 14-ben — gyors, biztonságos, havi licencek nélkül. Szállítás 2–6 hét, 100% kódbirtoklás, árak 990 €-tól egyszeri díjjal.',
  keywords: ['egyedi weboldal', 'weboldal készítés', 'webfejlesztés', 'next.js weboldal', 'vassweb'],
  alternates: {
    canonical: 'https://vassweb.com/hu/web-na-mieru',
    languages: {
      sk: 'https://vassweb.com/web-na-mieru',
      en: 'https://vassweb.com/en/web-na-mieru',
      cs: 'https://vassweb.com/cs/web-na-mieru',
      hu: 'https://vassweb.com/hu/web-na-mieru',
      'x-default': 'https://vassweb.com/web-na-mieru',
    },
  },
  openGraph: {
    title: 'Egyedi weboldal | Vassweb',
    description: 'Weboldalak nulláról Next.js 14-ben. Gyors, biztonságos, havi licencek nélkül.',
    url: 'https://vassweb.com/hu/web-na-mieru',
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
      { '@type': 'ListItem', position: 2, name: 'Egyedi weboldal', item: 'https://vassweb.com/hu/web-na-mieru' },
    ],
  },
];

export default function HuWebNaMieruRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebNaMieruPage locale="hu" />
    </>
  );
}
