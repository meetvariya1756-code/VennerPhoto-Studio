'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search, BookOpen, Tag } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import type { BlogPost } from '@/types';

interface BlogListClientProps {
  initialBlogs: BlogPost[];
}

export default function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialBlogs.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [initialBlogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter(blog => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        blog.title.toLowerCase().includes(query) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(query)) ||
        (blog.seo_keywords && blog.seo_keywords.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, selectedCategory, searchQuery]);

  // Separate featured post (first post) if no filter is applied
  const isDefaultView = selectedCategory === 'All' && !searchQuery;
  const featuredPost = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularPosts = isDefaultView ? filteredBlogs.slice(1) : filteredBlogs;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-neutral-200/80 pb-8">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-sans tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#C9A86C] font-semibold shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[#C9A86C]/40 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stories, tips & ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-full pl-10 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Featured Blog Banner (Hero Post) */}
      {featuredPost && (
        <div className="mb-16">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-[#C9A86C]/40 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[440px] overflow-hidden bg-neutral-900">
                <ImageWithFallback
                  src={featuredPost.featured_image_url || '/uploads/1788853159647_VAPW4871.jpg'}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1A1A1A]/90 backdrop-blur-md text-[#C9A86C] text-[10px] font-sans uppercase tracking-widest px-3 py-1 rounded-full border border-[#C9A86C]/30 font-semibold">
                    Featured Story
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 font-sans mb-4">
                    <span className="text-[#C9A86C] uppercase tracking-wider font-semibold">
                      {featuredPost.category || 'Photography'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featuredPost.published_at || featuredPost.created_at || '')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.reading_time || '5 min read'}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl lg:text-3xl text-[#1A1A1A] font-medium leading-snug group-hover:text-[#8C6D39] transition-colors mb-4">
                    {featuredPost.title}
                  </h2>

                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-4 mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#1A1A1A] group-hover:text-[#C9A86C] font-semibold pt-4 border-t border-neutral-100 transition-colors">
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Regular Posts */}
      {regularPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {regularPosts.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-xl overflow-hidden border border-neutral-200/80 hover:border-[#C9A86C]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <Link href={`/blog/${blog.slug}`} className="block relative h-56 overflow-hidden bg-neutral-900">
                <ImageWithFallback
                  src={blog.featured_image_url || '/uploads/1788853159647_VAPW4871.jpg'}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-[#1A1A1A]/90 backdrop-blur-sm text-[#C9A86C] text-[9px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold border border-[#C9A86C]/20">
                  {blog.category || 'Story'}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.published_at || blog.created_at || '')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.reading_time || '4 min read'}
                    </span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A] group-hover:text-[#8C6D39] transition-colors leading-snug line-clamp-2 mb-3">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3 mb-6">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C9A86C] font-semibold transition-colors"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {blog.seo_keywords && (
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                      <Tag className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">
                        {blog.seo_keywords.split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-neutral-200/80 mb-20">
          <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#1A1A1A] font-medium">No stories found</h3>
          <p className="text-neutral-500 text-xs mt-1">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      )}

      {/* Booking Consultation Call-to-Action */}
      <div className="bg-[#1A1A1A] text-white rounded-2xl p-8 md:p-14 relative overflow-hidden border border-neutral-800">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] text-[#C9A86C] uppercase tracking-[0.25em] font-sans font-semibold block mb-2">
            Venner Photo Studio
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-light tracking-wide mb-4 text-white">
            Ready to Capture Your Timeless Moments?
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-8">
            Whether planning an intimate pre-wedding shoot in Surat, a grand royal wedding, or high-fashion editorial portraits, let our creative lens immortalize your legacy.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] text-xs font-sans tracking-widest uppercase font-semibold px-8 py-3.5 rounded-none transition-all shadow-lg"
            >
              Book A Session
            </Link>
            <Link
              href="/portfolio"
              className="border border-white/20 hover:border-white text-white text-xs font-sans tracking-widest uppercase font-medium px-8 py-3.5 transition-all"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

