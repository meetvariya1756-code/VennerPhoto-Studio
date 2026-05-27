import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import ReelsPreview from '@/components/home/ReelsPreview';
import AutoScrollingReels from '@/components/home/AutoScrollingReels';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import ProcessSection from '@/components/home/ProcessSection';
import ContactCTA from '@/components/home/ContactCTA';
import SectionHeader from '@/components/ui/SectionHeader';
import { Star } from 'lucide-react';
import {
  getHeroes,
  getServices,
  getFeaturedPortfolioPhotos,
  getReels,
  getTestimonials,
} from '@/lib/db';

export const revalidate = 0;

export default async function HomePage() {
  const [heroes, rawServices, photos, reels, testimonials] = await Promise.all([
    getHeroes(),
    getServices(),
    getFeaturedPortfolioPhotos(),
    getReels(),
    getTestimonials(),
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
      <AutoScrollingReels reels={mappedReels as any} />
      <PortfolioPreview photos={mappedPhotos as any} />
      <ProcessSection />

      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-[#F9F7F4] text-[#1A1A1A] border-t border-neutral-200/40">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader title="Client Testimonials" subtitle="Voices of Trust" align="center" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-200/50 p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#C9A86C] fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-600 font-sans text-sm leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-col">
                    <span className="font-serif text-base font-medium text-[#1A1A1A]">
                      {item.client_name}
                    </span>
                    {item.service_type && (
                      <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider mt-0.5">
                        {item.service_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCTA />
    </div>
  );
}
