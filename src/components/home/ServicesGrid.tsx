'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ImageWithFallback from '../ui/ImageWithFallback';
import { Service } from '@/types';

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  // Show only first 6 or all on homepage for premium balance
  const featuredServices = services.slice(0, 6);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section className="py-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Photography Offerings"
          subtitle="Bespoke Creative Services"
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {featuredServices.map((service, index) => (
            <motion.div key={service._id || index} variants={itemVariants} className="group relative">
              <Link
                href={`/services/${service.slug.current}`}
                className="block relative aspect-[4/5] overflow-hidden bg-neutral-200 border border-neutral-200/50 shadow-sm"
              >
                {/* Background Shimmer & Fallback Image */}
                <ImageWithFallback
                  src={service.heroImage}
                  fallbackType="photo"
                  fallbackIndex={index}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Darker Vignette on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                  <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-2xl font-light tracking-wide mb-3 group-hover:text-[#C9A86C] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-neutral-300 font-sans text-xs leading-relaxed line-clamp-2 max-w-sm mb-5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {service.shortDescription}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C9A86C] group-hover:translate-x-2 transition-transform duration-300">
                    Discover Package
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-4 py-4 px-10 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 font-sans text-xs font-medium tracking-[0.2em] uppercase"
          >
            Explore All Offerings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
