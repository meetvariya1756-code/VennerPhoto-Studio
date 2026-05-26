'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Hero } from '@/types';

interface HeroSectionProps {
  heroes: Hero[];
}

export default function HeroSection({ heroes }: HeroSectionProps) {
  const rawHero = heroes && heroes.length > 0 ? heroes[0] : null;

  const hero = {
    title: rawHero ? rawHero.title : 'Chasing the Light, Capturing the Soul',
    subtitle: rawHero ? rawHero.subtitle : 'Premium editorial, wedding, and commercial photography tailored to your story.',
    ctaButtonText: rawHero ? (rawHero.cta_text || (rawHero as any).ctaButtonText) : 'Book Your Session',
    ctaButtonLink: rawHero ? (rawHero.cta_link || (rawHero as any).ctaButtonLink) : '/contact',
    backgroundImage: rawHero ? (rawHero.background_image_url || (rawHero as any).backgroundImage) : undefined,
    backgroundVideoUrl: rawHero ? (rawHero as any).backgroundVideoUrl : undefined,
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full z-0">
        {hero.backgroundVideoUrl ? (
          <video
            src={hero.backgroundVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          />
        ) : (
          <ImageWithFallback
            src={hero.backgroundImage}
            fallbackType="hero"
            fallbackIndex={0}
            alt="Venner Photo Studio Hero Showcase"
            fill
            priority
            className="opacity-65 object-cover"
          />
        )}
        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30 z-1" />
        <div className="absolute inset-0 bg-black/15 z-1" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col justify-center text-left">
        <div className="max-w-3xl">
          {/* Subtle gold tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-[1px] bg-[#C9A86C]" />
            <span className="text-[#C9A86C] font-sans text-xs md:text-sm font-semibold tracking-[0.3em] uppercase">
              Venner Photo Studio
            </span>
          </motion.div>

          {/* Majestic Serif Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1] mb-6"
          >
            {hero.title}
          </motion.h1>

          {/* Elegantly spaced body description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="font-sans text-sm sm:text-base md:text-lg text-neutral-200 font-light leading-relaxed mb-10 max-w-2xl"
          >
            {hero.subtitle || 'Bespoke editorial portfolios, high-fashion campaigns, and destination wedding captures engineered with unmatched passion.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            <Button variant="gold" size="lg" href={hero.ctaButtonLink || '/contact'}>
              {hero.ctaButtonText || 'Book Session'}
            </Button>
            <Button variant="outline" size="lg" href="/portfolio">
              Explore Work
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative vertical gold scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] text-white/40 tracking-[0.25em] uppercase font-sans [writing-mode:vertical-lr] select-none">
          Scroll Down
        </span>
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 top-0 w-full h-1/2 bg-[#C9A86C]"
          />
        </div>
      </div>
    </section>
  );
}
