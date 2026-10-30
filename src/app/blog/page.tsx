import React from 'react';
import type { Metadata } from 'next';
import { getBlogs, getSeoSettings } from '@/lib/db';
import { generateSiteMetadata } from '@/lib/metadata';
import BlogListClient from '@/components/blog/BlogListClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings().catch(() => null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';

  return {
    title: 'Journal & Stories | Venner Photo Studio',
    description: seo?.meta_description || 'Explore wedding guides, pre-wedding shoot inspiration, studio lighting tips, and photography stories from Venner Photo Studio in Surat.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: 'Journal & Stories | Venner Photo Studio',
      description: 'Explore wedding guides, pre-wedding shoot inspiration, studio lighting tips, and photography stories from Venner Photo Studio in Surat.',
      url: `${siteUrl}/blog`,
      siteName: 'Venner Photo Studio',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Venner Photo Studio Journal',
        },
      ],
    },
  };
}

export default async function BlogPage() {
  const blogs = await getBlogs(true);

  return (
    <div className="min-h-screen bg-[#F9F7F4] pt-28 pb-16">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-4 text-center">
        <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#C9A86C] font-semibold block mb-3">
          The Studio Journal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A1A] tracking-wide max-w-3xl mx-auto leading-tight">
          Stories, Inspiration & Cinematic Perspectives
        </h1>
        <p className="text-neutral-500 text-sm max-w-xl mx-auto mt-4 font-light leading-relaxed">
          Curated guides on wedding timelines, pre-wedding shoot locations in Surat, editorial studio lighting, and fine-art photography insights.
        </p>
      </div>

      {/* Main Blog List and Interactive Filters */}
      <BlogListClient initialBlogs={blogs} />
    </div>
  );
}

