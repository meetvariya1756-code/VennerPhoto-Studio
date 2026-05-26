'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function ContactCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[#1A1A1A] text-white overflow-hidden border-t border-neutral-800">
      {/* Background Graphic Flare */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
        <div className="w-[500px] h-[500px] rounded-full border-[10px] border-[#C9A86C]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Subtle separator */}
        <div className="w-12 h-[1px] bg-[#C9A86C] mb-8" />

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight mb-6 max-w-3xl"
        >
          Let’s Create Something <span className="italic text-[#C9A86C]">Timeless</span> Together
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-sans text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed mb-10 max-w-xl"
        >
          Whether a destination wedding, an editorial lookbook, or high-fashion brand campaign—our lens is dedicated to documenting your luxury legacy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button variant="gold" size="lg" href="/contact">
            Begin Your Journey
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
