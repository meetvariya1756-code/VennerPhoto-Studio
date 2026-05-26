'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReelCard from './ReelCard';
import VideoPlayer from '../ui/VideoPlayer';
import CategoryFilter from '../portfolio/CategoryFilter';
import { Reel } from '@/types';

interface ReelsGridProps {
  reels: Reel[];
}

export default function ReelsGrid({ reels }: ReelsGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Filter reels by selected category
  const filteredReels = reels.filter((reel) => {
    if (activeCategory === 'all') return true;
    return reel.category === activeCategory;
  });

  return (
    <div className="w-full">
      {/* Category selector */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredReels.map((reel, index) => (
            <motion.div
              key={reel._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ReelCard
                reel={reel}
                index={index}
                onClick={() => setActiveVideoUrl(reel.videoUrl)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Full-Screen Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12">
          {/* Close button */}
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all z-50 focus:outline-none"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Reel Frame Container (portrait ratio) */}
          <div className="relative w-full max-w-lg aspect-[9/16] max-h-[85vh] shadow-2xl overflow-hidden bg-black">
            <VideoPlayer src={activeVideoUrl} autoplay loop={false} muted={false} />
          </div>
        </div>
      )}
    </div>
  );
}
