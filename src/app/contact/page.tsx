import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import StudioInfo from '@/components/contact/StudioInfo';
import SectionHeader from '@/components/ui/SectionHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { generateSiteMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateSiteMetadata({
  title: 'Book a Session',
  description: 'Connect with Venner Photo Studio to schedule a booking, consult on customized rates, or request studio availability.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Begin Your Journey"
          subtitle="Contact Venner Studio"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-12">
          {/* Left Column: Form with Suspense for useSearchParams */}
          <Suspense fallback={<LoadingSpinner size="md" className="py-24" />}>
            <ContactForm />
          </Suspense>

          {/* Right Column: HQ Address and Coordinates */}
          <StudioInfo />
        </div>
      </div>
    </div>
  );
}
