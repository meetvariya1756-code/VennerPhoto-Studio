import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import ReelsPreview from '@/components/home/ReelsPreview';
import PortfolioPreview from '@/components/home/PortfolioPreview';
import TeamPreview from '@/components/home/TeamPreview';
import ContactCTA from '@/components/home/ContactCTA';
import SectionHeader from '@/components/ui/SectionHeader';
import { Star } from 'lucide-react';

import {
  getHeroes,
  getServices,
  getFeaturedPortfolioPhotos,
  getReels,
  getTeamMembers,
  getFeaturedTestimonials,
} from '@/lib/sanity.queries';

// Configure dynamic rendering
export const revalidate = 3600; // Revalidate page hourly

export default async function HomePage() {
  // Fetch CMS or mock structures in parallel
  const [heroes, services, photos, reels, team, testimonials] = await Promise.all([
    getHeroes(),
    getServices(),
    getFeaturedPortfolioPhotos(),
    getReels(),
    getTeamMembers(),
    getFeaturedTestimonials(),
  ]);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Fullscreen video/image Hero banner */}
      <HeroSection heroes={heroes} />

      {/* 2. Structured service offerings grid */}
      <ServicesGrid services={services} />

      {/* 3. Landscape cinematic video reels preview */}
      <ReelsPreview reels={reels} />

      {/* 4. Fine-art masonry photo portfolio grid */}
      <PortfolioPreview photos={photos} />

      {/* 5. Master artisans and retouchers biography slides */}
      <TeamPreview team={team} />

      {/* 6. Testimonials Deck */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-[#F9F7F4] text-[#1A1A1A] border-t border-neutral-200/40">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              title="Client Testimonials"
              subtitle="Voices of Trust"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.slice(0, 3).map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-white border border-neutral-200/50 p-8 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-[#C9A86C] fill-current" />
                      ))}
                    </div>
                    {/* Quote text */}
                    <p className="text-neutral-600 font-sans text-sm leading-relaxed italic">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-col">
                    <span className="font-serif text-base font-medium text-[#1A1A1A]">
                      {item.clientName}
                    </span>
                    {item.serviceType && (
                      <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider mt-0.5">
                        {item.serviceType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Dark gold Call-to-action closing banner */}
      <ContactCTA />
    </div>
  );
}
