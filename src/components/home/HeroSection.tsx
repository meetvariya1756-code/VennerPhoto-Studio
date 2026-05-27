'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Hero } from '@/types';

interface HeroSectionProps {
  heroes: Hero[];
}

export default function HeroSection({ heroes }: HeroSectionProps) {
  // Safe filtering of active heroes
  const activeHeroes = heroes && heroes.length > 0 
    ? heroes.filter(h => h.isActive !== false) 
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds if there are multiple banners
  useEffect(() => {
    if (activeHeroes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeHeroes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeHeroes.length]);

  const handlePrev = () => {
    if (activeHeroes.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeHeroes.length) % activeHeroes.length);
  };

  const handleNext = () => {
    if (activeHeroes.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeHeroes.length);
  };

  const currentHero = activeHeroes.length > 0 ? activeHeroes[currentIndex] : null;

  const hero = {
    title: currentHero ? currentHero.title : 'Chasing the Light, Capturing the Soul',
    subtitle: currentHero ? currentHero.subtitle : 'Premium editorial, wedding, and commercial photography tailored to your story.',
    ctaButtonText: currentHero ? ((currentHero as any).cta_text || (currentHero as any).ctaButtonText) : 'Book Your Session',
    ctaButtonLink: currentHero ? ((currentHero as any).cta_link || (currentHero as any).ctaButtonLink) : '/contact',
    backgroundImage: currentHero ? ((currentHero as any).background_image_url || (currentHero as any).backgroundImage) : undefined,
    backgroundVideoUrl: currentHero ? (currentHero as any).backgroundVideoUrl : undefined,
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero ? ((currentHero as any).id || currentHero._id) : 'default'}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {hero.backgroundVideoUrl ? (
              <video
                src={hero.backgroundVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageWithFallback
                src={hero.backgroundImage}
                fallbackType="hero"
                fallbackIndex={currentIndex % 5}
                alt="Venner Photo Studio Hero Showcase"
                fill
                priority
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-1" />
        <div className="absolute inset-0 bg-black/10 z-1" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-10 md:px-8 w-full flex flex-col justify-center text-left">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero ? ((currentHero as any).id || currentHero._id) : 'default-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Majestic Serif Heading */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-[1.2] mb-5">
                {hero.title}
              </h1>

              {/* Elegantly spaced body description */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-200/90 font-light leading-relaxed mb-8 max-w-xl">
                {hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button variant="gold" size="md" href={hero.ctaButtonLink || '/contact'}>
                  {hero.ctaButtonText || 'Book Session'}
                </Button>
                <Button variant="outline" size="md" href="/portfolio">
                  Explore Work
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeHeroes.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 border border-white/10 hover:border-[#C9A86C]/50 text-white/70 hover:text-[#C9A86C] transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 border border-white/10 hover:border-[#C9A86C]/50 text-white/70 hover:text-[#C9A86C] transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Premium Slider Navigation Dots */}
      {activeHeroes.length > 1 && (
        <div className="absolute bottom-10 right-8 md:right-12 z-20 flex gap-2">
          {activeHeroes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#C9A86C] w-6' : 'bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative vertical gold scroll indicator */}
      <div className="absolute bottom-10 left-8 md:left-12 z-10 flex flex-col items-center gap-3">
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
