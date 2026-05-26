'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import Button from '../ui/Button';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div className="group bg-white border border-neutral-200/60 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-neutral-200 transition-all duration-500 rounded-none">
      {/* Visual cover */}
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={service.heroImage}
          fallbackType="photo"
          fallbackIndex={index}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-85" />
        <span className="absolute bottom-4 left-6 text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold">
          COLLECTION {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Body card text */}
      <div className="p-8 flex-1 flex flex-col justify-between text-left">
        <div>
          <h3 className="font-serif text-2xl font-light tracking-wide text-[#1A1A1A] group-hover:text-[#C9A86C] transition-colors mb-3">
            {service.title}
          </h3>
          <p className="text-neutral-500 font-sans text-sm leading-relaxed mb-6">
            {service.shortDescription}
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <Link
            href={`/services/${service.slug.current}`}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] hover:text-[#C9A86C] hover:translate-x-1.5 transition-all duration-300"
          >
            Learn More
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Button variant="outline" size="sm" href={`/contact?service=${service.slug.current}`} className="border-neutral-200 hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white">
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}
