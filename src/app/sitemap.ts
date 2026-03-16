import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vassweb.sk'

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
    // Demo websites
    ...['/demo', '/demo/restaurant', '/demo/eshop', '/demo/firma', '/demo/portfolio', '/demo/fitness'].map(path => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Demo apps
    ...['/demo-app', '/demo-app/booking', '/demo-app/crm', '/demo-app/admin', '/demo-app/ai-automation'].map(path => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Business app
    {
      url: `${baseUrl}/app`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
