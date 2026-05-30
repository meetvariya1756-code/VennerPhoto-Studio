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
  const policyText = settings.privacy_policy || '';

  // Parse Markdown lines into structured blocks
  const rawLines = policyText.split(/\r?\n/);
  
  type Block =
    | { type: 'h2'; text: string }
    | { type: 'h3'; text: string }
    | { type: 'h4'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'paragraph'; text: string }
    | { type: 'empty' };

  const blocks: Block[] = [];
  let currentList: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Check if the line is a list item
    if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
      const itemText = line.replace(/^[\*\-•]\s*/, '');
      currentList.push(itemText);
    } else {
      // If we were building a list, push it first
      if (currentList.length > 0) {
        blocks.push({ type: 'list', items: currentList });
        currentList = [];
      }

      if (line === '') {
        // Only push empty block if last block wasn't empty to prevent huge gaps
        if (blocks.length > 0 && blocks[blocks.length - 1].type !== 'empty') {
          blocks.push({ type: 'empty' });
        }
      } else if (line.startsWith('####')) {
        blocks.push({ type: 'h4', text: line.replace(/^####\s*/, '') });
      } else if (line.startsWith('###')) {
        blocks.push({ type: 'h3', text: line.replace(/^###\s*/, '') });
      } else if (line.startsWith('##')) {
        blocks.push({ type: 'h2', text: line.replace(/^##\s*/, '') });
      } else {
        blocks.push({ type: 'paragraph', text: line });
      }
    }
  }

  // Push final list if any
  if (currentList.length > 0) {
    blocks.push({ type: 'list', items: currentList });
  }

  // Clean empty blocks from the very beginning and end
  while (blocks.length > 0 && blocks[0].type === 'empty') {
    blocks.shift();
  }
  while (blocks.length > 0 && blocks[blocks.length - 1].type === 'empty') {
    blocks.pop();
  }

  // Helper to parse double asterisks for bolding (**text**)
  function parseInlineBold(text: string): React.ReactNode[] {
    if (!text.includes('**')) {
      return [text];
    }

    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="text-[#1A1A1A] font-semibold font-sans">
            {part}
          </strong>
        );
      }
      return part;
    });
  }

  return (
    <div className="pt-44 md:pt-52 pb-24 bg-[#F9F7F4] text-[#1A1A1A] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Privacy Policy & Terms"
          subtitle="Studio Guidelines"
          align="center"
        />

        <div className="bg-white border-t-4 border-t-[#C9A86C] border-x border-b border-neutral-200/60 p-8 md:p-12 shadow-xl shadow-neutral-100/40 rounded-b-2xl mt-12 max-w-none font-sans">
          {blocks.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {blocks.map((block, idx) => {
                switch (block.type) {
                  case 'h2':
                    return (
                      <h2 key={idx} className="font-serif text-[#1A1A1A] font-light text-xl sm:text-2xl tracking-wide mt-8 mb-2 pb-2 border-b border-[#C9A86C]/20">
                        {parseInlineBold(block.text)}
                      </h2>
                    );
                  case 'h3':
                    return (
                      <h3 key={idx} className="font-serif text-[#1A1A1A] font-semibold text-base sm:text-lg uppercase tracking-wider mt-8 mb-2 pb-2 border-b border-neutral-100">
                        {parseInlineBold(block.text)}
                      </h3>
                    );
                  case 'h4':
                    return (
                      <h4 key={idx} className="font-serif text-[#1A1A1A] font-medium text-sm sm:text-base uppercase tracking-wider mt-6 mb-2 border-l-2 border-[#C9A86C] pl-3">
                        {parseInlineBold(block.text)}
                      </h4>
                    );
                  case 'list':
                    return (
                      <ul key={idx} className="my-2 pl-1 space-y-2.5 list-none">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="relative pl-6 text-neutral-600 text-sm sm:text-base leading-relaxed">
                            <span className="absolute left-1 top-2.5 w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                            {parseInlineBold(item)}
                          </li>
                        ))}
                      </ul>
                    );
                  case 'paragraph':
                    return (
                      <p key={idx} className="text-neutral-600 font-light text-sm sm:text-base leading-relaxed">
                        {parseInlineBold(block.text)}
                      </p>
                    );
                  case 'empty':
                    return <div key={idx} className="h-3" />;
                  default:
                    return null;
                }
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
