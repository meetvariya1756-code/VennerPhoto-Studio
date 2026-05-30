'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import BeforeAfterSlider from './BeforeAfterSlider';
import { BeforeAfterComparison } from '@/lib/db';

interface BeforeAfterSectionProps {
  comparisons: BeforeAfterComparison[];
}

export default function BeforeAfterSection({ comparisons }: BeforeAfterSectionProps) {
  // Safe filter of active elements
  const activeComparisons = comparisons && comparisons.length > 0 
    ? comparisons.filter(x => x.is_active !== false)
    : [];

  if (activeComparisons.length === 0) return null;

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
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: 'easeOut' as const } 
    },
  };

  return (
    <section className="py-24 bg-white text-[#1A1A1A] border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Creative Retouching Showcase"
          subtitle="Before & After Comparisons"
          align="center"
        />

        <p className="text-center text-neutral-500 font-sans text-xs sm:text-sm max-w-lg mx-auto mb-16 -mt-6 leading-relaxed">
          Drag the center handle on any image below to reveal the cinematic color grading, skin smoothing, and detail recovery details.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {activeComparisons.map((comparison, index) => (
            <motion.div 
              key={comparison.id || index} 
              variants={itemVariants}
            >
              <BeforeAfterSlider
                beforeImage={comparison.before_image_url}
                afterImage={comparison.after_image_url}
                title={comparison.title}
                description={comparison.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
