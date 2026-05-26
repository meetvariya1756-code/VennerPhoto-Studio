'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

const LEGACY_METRICS = [
  {
    value: 'Since 2000',
    title: '26+ Years of Legacy',
    icon: <Trophy className="w-5 h-5 text-[#C9A86C]" />,
    description: 'Providing elite fine-art photography and cinematic services across Surat and beyond since 2000.',
  },
  {
    value: '10+ Types',
    title: 'Serviceable Specialties',
    icon: <ShieldCheck className="w-5 h-5 text-[#C9A86C]" />,
    description: 'Highly versatile, covering weddings, portfolios, modeling, product branding, studio work, and more.',
  },
  {
    value: '10,000+',
    title: 'Celebrated Clients',
    icon: <HeartHandshake className="w-5 h-5 text-[#C9A86C]" />,
    description: 'Trusted by thousands of families and brands to deliver timeless emotional narratives.',
  },
  {
    value: 'Gujarat & Beyond',
    title: 'Serviceable Regions',
    icon: <MapPin className="w-5 h-5 text-[#C9A86C]" />,
    description: 'Headquartered in Katargam, Surat, serving local regions and premier destination venues.',
  },
];

export default function ProcessSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="py-24 bg-[#1A1A1A] text-white border-t border-neutral-800/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Legacy & Serviceable Metrics Dashboard (Since 2000 & Serviceable Types) */}
        <div>
          <SectionHeader
            title="A Legacy of Vision"
            subtitle="Established Since 2000"
            align="center"
            light
          />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {LEGACY_METRICS.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 bg-neutral-900/20 border border-neutral-800/40 rounded-none text-center flex flex-col items-center hover:border-[#C9A86C]/20 hover:bg-neutral-900/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
                  {metric.icon}
                </div>
                <span className="font-serif text-3xl font-light text-[#C9A86C] tracking-wide mb-2">
                  {metric.value}
                </span>
                <h4 className="font-sans text-xs tracking-widest uppercase font-semibold text-white mb-3">
                  {metric.title}
                </h4>
                <p className="text-neutral-400 font-sans text-xs sm:text-sm leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
