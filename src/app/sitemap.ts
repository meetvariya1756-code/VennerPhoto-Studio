import { MetadataRoute } from 'next';
import { getServices, getBlogs } from '@/lib/db';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';

  const [services, blogs] = await Promise.all([
    getServices().catch(() => []),
    getBlogs(true).catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/reels`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s: any) => {
    const slug = typeof s.slug === 'object' && s.slug ? (s.slug as any).current : s.slug;
    return {
      url: `${siteUrl}/services/${slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.85,
    };
  });

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : (b.published_at ? new Date(b.published_at) : now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}

