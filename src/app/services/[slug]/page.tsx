import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceHero from '@/components/services/ServiceHero';
import ServiceGallery from '@/components/services/ServiceGallery';
import ServicePackages from '@/components/services/ServicePackages';
import SectionHeader from '@/components/ui/SectionHeader';
import { getServiceBySlug, getServices } from '@/lib/db';
import { generateSiteMetadata } from '@/lib/metadata';
import { MOCK_DATA } from '@/lib/sanity';

// Allow dynamic rendering for any slug not in generateStaticParams
export const dynamicParams = true;

interface ServicePageProps {
  params: {
    slug: string;
  };
}

function normalizeService(srv: any) {
  if (!srv) return srv;
  return {
    ...srv,
    _id: srv.id || srv._id,
    slug: typeof srv.slug === 'object' && srv.slug ? srv.slug : { current: srv.slug },
    heroImage: srv.hero_image_url || srv.heroImage,
    shortDescription: srv.short_description || srv.shortDescription,
    fullDescription: srv.full_description 
      ? (Array.isArray(srv.full_description) 
          ? srv.full_description 
          : [{ _type: 'block', children: [{ text: srv.full_description }] }])
      : srv.fullDescription,
    isActive: srv.is_active !== undefined ? srv.is_active : srv.isActive,
    order: srv.display_order !== undefined ? srv.display_order : srv.order,
    packages: srv.packages
      ? srv.packages.map((pkg: any) => ({
          ...pkg,
          packageName: pkg.package_name || pkg.packageName,
          price: pkg.price,
          features: pkg.features || [],
        }))
      : undefined,
    gallery: srv.gallery
      ? srv.gallery.map((img: any) => ({
          ...img,
          image_url: img.image_url || img.image || (img.asset?._ref),
        }))
      : undefined,
  };
}

// Generate static params for Next.js to pre-compile all service pages
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((srv) => ({
    slug: typeof srv.slug === 'object' && srv.slug ? (srv.slug as any).current : srv.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  let service;
  try {
    const rawService = await getServiceBySlug(slug);
    service = normalizeService(rawService);
  } catch {
    service = MOCK_DATA.services.find(s => s.slug.current === slug) as any;
  }
  if (!service) return {};
  return generateSiteMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  let service;
  try {
    const rawService = await getServiceBySlug(slug);
    service = normalizeService(rawService);
  } catch {
    service = null;
  }

  // If CMS returned null, check mock data before giving up
  if (!service) {
    const mockMatch = MOCK_DATA.services.find(s => s.slug.current === slug);
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

      {/* 2. Full Photo Gallery — primary focus of the page */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ServiceGallery
            gallery={service.gallery}
            serviceTitle={service.title}
            serviceSlug={service.slug.current}
          />
        </div>
      </section>

      {/* 3. Direct Booking Call-to-action bottom deck */}
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
