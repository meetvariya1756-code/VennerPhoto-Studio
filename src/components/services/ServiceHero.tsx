'use client';

import React from 'react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Service } from '@/types';

interface ServiceHeroProps {
  service: Service;
}

export default function ServiceHero({ service }: ServiceHeroProps) {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Frame */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ImageWithFallback
          src={service.heroImage}
          fallbackType="hero"
          fallbackIndex={1}
          alt={service.title}
          fill
          priority
          className="opacity-45 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-black/40 to-black/60 z-1" />
      </div>

      {/* Content overlays */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white mt-16">
        <span className="text-[#C9A86C] font-sans text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-4 block">
          Venner Collections
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight mb-4">
          {service.title}
        </h1>
        <div className="w-16 h-[2px] bg-[#C9A86C] mx-auto mt-6" />
      </div>
    </section>
  );
}
