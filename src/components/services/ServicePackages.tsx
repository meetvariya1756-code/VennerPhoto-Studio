'use client';

import React from 'react';
import { Check } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import { ServicePackage } from '@/types';

interface ServicePackagesProps {
  packages?: ServicePackage[];
  serviceSlug: string;
}

export default function ServicePackages({ packages, serviceSlug }: ServicePackagesProps) {
  // If packages list is empty, display premium defaults
  const tiers = packages && packages.length > 0 ? packages : [
    {
      packageName: 'Essential Session',
      price: '$500',
      features: ['2 Hours of Dedicated Session Coverage', '1 Active Professional Photographer', '30 Retouched High-Res Images', 'Private Digital Download Access']
    },
    {
      packageName: 'Elite Collection',
      price: '$1,200',
      features: ['5 Hours of Comprehensive Session Coverage', 'Multiple Wardrobe / Style Toggles', '75 Deluxe Retouched High-Res Images', '1 Premium Matte Linen Printed Book']
    }
  ];

  return (
    <div className="w-full">
      <SectionHeader
        title="Investment Options"
        subtitle="Pricing & Packages"
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
        {tiers.map((tier, index) => {
          const isFeatured = index === 1; // Mark second tier as featured / popular

          return (
            <div
              key={tier.packageName}
              className={`p-8 md:p-10 flex flex-col justify-between text-left transition-all duration-300 border ${
                isFeatured
                  ? 'border-[#C9A86C] bg-white shadow-xl relative scale-100 md:scale-[1.02]'
                  : 'border-neutral-200 bg-neutral-50/50 hover:bg-white'
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3.5 left-8 bg-[#C9A86C] text-[#1A1A1A] text-[9px] tracking-[0.2em] font-semibold uppercase px-4 py-1">
                  Most Popular
                </span>
              )}

              <div>
                <span className="text-neutral-400 font-sans text-xs tracking-widest uppercase font-semibold block mb-1">
                  Tier {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl font-light tracking-wide text-[#1A1A1A] mb-4">
                  {tier.packageName}
                </h3>
                <div className="flex items-baseline gap-2 mb-8 border-b border-neutral-100 pb-6">
                  <span className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#1A1A1A]">
                    {tier.price}
                  </span>
                  <span className="text-xs text-neutral-400 font-sans tracking-wide">/ Session</span>
                </div>

                <ul className="flex flex-col gap-4 mb-10">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-neutral-600 text-sm">
                      <Check className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={isFeatured ? 'gold' : 'primary'}
                href={`/contact?service=${serviceSlug}&package=${encodeURIComponent(tier.packageName)}`}
                className="w-full"
              >
                Inquire & Book
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
