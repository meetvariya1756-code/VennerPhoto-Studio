'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../ui/ImageWithFallback';
import PhotoLightbox from '../portfolio/PhotoLightbox';
import SectionHeader from '../ui/SectionHeader';
import { SanityImage, PortfolioPhoto } from '@/types';

interface ServiceGalleryProps {
  gallery?: SanityImage[];
  serviceTitle: string;
}

export default function ServiceGallery({ gallery, serviceTitle }: ServiceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // If gallery is empty or missing, create mock gallery images
  const images = gallery && gallery.length > 0 ? gallery : [
    { _type: 'image' as const, asset: { _ref: 'mg1', _type: 'reference' as const } },
    { _type: 'image' as const, asset: { _ref: 'mg2', _type: 'reference' as const } },
    { _type: 'image' as const, asset: { _ref: 'mg3', _type: 'reference' as const } },
    { _type: 'image' as const, asset: { _ref: 'mg4', _type: 'reference' as const } },
    { _type: 'image' as const, asset: { _ref: 'mg5', _type: 'reference' as const } },
    { _type: 'image' as const, asset: { _ref: 'mg6', _type: 'reference' as const } }
  ];

  // Convert SanityImage list to PortfolioPhoto structure to satisfy Lightbox Props
  const portfolioPhotos: PortfolioPhoto[] = images.map((img, i) => ({
    _id: `gimg-${i}`,
    title: `${serviceTitle} Showcase ${i + 1}`,
    image: img as any,
    category: serviceTitle.toLowerCase().replace(' ', '-'),
    isFeatured: false
  }));

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % portfolioPhotos.length;
    });
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + portfolioPhotos.length) % portfolioPhotos.length;
    });
  };

  return (
    <div className="w-full">
      <SectionHeader
        title="Visual Showcase"
        subtitle="Selected Frames"
        align="center"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div
            key={`gal-${index}`}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden bg-neutral-200 border border-neutral-200/50 cursor-pointer shadow-sm"
          >
            <ImageWithFallback
              src={img}
              fallbackType="photo"
              fallbackIndex={index}
              alt={`${serviceTitle} Showcase Frame ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Trigger overlay */}
      {lightboxIndex !== null && portfolioPhotos[lightboxIndex] && (
        <PhotoLightbox
          photo={portfolioPhotos[lightboxIndex]}
          index={lightboxIndex}
          total={portfolioPhotos.length}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
