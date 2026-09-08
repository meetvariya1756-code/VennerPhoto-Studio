'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK_CATEGORIES = [
  { id: 'all', title: 'All' },
  { id: 'wedding-photography', title: 'Wedding' },
  { id: 'engagement-photography', title: 'Engagement' },
  { id: 'baby-shower-photography', title: 'Baby Shower' },
  { id: 'children-photography', title: 'Children' },
  { id: 'indoor-studio-photography', title: 'Indoor Studio' },
  { id: 'product-photography', title: 'Product' },
  { id: 'modeling-photography', title: 'Modeling' },
  { id: 'corporate-event-photography', title: 'Corporate' },
  { id: 'birthday-photography', title: 'Birthday' },
  { id: 'maternity-photography', title: 'Maternity' },
];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  darkBg?: boolean;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  darkBg = false,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const dynamicCats = [
              { id: 'all', title: 'All' },
              ...data.map((s: any) => ({
                id: s.slug,
                title: s.title.replace(/\s+photography$/i, ''),
              })),
            ];
            setCategories(dynamicCats);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full flex justify-center mb-10 px-2 sm:px-4">
      <div
        className={cn(
          'flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2.5 max-w-6xl rounded-2xl border transition-all duration-300',
          darkBg
            ? 'bg-black/60 border-white/10 backdrop-blur-md shadow-2xl'
            : 'bg-white/95 border-neutral-200/80 backdrop-blur-md shadow-sm'
        )}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer select-none font-medium',
                isActive
                  ? darkBg
                    ? 'bg-[#C9A86C] text-[#1A1A1A] font-semibold shadow-md scale-[1.02]'
                    : 'bg-[#1A1A1A] text-[#C9A86C] font-semibold shadow-md scale-[1.02]'
                  : darkBg
                  ? 'text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'text-neutral-600 hover:text-[#1A1A1A] hover:bg-neutral-100'
              )}
            >
              {cat.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
