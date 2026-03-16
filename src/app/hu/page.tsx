import Home from '../page';

export const metadata = {
  title: 'Vassweb | Webfejlesztés, AI és automatizáció',
  description: 'Weboldalakat, automatizációkat és AI megoldásokat készítünk, amelyek időt takarítanak meg és pénzt hoznak. A te digitalizációs partnered.',
  alternates: {
    canonical: 'https://vassweb.sk/hu',
    languages: {
      'sk': 'https://vassweb.sk',
      'en': 'https://vassweb.sk/en',
      'cs': 'https://vassweb.sk/cs',
      'hu': 'https://vassweb.sk/hu',
      'x-default': 'https://vassweb.sk',
    },
  },
};

export default function HuPage() {
  return <Home locale="hu" />;
}
