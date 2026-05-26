import React from 'react';
import { Metadata } from 'next';
import ServiceCard from '@/components/services/ServiceCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getServices } from '@/lib/sanity.queries';

export const revalidate = 3600;

export const metadata: Metadata = generateSiteMetadata({
  title: 'Photography Collections & Services',
  description: 'View the complete photographic and motion services of Venner Photo Studio, from weddings to high-end commerce product shoots.',
  path: '/services',
});

export default async function ServicesOverviewPage() {
  const services = await getServices();

  return (
    <div className="pt-28 pb-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Creative Offerings"
          subtitle="Photography Collections"
          align="center"
        />

        {/* Dynamic services overview grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
