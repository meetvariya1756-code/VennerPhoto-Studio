import React from 'react';
import { Metadata } from 'next';
import ReelsGrid from '@/components/reels/ReelsGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getReels } from '@/lib/sanity.queries';

export const revalidate = 600;

export const metadata: Metadata = generateSiteMetadata({
  title: 'Cinematic Video Reels',
  description: 'View premium video reels, high-fashion motion edits, and wedding cinema created by Venner Photo Studio.',
  path: '/reels',
});

export default async function ReelsPage() {
  const reels = await getReels();

  return (
    <div className="pt-28 pb-24 bg-[#1A1A1A] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Cinematic Motion"
          subtitle="Video Reels"
          align="center"
          light
        />

        {/* Video reels grid with modal players */}
        <ReelsGrid reels={reels} />
      </div>
    </div>
  );
}
