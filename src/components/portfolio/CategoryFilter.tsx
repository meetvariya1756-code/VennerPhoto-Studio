'use client';

import React from 'react';
import { createClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// Fallback portfolio category nodes when Supabase is not configured yet
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
  const [categories, setCategories] = React.useState(FALLBACK_CATEGORIES);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const isSupabaseConfigured =
          !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
          !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key';

        if (!isSupabaseConfigured) return;

        const sb = createClient();
        const { data, error } = await sb
          .from('services')
          .select('title, slug')
          .eq('is_active', true)
          .order('display_order');

        if (error) {
          console.error('Error fetching categories for filter:', error);
          return;
        }

        if (data && data.length > 0) {
          const dynamicCats = [
            { id: 'all', title: 'All' },
            ...data.map((s: any) => ({
              id: s.slug,
              title: s.title.replace(/\s+photography$/i, ''),
            })),
          ];
          setCategories(dynamicCats);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="w-full flex items-center justify-center overflow-x-auto pb-4 mb-12 scrollbar-hide">
      <div
        className={cn(
          'flex items-center gap-1 p-1.5 md:p-2 max-w-full rounded-none border',
          darkBg
            ? 'bg-neutral-900/60 border-neutral-800'
            : 'bg-[#1A1A1A]/5 border-neutral-200/50'
        )}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'whitespace-nowrap px-4 py-2 font-sans text-xs tracking-wider uppercase font-medium transition-all duration-300 focus:outline-none rounded-none',
                isActive
                  ? darkBg
                    ? 'bg-[#C9A86C] text-black shadow-sm'
                    : 'bg-[#1A1A1A] text-white shadow-sm'
                  : darkBg
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-500 hover:text-[#1A1A1A]'
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
