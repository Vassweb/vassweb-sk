import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vassweb.com'

  const homeLanguages = {
    sk: baseUrl,
    en: `${baseUrl}/en`,
    cs: `${baseUrl}/cs`,
    hu: `${baseUrl}/hu`,
  }

  const privacyLanguages = {
    sk: `${baseUrl}/ochrana-udajov`,
    en: `${baseUrl}/en/privacy-policy`,
    cs: `${baseUrl}/cs/ochrana-udaju`,
    hu: `${baseUrl}/hu/adatvedelmi-iranyelvek`,
  }

  const termsLanguages = {
    sk: `${baseUrl}/obchodne-podmienky`,
    en: `${baseUrl}/en/terms-and-conditions`,
    cs: `${baseUrl}/cs/obchodni-podminky`,
    hu: `${baseUrl}/hu/altalanos-szerzodesi-feltetelek`,
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${baseUrl}/cs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${baseUrl}/hu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${baseUrl}/ochrana-udajov`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: privacyLanguages },
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: privacyLanguages },
    },
    {
      url: `${baseUrl}/cs/ochrana-udaju`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: privacyLanguages },
    },
    {
      url: `${baseUrl}/hu/adatvedelmi-iranyelvek`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: privacyLanguages },
    },
    {
      url: `${baseUrl}/obchodne-podmienky`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: termsLanguages },
    },
    {
      url: `${baseUrl}/en/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: termsLanguages },
    },
    {
      url: `${baseUrl}/cs/obchodni-podminky`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: termsLanguages },
    },
    {
      url: `${baseUrl}/hu/altalanos-szerzodesi-feltetelek`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: termsLanguages },
    },
    // Portfolio demos — live showcase pages for clients (visible but not primary)
    ...[
      '/demo/salon-bella',
      '/demo/cafe-milano',
      '/demo/foto-studio',
      '/demo/kvetinarstvo',
      '/demo/advokat-kovac',
      '/demo/dentalna-klinika',
      '/demo/crm-realitka',
      '/demo/crm-autoservis',
      '/demo/eshop-flavour',
      '/demo/booking-system',
    ].map(path => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    // Configurator — key conversion page
    {
      url: `${baseUrl}/vyber-si-web`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/vyber-si-web`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cs/vyber-si-web`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hu/vyber-si-web`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // /cennik — pricing landing page (referenced by cold emails)
    {
      url: `${baseUrl}/cennik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          sk: `${baseUrl}/cennik`,
          en: `${baseUrl}/en/cennik`,
          cs: `${baseUrl}/cs/cennik`,
          hu: `${baseUrl}/hu/cennik`,
        },
      },
    },
    {
      url: `${baseUrl}/en/cennik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cs/cennik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hu/cennik`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // /web-na-mieru — landing page (referenced by TOP 10 cold emails)
    {
      url: `${baseUrl}/web-na-mieru`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          sk: `${baseUrl}/web-na-mieru`,
          en: `${baseUrl}/en/web-na-mieru`,
          cs: `${baseUrl}/cs/web-na-mieru`,
          hu: `${baseUrl}/hu/web-na-mieru`,
        },
      },
    },
    {
      url: `${baseUrl}/en/web-na-mieru`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cs/web-na-mieru`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hu/web-na-mieru`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Note: /app and /demo-app/* are noindex (blocked in robots.ts) and removed from sitemap
  ]
}
