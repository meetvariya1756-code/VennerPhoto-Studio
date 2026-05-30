'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import VideoPlayer from '../ui/VideoPlayer';
import { WeddingHighlight } from '@/lib/db';

interface WeddingHighlightsSectionProps {
  highlights: WeddingHighlight[];
}

export default function WeddingHighlightsSection({ highlights }: WeddingHighlightsSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const activeHighlights = highlights && highlights.length > 0
    ? highlights.filter(h => h.is_active !== false)
    : [];

  if (activeHighlights.length === 0) return null;

  // Duplicate the list multiple times to ensure seamless infinite scrolling loop marquee track
  const duplicatedHighlights = [...activeHighlights, ...activeHighlights, ...activeHighlights, ...activeHighlights];

  return (
    <section className="py-24 bg-[#0A0A0A] text-white overflow-hidden border-t border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-12 text-center">
        <span className="text-[#C9A86C] font-sans text-xs tracking-[0.25em] uppercase font-semibold block mb-3">
          Cinematic Highlights
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
          Wedding Motion Stories
        </h2>
        <div className="w-12 h-[1px] bg-[#C9A86C] mx-auto mt-6"></div>
      </div>

      {/* Infinite Horizontal Scrolling Container (Landscape aspect-[16/9]) */}
      <div className="relative w-full overflow-hidden py-4 select-none group/marquee">
        {/* Shadow overlays for smooth fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 w-max animate-highlights-marquee group-hover/marquee:[animation-play-state:paused]">
          {duplicatedHighlights.map((highlight, idx) => (
            <div
              key={`${highlight.id}-${idx}`}
              onClick={() => setActiveVideoUrl(highlight.video_url)}
              className="w-[280px] sm:w-[380px] aspect-[16/9] relative flex-shrink-0 cursor-pointer overflow-hidden rounded-none border border-neutral-800 hover:border-[#C9A86C]/50 transition-all duration-500 hover:scale-[1.03] shadow-2xl group"
            >
              {/* Cover Thumbnail or Live looping muted background video */}
              {highlight.thumbnail_url ? (
                <ImageWithFallback
                  src={highlight.thumbnail_url}
                  fallbackType="video-thumb"
                  fallbackIndex={idx % 5}
                  alt={highlight.title}
                  fill
                  sizes="(max-width: 640px) 280px, 380px"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
                />
              ) : (
                <video
                  src={highlight.video_url}
                  preload="metadata"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}

              {/* Muted video overlay on hover */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-4 sm:p-5">
                <span className="text-[#C9A86C] font-sans text-[8px] sm:text-[9px] tracking-widest uppercase font-semibold text-left">
                  Wedding Highlight
                </span>

                {/* Center play icon */}
                <div className="flex justify-center my-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center bg-[#C9A86C] text-black border-transparent scale-110 transition-transform duration-300">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Short Title Only - No descriptions */}
                <div className="text-left">
                  <h3 className="font-serif text-sm sm:text-base font-light tracking-wide text-white group-hover:text-[#C9A86C] transition-colors leading-tight truncate">
                    {highlight.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind Custom Keyframes inserted as a CSS Style sheet to prevent config modifications */}
      <style jsx global>{`
        @keyframes highlightsMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-highlights-marquee {
          animation: highlightsMarquee 40s linear infinite;
        }
      `}</style>

      {/* Widescreen Landscape Video Modal Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          {/* Close button */}
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all z-50 focus:outline-none"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Landscape Widescreen Video Container */}
          <div className="relative w-full max-w-4xl aspect-[16/9] shadow-2xl rounded-none overflow-hidden">
            <VideoPlayer src={activeVideoUrl} autoplay loop={false} muted={false} />
          </div>
        </div>
      )}
    </section>
  );
}
