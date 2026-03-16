import Home from '../page';

export const metadata = {
  title: 'Vassweb | Tvorba webů, AI a automatizace',
  description: 'Tvoříme weby, automatizace a AI řešení, která šetří čas a vydělávají peníze. Váš digitalizační partner.',
  alternates: {
    canonical: 'https://vassweb.sk/cs',
    languages: {
      'sk': 'https://vassweb.sk',
      'en': 'https://vassweb.sk/en',
      'cs': 'https://vassweb.sk/cs',
      'hu': 'https://vassweb.sk/hu',
      'x-default': 'https://vassweb.sk',
    },
  },
  openGraph: {
    title: 'Vassweb | Tvorba webů, AI a automatizace',
    description: 'Tvoříme weby, automatizace a AI řešení, která šetří čas a vydělávají peníze.',
    url: 'https://vassweb.sk/cs',
    siteName: 'Vassweb',
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vassweb | Tvorba webů, AI a automatizace',
    description: 'Tvoříme weby, automatizace a AI řešení, která šetří čas a vydělávají peníze.',
  },
};

export default function CsPage() {
  return <Home locale="cs" />;
}
