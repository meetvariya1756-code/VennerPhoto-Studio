'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ImageWithFallback from '../ui/ImageWithFallback';
import { TeamMember } from '@/types';

interface TeamPreviewProps {
  team: TeamMember[];
}

export default function TeamPreview({ team }: TeamPreviewProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
  };

  return (
    <section className="py-24 bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Master Artisans"
          subtitle="Meet Our Team"
          align="center"
          light
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {team.map((member, index) => (
            <motion.div
              key={member._id}
              variants={itemVariants}
              className="group flex flex-col items-center text-center"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl mb-6">
                <ImageWithFallback
                  src={member.photo}
                  fallbackType="avatar"
                  fallbackIndex={index}
                  alt={member.fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="group-hover:scale-103 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
                />

                {/* Social Instagram Float */}
                {member.instagramUrl && (
                  <a
                    href={member.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C9A86C] text-white hover:text-black flex items-center justify-center border border-white/10 hover:border-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0"
                    aria-label={`${member.fullName} Instagram`}
                  >
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>

              {/* Bio & Details */}
              <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-1">
                {member.role}
              </span>
              <h3 className="font-serif text-2xl font-light tracking-wide text-white mb-3">
                {member.fullName}
              </h3>
              <p className="text-neutral-400 font-sans text-sm leading-relaxed max-w-sm">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
