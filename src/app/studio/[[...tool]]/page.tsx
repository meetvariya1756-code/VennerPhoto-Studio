'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity/sanity.config';

export default function StudioPage() {
  // Renders the embedded Sanity Studio directly at /studio
  return (
    <div className="w-full min-h-screen relative z-[9999] bg-[#1A1A1A]">
      <NextStudio config={config} />
    </div>
  );
}
