import React from 'react';
import { Metadata } from 'next';
import PortfolioGrid from '@/components/portfolio/PortfolioGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getPortfolioPhotos } from '@/lib/db';

export const revalidate = 86400; // Cache on edge CDN for 24 hours, revalidated on-demand

export const metadata: Metadata = generateSiteMetadata({
  title: 'Fine-Art Portfolio',
  description: 'Explore the complete photographic collections of Venner Photo Studio, including wedding, portrait, studio, and product categories.',
  path: '/portfolio',
});

export default async function PortfolioPage() {
  const rawPhotos = await getPortfolioPhotos();
  
  // Normalize Supabase format to Sanity components expectation
  const photos = rawPhotos.map((photo: any) => ({
    ...photo,
    _id: photo.id || photo._id,
    image: photo.image_url || photo.image,
  }));

  return (
    <div className="pt-28 pb-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Fine-Art Portfolio"
          subtitle="Curated Collections"
          align="center"
        />

        {/* Dynamic filters and masonry grid and lightboxes */}
        <PortfolioGrid photos={photos as any} />
      </div>
    </div>
  );
}
