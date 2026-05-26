'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryFilter from './CategoryFilter';
import PhotoLightbox from './PhotoLightbox';
import ImageWithFallback from '../ui/ImageWithFallback';
import Button from '../ui/Button';
import { PortfolioPhoto } from '@/types';

interface PortfolioGridProps {
  photos: PortfolioPhoto[];
}

export default function PortfolioGrid({ photos }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(9); // Show 9 initially

  // Filter photos by selected category
  const filteredPhotos = photos.filter((photo) => {
    if (activeCategory === 'all') return true;
    return photo.category === activeCategory;
  });

  // Paginated visible photos
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredPhotos.length;
    });
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredPhotos.length) % filteredPhotos.length;
    });
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={(catId) => {
          setActiveCategory(catId);
          setVisibleCount(9); // Reset pagination on category swap
        }}
      />

      {/* Grid Container */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visiblePhotos.map((photo, index) => (
            <motion.div
              key={photo._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="group aspect-[3/4] relative overflow-hidden bg-neutral-200 border border-neutral-200/50 cursor-pointer shadow-sm"
              onClick={() => {
                // Find actual index in filtered list
                const actualIndex = filteredPhotos.findIndex((p) => p._id === photo._id);
                setLightboxIndex(actualIndex >= 0 ? actualIndex : null);
              }}
            >
              {/* Cover Image */}
              <ImageWithFallback
                src={photo.image}
                fallbackType="photo"
                fallbackIndex={index}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Cover Dark Glass Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Cover Text */}
              <div className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 text-white transform translate-y-3 group-hover:translate-y-0">
                <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-1 block">
                  {photo.category.replace('-photography', '').replace('-', ' ')}
                </span>
                <h4 className="font-serif text-lg md:text-xl font-light tracking-wide leading-tight">
                  {photo.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {filteredPhotos.length > visibleCount && (
        <div className="flex justify-center mt-16">
          <Button
            variant="outline"
            className="border-neutral-800 text-neutral-800 hover:bg-[#1A1A1A] hover:text-white"
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            Load More Work
          </Button>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <PhotoLightbox
          photo={filteredPhotos[lightboxIndex]}
          index={lightboxIndex}
          total={filteredPhotos.length}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
