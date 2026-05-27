import React from 'react';
import { Metadata } from 'next';
import ReelsGrid from '@/components/reels/ReelsGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getReels } from '@/lib/db';

export const revalidate = 0;

export const metadata: Metadata = generateSiteMetadata({
  title: 'Cinematic Video Reels',
  description: 'View premium video reels, high-fashion motion edits, and wedding cinema created by Venner Photo Studio.',
  path: '/reels',
});

export default async function ReelsPage() {
  const rawReels = await getReels();
  const reels = rawReels.map((r: any) => ({
    ...r,
    _id: r.id || r._id,
    videoUrl: r.video_url || r.videoUrl,
    thumbnailImage: r.thumbnail_url || r.thumbnailImage,
    isFeatured: r.is_featured !== undefined ? r.is_featured : r.isFeatured,
  }));

  return (
    <div className="pt-28 pb-24 bg-[#F9F7F4] text-[#1A1A1A] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Cinematic Motion"
          subtitle="Video Reels"
          align="center"
        />

        {/* Video reels grid with modal players */}
        <ReelsGrid reels={reels} />
      </div>
    </div>
  );
}
