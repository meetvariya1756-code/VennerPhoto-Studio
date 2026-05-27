'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { PortfolioPhoto } from '@/types';

interface PhotoLightboxProps {
  photo: PortfolioPhoto;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  index: number;
  total: number;
}

export default function PhotoLightbox({
  photo,
  onClose,
  onNext,
  onPrev,
  index,
  total,
}: PhotoLightboxProps) {
  // Bind arrow keys and escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling while lightbox is active
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 select-none">
      {/* Top Close Button & Counter */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-50 text-white">
        <span className="font-sans text-xs tracking-widest uppercase text-neutral-400">
          IMAGE {index + 1} OF {total}
        </span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={onPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 z-50 focus:outline-none"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={onNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 z-50 focus:outline-none"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Image Canvas & Text Panel */}
      <div className="flex flex-col items-center justify-center w-full max-w-5xl h-full max-h-[80vh] gap-4 z-10">
        <div className="relative w-full flex-1 min-h-0">
          <ImageWithFallback
            src={photo.image}
            fallbackType="photo"
            fallbackIndex={index}
            alt={photo.title}
            fill
            sizes="100vw"
            objectFit="contain"
            className="bg-transparent"
          />
        </div>

        {/* Bottom Text Panel */}
        <div className="text-center text-white w-full max-w-2xl px-4 shrink-0">
          <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-1 block">
            {photo.category.replace('-photography', '').replace(/-/g, ' ')}
          </span>
          <h3 className="font-serif text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto break-words leading-relaxed">
            {photo.title}
          </h3>
          {photo.altText && (
            <p className="text-xs text-neutral-400 mt-1.5 font-sans italic">{photo.altText}</p>
          )}
        </div>
      </div>
    </div>
  );
}
