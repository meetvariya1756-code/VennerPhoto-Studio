'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import ImageWithFallback from '../ui/ImageWithFallback';
import { TeamMember } from '@/types';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export default function TeamCard({ member, index }: TeamCardProps) {
  return (
    <div className="group bg-white border border-neutral-200/50 hover:shadow-xl hover:border-neutral-200 transition-all duration-500 rounded-none overflow-hidden flex flex-col text-left">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={member.photo}
          fallbackType="avatar"
          fallbackIndex={index}
          alt={member.fullName}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="group-hover:scale-102 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
        />

        {member.instagramUrl && (
          <a
            href={member.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C9A86C] text-white hover:text-black flex items-center justify-center border border-white/10 hover:border-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-10"
            aria-label={`${member.fullName} Instagram`}
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[#C9A86C] font-sans text-xs tracking-widest uppercase font-semibold mb-1 block">
            {member.role}
          </span>
          <h3 className="font-serif text-2xl font-light tracking-wide text-[#1A1A1A] mb-3">
            {member.fullName}
          </h3>
          <p className="text-neutral-500 font-sans text-sm leading-relaxed mb-6">
            {member.bio}
          </p>
        </div>

        {member.specialization && (
          <div className="pt-4 border-t border-neutral-100 text-xs font-sans font-medium text-neutral-400 tracking-wider">
            SPECIALTIES: <span className="text-[#1A1A1A] font-semibold">{member.specialization}</span>
          </div>
        )}
      </div>
    </div>
  );
}
