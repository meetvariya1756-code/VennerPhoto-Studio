import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/studio/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

