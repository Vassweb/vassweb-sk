import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Ak budeš mať stránky, ktoré nechceš indexovať (napr. admin panel):
      // disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://vassweb.sk/sitemap.xml',
  }
}
