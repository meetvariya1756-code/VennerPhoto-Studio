'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import VideoPlayer from '../ui/VideoPlayer';
import { Reel } from '@/types';

interface AutoScrollingReelsProps {
  reels: Reel[];
}

export default function AutoScrollingReels({ reels }: AutoScrollingReelsProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (!reels || reels.length === 0) return null;

  // Duplicate the reels list multiple times to ensure a seamless infinite scrolling track
  const duplicatedReels = [...reels, ...reels, ...reels, ...reels];

  return (
    <section className="py-24 bg-[#1A1A1A] text-white overflow-hidden border-t border-b border-neutral-800/40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-12 text-center">
        <span className="text-[#C9A86C] font-sans text-xs tracking-[0.25em] uppercase font-semibold block mb-3">
          Cinematic Marquee
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
          Visual Motion Stories
        </h2>
        <div className="w-12 h-[1px] bg-[#C9A86C] mx-auto mt-6"></div>
      </div>

      {/* Infinite Horizontal Scrolling Container */}
      <div className="relative w-full overflow-hidden py-4 select-none group/marquee">
        {/* Shadow overlays for smooth fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {duplicatedReels.map((reel, idx) => (
            <div
              key={`${reel._id}-${idx}`}
              onClick={() => setActiveVideoUrl(reel.videoUrl)}
              className="w-[200px] sm:w-[240px] aspect-[9/16] relative flex-shrink-0 cursor-pointer overflow-hidden rounded-none border border-neutral-800 hover:border-[#C9A86C]/50 transition-all duration-500 hover:scale-[1.03] shadow-2xl group"
            >
              {/* Live video */}
              <video
                src={reel.videoUrl}
                preload="metadata"
                muted
                playsInline
                loop
                autoPlay
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Muted video overlay on hover */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-5">
                <span className="text-[#C9A86C] font-sans text-[9px] tracking-widest uppercase font-semibold text-left">
                  {reel.category.replace('-photography', '').replace('-', ' ')}
                </span>

                {/* Center play icon */}
                <div className="flex justify-center my-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center bg-[#C9A86C] text-black border-transparent scale-110 transition-transform duration-300">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="font-serif text-sm font-light tracking-wide text-white group-hover:text-[#C9A86C] transition-colors leading-tight truncate">
                    {reel.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind Custom Keyframes inserted as a CSS Style sheet to prevent complex config modifications */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      {/* Video Modal Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12">
          {/* Close button */}
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all z-50 focus:outline-none"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Container */}
          <div className="relative w-full max-w-lg aspect-[9/16] max-h-[85vh] shadow-2xl rounded-none overflow-hidden">
            <VideoPlayer src={activeVideoUrl} autoplay loop={false} muted={false} />
          </div>
        </div>
      )}
    </section>
  );
}
