import React from 'react';
import { Metadata } from 'next';
import TeamGrid from '@/components/team/TeamGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { generateSiteMetadata } from '@/lib/metadata';
import { getTeamMembers } from '@/lib/sanity.queries';

export const revalidate = 3600;

export const metadata: Metadata = generateSiteMetadata({
  title: 'Our Creative Team',
  description: 'Meet the award-winning professional photographers, creative directors, and retouchers of Venner Photo Studio.',
  path: '/team',
});

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <div className="pt-28 pb-24 bg-[#F9F7F4] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          title="Master Artisans"
          subtitle="Meet Our Team"
          align="center"
        />

        {/* Dynamic grid of team member profile profiles */}
        <TeamGrid team={team} />
      </div>
    </div>
  );
}
