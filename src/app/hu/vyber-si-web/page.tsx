import VyberSiWeb from '../../vyber-si-web/page';

export const metadata = {
  title: 'Konfigurálja weboldalát | Vassweb',
  description: 'Konfigurálja egyedi weboldalát 3 lépésben. Válasszon sablont, testreszabja a dizájnt, adja meg elérhetőségét — és mi megépítjük.',
  alternates: {
    canonical: 'https://vassweb.sk/hu/vyber-si-web',
    languages: {
      'sk': 'https://vassweb.sk/vyber-si-web',
      'en': 'https://vassweb.sk/en/vyber-si-web',
      'cs': 'https://vassweb.sk/cs/vyber-si-web',
      'hu': 'https://vassweb.sk/hu/vyber-si-web',
    },
  },
};

export default function HuVyberSiWebPage() {
  return <VyberSiWeb locale="hu" />;
}
