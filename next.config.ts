import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Povolí WebP a AVIF optimalizáciu obrázkov
  images: {
    formats: ['image/avif', 'image/webp'],
    // Definuj veľkosti pre responsive obrázky
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Komprimuj výstup
  compress: true,
  // Powered by header vypni (bezpečnosť)
  poweredByHeader: false,
  // Strict mode pre lepší vývoj
  reactStrictMode: true,

  // Redirecty pre domény → správna jazyková verzia
  async redirects() {
    return [
      // vassweb.cz → česká verzia
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vassweb.cz' }],
        destination: 'https://vassweb.sk/cs/:path*',
        permanent: true,
      },
      // vassweb.com → anglická verzia
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vassweb.com' }],
        destination: 'https://vassweb.sk/en/:path*',
        permanent: true,
      },
      // vassweb.hu → maďarská verzia
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vassweb.hu' }],
        destination: 'https://vassweb.sk/hu/:path*',
        permanent: true,
      },
      // www verzie → bez www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vassweb.cz' }],
        destination: 'https://vassweb.sk/cs/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vassweb.com' }],
        destination: 'https://vassweb.sk/en/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vassweb.hu' }],
        destination: 'https://vassweb.sk/hu/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
