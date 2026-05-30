'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, title, description }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="flex flex-col bg-white border border-neutral-200/60 p-4 shadow-sm relative group/card">
      {/* Slider Frame aspect-ratio standard */}
      <div className="relative w-full aspect-[3/2] overflow-hidden select-none bg-neutral-100 rounded-lg">
        
        {/* AFTER IMAGE (Retouched - Background) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={afterImage}
            alt={`${title} - Retouched`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover pointer-events-none"
            priority
          />
          <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white font-sans text-[8px] sm:text-[9px] tracking-widest uppercase px-2 py-0.5 z-20 rounded font-semibold">
            Retouched
          </span>
        </div>

        {/* BEFORE IMAGE (Original - Clipped via CSS clip-path) */}
        <div 
          className="absolute inset-0 w-full h-full z-10 border-r border-[#C9A86C]/40"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={`${title} - Raw`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover pointer-events-none"
            priority
          />
          <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white font-sans text-[8px] sm:text-[9px] tracking-widest uppercase px-2 py-0.5 z-20 rounded font-semibold">
            Original (Raw)
          </span>
        </div>

        {/* DRAG HANDLE BAR */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-[#C9A86C] z-30 cursor-ew-resize pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circle indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-[#C9A86C] flex items-center justify-center shadow-xl text-[#C9A86C] font-mono text-[10px] select-none group-hover/card:scale-105 transition-transform duration-300">
            ↔
          </div>
        </div>

        {/* DRAG CAPTURE ELEMENT (Standard HTML5 Input Range) */}
        <input 
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={e => setSliderPosition(+e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
          aria-label="Before and after image comparison slider"
        />
      </div>

      {/* Description Context */}
      <div className="mt-4 text-left px-1 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-lg text-[#1A1A1A] font-medium tracking-wide group-hover/card:text-[#C9A86C] transition-colors duration-300 mb-1">
            {title}
          </h4>
          {description && (
            <p className="text-neutral-500 font-sans text-[11px] sm:text-xs leading-relaxed max-w-sm">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
