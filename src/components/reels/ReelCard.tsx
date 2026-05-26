'use client';

import React from 'react';
import { Play } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Reel } from '@/types';

interface ReelCardProps {
  reel: Reel;
  index: number;
  onClick: () => void;
}

export default function ReelCard({ reel, index, onClick }: ReelCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative aspect-[9/16] overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl cursor-pointer hover:border-[#C9A86C]/40 transition-all duration-500"
    >
      {/* Thumbnail cover */}
      <ImageWithFallback
        src={reel.thumbnailImage}
        fallbackType="video-thumb"
        fallbackIndex={index}
        alt={reel.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="group-hover:scale-103 transition-transform duration-700 ease-out"
      />

      {/* Dark overlay & Play buttons */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-6">
        {/* Category top tag */}
        <span className="text-[#C9A86C] font-sans text-[10px] tracking-widest uppercase font-semibold text-left">
          {reel.category.replace('-photography', '').replace('-', ' ')}
        </span>

        {/* Center play icon */}
        <div className="flex justify-center my-auto">
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C9A86C] group-hover:text-black group-hover:border-transparent group-hover:scale-110 transition-all duration-300">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>

        {/* Details bottom text */}
        <div className="text-left">
          <h3 className="font-serif text-lg font-light tracking-wide text-white leading-tight group-hover:text-[#C9A86C] transition-colors mb-1">
            {reel.title}
          </h3>
          {reel.description && (
            <p className="text-[11px] text-neutral-400 font-sans line-clamp-1">
              {reel.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
