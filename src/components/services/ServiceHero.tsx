'use client';

import React from 'react';
import Image from 'next/image';
import { Service } from '@/types';

interface ServiceHeroProps {
  service: Service;
}

// Per-service hero images from Unsplash
const HERO_IMAGES: Record<string, string> = {
  'wedding-photography': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
  'engagement-photography': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85',
  'baby-shower-photography': 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1920&q=85',
  'children-photography': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1920&q=85',
  'indoor-studio-photography': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=85',
  'product-photography': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1920&q=85',
  'modeling-photography': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=85',
  'corporate-event-photography': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=85',
  'birthday-photography': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=85',
  'maternity-photography': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1920&q=85',
};

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85';

export default function ServiceHero({ service }: ServiceHeroProps) {
  const slug = service?.slug?.current || '';
  const heroUrl = service?.heroImage || HERO_IMAGES[slug] || DEFAULT_HERO;

  return (
    <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Frame */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={heroUrl}
          alt={service.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/50 z-[1]" />
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
