'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  service_type?: string;
  quote: string;
  rating: number;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12 px-4 md:px-12">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-neutral-200/50 pointer-events-none z-0">
        <Quote className="w-20 h-20 text-[#C9A86C]/10" />
      </div>

      <div className="relative overflow-hidden bg-white border border-neutral-200/60 p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < current.rating
                      ? 'text-[#C9A86C] fill-current'
                      : 'text-neutral-200'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="font-serif text-lg md:text-xl text-neutral-700 italic leading-relaxed mb-8 max-w-2xl px-4">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Divider */}
            <div className="w-8 h-[1px] bg-[#C9A86C]/50 mb-4" />

            {/* Author details */}
            <span className="font-sans text-sm tracking-widest uppercase font-semibold text-[#1A1A1A]">
              {current.client_name}
            </span>
            {current.service_type && (
              <span className="text-xs text-neutral-400 font-sans tracking-wider uppercase mt-1">
                {current.service_type}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-[-16px] md:left-[-24px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-50 border border-neutral-200/80 hover:border-[#C9A86C]/50 text-neutral-700 hover:text-[#C9A86C] shadow-sm transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-16px] md:right-[-24px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-neutral-50 border border-neutral-200/80 hover:border-[#C9A86C]/50 text-neutral-700 hover:text-[#C9A86C] shadow-sm transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#C9A86C] w-4' : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
