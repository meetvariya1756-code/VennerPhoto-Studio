import React from 'react';
import { Metadata } from 'next';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/db';

export const revalidate = 86400; // Edge cached for 24 hours, revalidated on-demand when admin updates settings

export const metadata: Metadata = generateSiteMetadata({
  title: 'Privacy Policy & Studio Terms',
  description: 'Read the privacy policy, visual copyrights, and photography session terms of Venner Photo Studio.',
  path: '/policy',
});

export default async function PolicyPage() {
  const settings = await getSiteSettings();
  
  // Clean policy formatting - split raw text by double newlines to render structured paragraphs and headers
  const policyText = settings.privacy_policy || '';
  const paragraphs = policyText.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="pt-32 pb-24 bg-[#F9F7F4] text-[#1A1A1A] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Privacy Policy & Terms"
          subtitle="Studio Guidelines"
          align="center"
        />

        <div className="bg-white border border-neutral-200/60 p-8 md:p-12 shadow-md mt-12 font-sans text-neutral-600 text-sm leading-relaxed max-w-none">
          {paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((para, idx) => {
                const trimmed = para.trim();
                
                // Render headers formatted with Markdown (### or #### or ##)
                if (trimmed.startsWith('####')) {
                  return (
                    <h4 key={idx} className="font-serif text-[#1A1A1A] font-semibold text-sm sm:text-base uppercase tracking-wider mt-6 mb-2 border-l-2 border-[#C9A86C] pl-3">
                      {trimmed.replace(/^####\s*/, '')}
                    </h4>
                  );
                }
                if (trimmed.startsWith('###')) {
                  return (
                    <h3 key={idx} className="font-serif text-[#1A1A1A] font-semibold text-base sm:text-lg uppercase tracking-wider mt-8 mb-3 pb-2 border-b border-neutral-100">
                      {trimmed.replace(/^###\s*/, '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('##')) {
                  return (
                    <h2 key={idx} className="font-serif text-[#1A1A1A] font-light text-xl sm:text-2xl tracking-wide mt-10 mb-4 pb-2 border-b border-[#C9A86C]/20">
                      {trimmed.replace(/^##\s*/, '')}
                    </h2>
                  );
                }
                
                // Render bullet lists (items starting with * or -)
                if (trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
                  const listItems = trimmed.split('\n').map(item => item.replace(/^[\*\-]\s*/, '').trim());
                  return (
                    <ul key={idx} className="list-disc list-inside pl-4 space-y-2 mt-3 text-neutral-600 font-sans">
                      {listItems.map((item, itemIdx) => {
                        // Support bold text within bullet item
                        if (item.includes('**')) {
                          const parts = item.split('**');
                          return (
                            <li key={itemIdx}>
                              {parts[0]}
                              <strong className="text-[#1A1A1A] font-semibold">{parts[1]}</strong>
                              {parts[2]}
                            </li>
                          );
                        }
                        return <li key={itemIdx}>{item}</li>;
                      })}
                    </ul>
                  );
                }

                // Render standard bold markers inside normal text
                if (trimmed.includes('**')) {
                  const parts = trimmed.split('**');
                  return (
                    <p key={idx} className="text-neutral-500 font-light">
                      {parts[0]}
                      <strong className="text-[#1A1A1A] font-semibold">{parts[1]}</strong>
                      {parts[2]}
                    </p>
                  );
                }

                return <p key={idx} className="text-neutral-500 font-light">{trimmed}</p>;
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              No policy content has been loaded yet. Please configure your Privacy Policy from the Settings panel in the admin area.
            </div>
          )}
        </div>

        {/* Action back link */}
        <div className="flex justify-center mt-12">
          <a
            href="/"
            className="font-sans text-xs tracking-[0.2em] text-neutral-500 hover:text-[#C9A86C] uppercase transition-colors"
          >
            ← Return to Studio Home
          </a>
        </div>
      </div>
    </div>
  );
}
