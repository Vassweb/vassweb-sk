import VyberSiWeb from '../../vyber-si-web/page';

export const metadata = {
  title: 'Nakonfigurujte si web | Vassweb',
  description: 'Nakonfigurujte si vlastní web ve 3 krocích. Vyberte šablonu, upravte vzhled, zanechte kontakt — a my to postavíme.',
  alternates: {
    canonical: 'https://vassweb.sk/cs/vyber-si-web',
    languages: {
      'sk': 'https://vassweb.sk/vyber-si-web',
      'en': 'https://vassweb.sk/en/vyber-si-web',
      'cs': 'https://vassweb.sk/cs/vyber-si-web',
      'hu': 'https://vassweb.sk/hu/vyber-si-web',
    },
  },
};

export default function CsVyberSiWebPage() {
  return <VyberSiWeb locale="cs" />;
}
