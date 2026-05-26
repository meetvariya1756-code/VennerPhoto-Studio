import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceGallery from '@/components/services/ServiceGallery';
import ServicePackages from '@/components/services/ServicePackages';
import SectionHeader from '@/components/ui/SectionHeader';
import { getServiceBySlug, getServices } from '@/lib/sanity.queries';
import { generateSiteMetadata } from '@/lib/metadata';
import { MOCK_DATA } from '@/lib/sanity';

// Allow dynamic rendering for any slug not in generateStaticParams
export const dynamicParams = true;

interface ServicePageProps {
  params: {
    slug: string;
  };
}

// Generate static params for Next.js to pre-compile all service pages
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((srv) => ({
    slug: srv.slug.current,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  // Try CMS first, fallback to mock data
  let service;
  try {
    service = await getServiceBySlug(params.slug);
  } catch {
    service = MOCK_DATA.services.find(s => s.slug.current === params.slug) as any;
  }
  if (!service) return {};
  return generateSiteMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${params.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  // Try CMS first, then fallback to mock data so pages are never blank
  let service;
  try {
    service = await getServiceBySlug(params.slug);
  } catch {
    service = null;
  }

  // If CMS returned null, check mock data before giving up
  if (!service) {
    const mockMatch = MOCK_DATA.services.find(s => s.slug.current === params.slug);
    if (mockMatch) {
      service = {
        ...mockMatch,
        heroImage: { _type: 'image' as const, asset: { _ref: `mock-srv-slug`, _type: 'reference' as const } }
      } as any;
    }
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-[#F9F7F4] text-[#1A1A1A] pb-24">
      {/* 1. Large background image overlay ServiceHero banner */}
      <ServiceHero service={service} />

      {/* 2. Detailed Service Overview & Narrative Description */}
      <section className="py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-2">
            About This Service
          </span>
          <h2 className="font-serif text-3xl font-light tracking-wide text-[#1A1A1A] mb-6">
            {service.title}
          </h2>
          <div className="w-12 h-[1px] bg-neutral-300 mb-6" />
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-3xl">
            {service.shortDescription}
          </p>

          {/* Full description blocks */}
          {service.fullDescription && service.fullDescription.length > 0 && (
            <div className="text-left font-sans text-sm text-neutral-500 leading-relaxed max-w-2xl flex flex-col gap-4 mt-8">
              {service.fullDescription.map((block: any, idx: number) => {
                if (block._type === 'block') {
                  const paragraphText = block.children?.map((c: any) => c.text).join('') || '';
                  return <p key={idx}>{paragraphText}</p>;
                }
                return null;
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Full Photo Gallery — primary focus of the page */}
      <section className="py-10 md:py-16 border-t border-neutral-200/40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ServiceGallery
            gallery={service.gallery}
            serviceTitle={service.title}
            serviceSlug={service.slug.current}
          />
        </div>
      </section>

      {/* 4. Pricing / Packages tiers sheets */}
      <section className="py-16 md:py-20 border-t border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ServicePackages packages={service.packages} serviceSlug={service.slug.current} />
        </div>
      </section>

      {/* 5. Direct Booking Call-to-action bottom deck */}
      <section className="py-16 border-t border-neutral-200/40 bg-[#1A1A1A] text-white text-center">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
          <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold">
            Book a Session
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide">
            Ready to Capture Your Story?
          </h3>
          <p className="text-neutral-400 font-sans text-sm leading-relaxed max-w-xl">
            Contact us to discuss your vision. We'll craft a personalised experience designed around your story.
          </p>
          <a
            href={`/contact?service=${service.slug.current}`}
            className="inline-block mt-2 bg-[#C9A86C] text-[#1A1A1A] font-sans text-xs tracking-widest uppercase font-semibold px-10 py-4 hover:bg-[#E5C483] active:scale-95 transition-all duration-300"
          >
            Reserve Your Session Now →
          </a>
        </div>
      </section>
    </div>
  );
}
