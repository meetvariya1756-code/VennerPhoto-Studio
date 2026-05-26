'use client';

import React from 'react';
import TeamCard from './TeamCard';
import { TeamMember } from '@/types';

interface TeamGridProps {
  team: TeamMember[];
}

export default function TeamGrid({ team }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {team.map((member, index) => (
        <TeamCard key={member._id} member={member} index={index} />
      ))}
    </div>
  );
}
