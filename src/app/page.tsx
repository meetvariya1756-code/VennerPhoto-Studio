import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import ReelsPreview from '@/components/home/ReelsPreview';
import AutoScrollingReels from '@/components/home/AutoScrollingReels';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import ProcessSection from '@/components/home/ProcessSection';
import ContactCTA from '@/components/home/ContactCTA';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import BeforeAfterSection from '@/components/home/BeforeAfterSection';
import WeddingHighlightsSection from '@/components/home/WeddingHighlightsSection';
import {
  getHeroes,
  getServices,
  getFeaturedPortfolioPhotos,
  getReels,
  getTestimonials,
  getBeforeAfterComparisons,
  getWeddingHighlights,
} from '@/lib/db';

export const revalidate = 0;

export default async function HomePage() {
  const [heroes, rawServices, photos, reels, testimonials, comparisons, highlights] = await Promise.all([
    getHeroes(),
    getServices(),
    getFeaturedPortfolioPhotos(),
    getReels(),
    getTestimonials(),
    getBeforeAfterComparisons(),
    getWeddingHighlights(),
  ]);

  const services = rawServices.map((srv: any) => ({
    ...srv,
    _id: srv.id || srv._id,
    slug: typeof srv.slug === 'object' && srv.slug ? srv.slug : { current: srv.slug },
    heroImage: srv.hero_image_url || srv.heroImage,
    shortDescription: srv.short_description || srv.shortDescription,
  }));

  const mappedReels = reels.map((r: any) => ({
    ...r,
    _id: r.id || r._id,
    videoUrl: r.video_url || r.videoUrl,
    thumbnailImage: r.thumbnail_url || r.thumbnailImage,
    isFeatured: r.is_featured !== undefined ? r.is_featured : r.isFeatured,
  }));

  const mappedPhotos = photos.map((p: any) => ({
    ...p,
    _id: p.id || p._id,
    image: p.image_url || p.image,
    isFeatured: p.is_featured !== undefined ? p.is_featured : p.isFeatured,
  }));

  return (
    <div className="w-full flex flex-col">
      <HeroSection heroes={heroes as any} />
      <ServicesGrid services={services as any} />
      <WeddingHighlightsSection highlights={highlights} />
      <BeforeAfterSection comparisons={comparisons} />
      <AutoScrollingReels reels={mappedReels as any} />
      <PortfolioPreview photos={mappedPhotos as any} />
      <ProcessSection />

      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-[#F9F7F4] text-[#1A1A1A] border-t border-neutral-200/40 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-center tracking-wide text-[#1A1A1A]">
              Voices of Trust
            </h2>
            <p className="text-[#C9A86C] font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-center mt-3 mb-10">
              Client Testimonials
            </p>
            <TestimonialSlider testimonials={testimonials as any} />
          </div>
        </section>
      )}

      <ContactCTA />
    </div>
  );
}
