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

};

export default nextConfig;
