import VyberSiWeb from '../../vyber-si-web/page';

export const metadata = {
  title: 'Build Your Website | Vassweb',
  description: 'Configure your custom website in 3 steps. Choose a template, customize the design, leave your contact — and we\'ll build it.',
  alternates: {
    canonical: 'https://vassweb.sk/en/vyber-si-web',
    languages: {
      'sk': 'https://vassweb.sk/vyber-si-web',
      'en': 'https://vassweb.sk/en/vyber-si-web',
      'cs': 'https://vassweb.sk/cs/vyber-si-web',
      'hu': 'https://vassweb.sk/hu/vyber-si-web',
    },
  },
};

export default function EnVyberSiWebPage() {
  return <VyberSiWeb locale="en" />;
}
