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
};

export default function CsPage() {
  return <Home locale="cs" />;
}
