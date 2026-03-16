import Home from '../page';

export const metadata = {
  title: 'Vassweb | Web Development, AI & Automation',
  description: 'We build websites, automations and AI solutions that save time and earn money. Your digitalisation partner.',
  alternates: {
    canonical: 'https://vassweb.sk/en',
    languages: {
      'sk': 'https://vassweb.sk',
      'en': 'https://vassweb.sk/en',
      'cs': 'https://vassweb.sk/cs',
      'hu': 'https://vassweb.sk/hu',
      'x-default': 'https://vassweb.sk',
    },
  },
};

export default function EnPage() {
  return <Home locale="en" />;
}
