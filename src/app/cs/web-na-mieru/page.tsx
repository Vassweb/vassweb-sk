import type { Metadata } from 'next';
import WebNaMieruPage from '@/components/landing/WebNaMieruPage';

export const metadata: Metadata = {
  title: 'Web na míru | Vassweb',
  description:
    'Stavíme weby na míru v Next.js 14 — rychlé, bezpečné, bez měsíčních licencí. Dodání 2–6 týdnů, 100% vlastnictví kódu, ceny od 990 € jednorázově.',
  keywords: ['web na míru', 'tvorba webu', 'webový vývoj', 'next.js web', 'vlastní web', 'vassweb'],
  alternates: {
    canonical: 'https://vassweb.com/cs/web-na-mieru',
    languages: {
      sk: 'https://vassweb.com/web-na-mieru',
      en: 'https://vassweb.com/en/web-na-mieru',
      cs: 'https://vassweb.com/cs/web-na-mieru',
      hu: 'https://vassweb.com/hu/web-na-mieru',
      'x-default': 'https://vassweb.com/web-na-mieru',
    },
  },
  openGraph: {
    title: 'Web na míru | Vassweb',
    description: 'Weby od nuly v Next.js 14. Rychlé, bezpečné, bez měsíčních licencí.',
    url: 'https://vassweb.com/cs/web-na-mieru',
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
      { '@type': 'ListItem', position: 2, name: 'Web na míru', item: 'https://vassweb.com/cs/web-na-mieru' },
    ],
  },
];

export default function CsWebNaMieruRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebNaMieruPage locale="cs" />
    </>
  );
}
