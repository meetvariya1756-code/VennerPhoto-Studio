import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col mb-12 md:mb-16',
        {
          'items-start text-left': align === 'left',
          'items-center text-center': align === 'center',
          'items-end text-right': align === 'right',
        },
        className
      )}
    >
      {subtitle && (
        <span className="text-[#C9A86C] font-sans text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-3">
          {subtitle}
        </span>
      )}
      <h2
        className={cn(
          'font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-wide',
          light ? 'text-white' : 'text-[#1A1A1A]'
        )}
      >
        {title}
      </h2>
      <div className="w-16 h-[2px] bg-[#C9A86C] mt-6" />
    </div>
  );
}
