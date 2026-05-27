'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../ui/SectionHeader';
import ImageWithFallback from '../ui/ImageWithFallback';
import VideoPlayer from '../ui/VideoPlayer';
import { Reel } from '@/types';

interface ReelsPreviewProps {
  reels: Reel[];
}

export default function ReelsPreview({ reels }: ReelsPreviewProps) {
  const featuredReels = reels.filter(r => r.isFeatured).slice(0, 3);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } }
  };

  return (
    <section className="py-24 bg-[#1A1A1A] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Cinematic Motion"
          subtitle="Featured Video Reels"
          align="center"
          light
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredReels.map((reel, index) => (
            <motion.div
              key={reel._id}
              variants={itemVariants}
              onClick={() => setActiveVideoUrl(reel.videoUrl)}
              className="group cursor-pointer relative aspect-[9/16] overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl hover:border-[#C9A86C]/50 transition-all duration-500"
            >
              {/* Thumbnail image or live video */}
              {reel.thumbnailImage ? (
                <ImageWithFallback
                  src={reel.thumbnailImage}
                  fallbackType="video-thumb"
                  fallbackIndex={index}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <video
                  src={reel.videoUrl}
                  preload="metadata"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}

              {/* Glowing play overlay on hover */}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-8">
                <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold">
                  {reel.category.replace('-', ' ')}
                </span>

                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:bg-[#C9A86C] group-hover:text-black group-hover:border-transparent group-hover:scale-110 active:scale-95 transition-all duration-300">
                    <Play className="w-5 h-5 fill-current ml-1" />
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="font-serif text-xl font-light tracking-wide text-white group-hover:text-[#C9A86C] transition-colors leading-snug">
                    {reel.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Reels CTA */}
        <div className="flex justify-center mt-16">
          <Link
            href="/reels"
            className="group inline-flex items-center gap-4 py-4 px-10 border border-white/20 hover:border-[#C9A86C] text-[#C9A86C] transition-all duration-300 font-sans text-xs font-medium tracking-[0.2em] uppercase bg-transparent"
          >
            Explore Cinematic Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-white" />
          </Link>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12">
          {/* Close button */}
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all z-50 focus:outline-none"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Container */}
          <div className="relative w-full max-w-lg aspect-[9/16] max-h-[85vh] shadow-2xl rounded-none overflow-hidden">
            <VideoPlayer src={activeVideoUrl} autoplay loop={false} muted={false} />
          </div>
        </div>
      )}
    </section>
  );
}
