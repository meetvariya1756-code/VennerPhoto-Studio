import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceGallery from '@/components/services/ServiceGallery';
import ServicePackages from '@/components/services/ServicePackages';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import { getServiceBySlug, getServices } from '@/lib/sanity.queries';
import { generateSiteMetadata } from '@/lib/metadata';

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

// Generate metadata dynamically from Sanity CMS seoTitle / seoDescription
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return {};

  return generateSiteMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${params.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-[#F9F7F4] text-[#1A1A1A] pb-24">
      {/* 1. Large background image overlay ServiceHero banner */}
      <ServiceHero service={service} />

      {/* 2. Detailed Service Overview & Narrative Description */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-2">
            Description
          </span>
          <h2 className="font-serif text-3xl font-light tracking-wide text-[#1A1A1A] mb-8">
            About the Collection
          </h2>
          <div className="w-12 h-[1px] bg-neutral-300 mb-8" />
          <p className="font-sans text-base sm:text-lg text-neutral-600 font-light leading-relaxed mb-12 max-w-3xl">
            {service.shortDescription}
          </p>

          {/* Simple Portable Text Block Rendering Fallback */}
          {service.fullDescription && service.fullDescription.length > 0 ? (
            <div className="text-left font-sans text-sm text-neutral-500 leading-relaxed max-w-2xl flex flex-col gap-4">
              {service.fullDescription.map((block: any, idx: number) => {
                if (block._type === 'block') {
                  const paragraphText = block.children?.map((c: any) => c.text).join('') || '';
                  return <p key={idx}>{paragraphText}</p>;
                }
                return null;
              })}
            </div>
          ) : (
            <p className="text-left font-sans text-sm text-neutral-500 leading-relaxed max-w-2xl">
              We focus on capturing raw authenticity and high-fashion aesthetics. Using state-of-the-art camera bodies, ultra-prime lenses, and custom color profiles, our photography sets an unrivaled benchmark in commercial and portrait imaging.
            </p>
          )}
        </div>
      </section>

      {/* 3. Visual Portfolio Gallery específico para o serviço */}
      <section className="py-16 md:py-20 border-t border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ServiceGallery gallery={service.gallery} serviceTitle={service.title} />
        </div>
      </section>

      {/* 4. Pricing / Packages tiers sheets */}
      <section className="py-16 md:py-20 border-t border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ServicePackages packages={service.packages} serviceSlug={service.slug.current} />
        </div>
      </section>

      {/* 5. Direct Booking Call-to-action bottom deck */}
      <section className="py-16 text-center border-t border-neutral-200/40 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">
          <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide mb-6">
            Ready to Capture Your Story?
          </h3>
          <Button variant="gold" size="lg" href={`/contact?service=${service.slug.current}`}>
            Reserve Your Session Now
          </Button>
        </div>
      </section>
    </div>
  );
}
