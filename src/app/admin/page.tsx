import React from 'react';
import Link from 'next/link';
import { queryPg } from '@/lib/postgres';
import { Camera, Image, Film, Users, MessageSquare, Layers, Settings, ArrowRight, Mail, Columns, Video } from 'lucide-react';

async function getStats() {
  try {
    const [photos, services, reels, team, testimonials, heroes, inquiries, comparisons, highlights] = await Promise.all([
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.portfolio_photos'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.services'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.reels'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.team_members'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.testimonials'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.heroes'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.contact_inquiries'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.before_after_comparisons'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.wedding_highlights'),
    ]);
    return {
      photos: parseInt(photos[0]?.count || '0', 10),
      services: parseInt(services[0]?.count || '0', 10),
      reels: parseInt(reels[0]?.count || '0', 10),
      team: parseInt(team[0]?.count || '0', 10),
      testimonials: parseInt(testimonials[0]?.count || '0', 10),
      heroes: parseInt(heroes[0]?.count || '0', 10),
      inquiries: parseInt(inquiries[0]?.count || '0', 10),
      comparisons: parseInt(comparisons[0]?.count || '0', 10),
      highlights: parseInt(highlights[0]?.count || '0', 10),
    };
  } catch {
    return null;
  }
}

const SECTIONS = [
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, description: 'Studio name, phone, social links, address' },
  { href: '/admin/heroes', label: 'Hero Banners', icon: Layers, description: 'Homepage full-screen slideshow banners' },
  { href: '/admin/services', label: 'Services', icon: Camera, description: 'Photography categories, descriptions, galleries & pricing' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image, description: 'Upload and manage portfolio photo collection' },
  { href: '/admin/reels', label: 'Video Reels', icon: Film, description: 'Upload and manage cinematic video reels' },
  { href: '/admin/wedding-highlights', label: 'Wedding Highlights', icon: Video, description: 'Upload and manage landscape wedding highlight films' },
  { href: '/admin/before-after', label: 'Before/After Showcase', icon: Columns, description: 'Manage before/after raw vs retouched sliders' },
  { href: '/admin/team', label: 'Team Members', icon: Users, description: 'Photographers, retouchers and studio artists' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Client reviews and ratings' },
  { href: '/admin/inquiries', label: 'Contact Inquiries', icon: Mail, description: 'View client booking inquiries and messages' },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome to Venner Photo Studio admin panel</p>
      </div>



      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-8">
          {[
            { label: 'Heroes', value: stats.heroes, icon: Layers },
            { label: 'Services', value: stats.services, icon: Camera },
            { label: 'Photos', value: stats.photos, icon: Image },
            { label: 'Reels', value: stats.reels, icon: Film },
            { label: 'Highlights', value: stats.highlights, icon: Video },
            { label: 'Sliders', value: stats.comparisons, icon: Columns },
            { label: 'Team', value: stats.team, icon: Users },
            { label: 'Reviews', value: stats.testimonials, icon: MessageSquare },
            { label: 'Inquiries', value: stats.inquiries, icon: Mail },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-neutral-200/60 rounded-xl p-4 text-center shadow-sm">
              <Icon className="w-5 h-5 text-[#C9A86C] mx-auto mb-2" />
              <p className="text-2xl font-serif text-[#1A1A1A] font-semibold">{value}</p>
              <p className="text-neutral-400 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white hover:bg-neutral-50 border border-neutral-200/60 hover:border-[#C9A86C]/40 rounded-xl p-6 flex items-start gap-4 transition-all duration-200 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/20 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#C9A86C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A1A] font-semibold text-sm group-hover:text-[#8C6D39] transition-colors">{label}</p>
              <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#C9A86C] group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
