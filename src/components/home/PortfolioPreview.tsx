'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ImageWithFallback from '../ui/ImageWithFallback';
import { PortfolioPhoto } from '@/types';

interface PortfolioPreviewProps {
  photos: PortfolioPhoto[];
}

export default function PortfolioPreview({ photos }: PortfolioPreviewProps) {
  // Take first 6 photos as featured preview
  const featuredPhotos = photos.slice(0, 6);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
  };

  return (
    <section className="py-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Bespoke Portfolio"
          subtitle="Our Work"
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {featuredPhotos.map((photo, index) => (
            <motion.div
              key={photo._id}
              variants={itemVariants}
              className="group relative aspect-square overflow-hidden bg-neutral-200 border border-neutral-200/50 shadow-sm cursor-pointer"
            >
              <Link href="/portfolio">
                {/* Image item with zoom effect */}
                <ImageWithFallback
                  src={photo.image}
                  fallbackType="photo"
                  fallbackIndex={index}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-400 flex flex-col justify-end p-8" />

                {/* Text Content Overlay */}
                <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col items-start text-white">
                  <span className="text-[#C9A86C] font-sans text-xs tracking-wider uppercase font-semibold mb-1">
                    {photo.category.replace('-photography', '')}
                  </span>
                  <h3 className="font-serif text-2xl font-light tracking-wide leading-tight">
                    {photo.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#C9A86C] mt-3 group-hover:w-16 transition-all duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Work button */}
        <div className="flex justify-center mt-16">
          <Link
            href="/portfolio"
            className="group relative inline-flex items-center gap-4 py-4 px-10 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 font-sans text-xs font-medium tracking-[0.2em] uppercase"
          >
            Explore Full Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
