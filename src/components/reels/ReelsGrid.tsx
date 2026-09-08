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
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-10"
          onClick={() => setActiveVideoUrl(null)}
        >
          {/* Action buttons top bar */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 z-50">
            {/* Close button */}
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/15 transition-all focus:outline-none shadow-lg"
              aria-label="Close video player"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Reel Frame Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[9/16] max-h-[88vh] shadow-2xl overflow-hidden bg-black rounded-2xl border border-white/15 flex items-center justify-center"
          >
            <VideoPlayer
              src={activeVideoUrl}
              autoplay
              loop={true}
              muted={false}
              allowRotate={true}
              allowFitToggle={true}
              defaultFit="cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
