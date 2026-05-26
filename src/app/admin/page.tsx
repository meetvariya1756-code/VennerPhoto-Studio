import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Camera, Image, Film, Users, MessageSquare, Layers, Settings, ArrowRight, AlertCircle } from 'lucide-react';

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url';

async function getStats() {
  if (!isSupabaseConfigured) return null;
  try {
    const sb = await createServerSupabaseClient();
    const [photos, services, reels, team, testimonials, heroes] = await Promise.all([
      sb.from('portfolio_photos').select('id', { count: 'exact', head: true }),
      sb.from('services').select('id', { count: 'exact', head: true }),
      sb.from('reels').select('id', { count: 'exact', head: true }),
      sb.from('team_members').select('id', { count: 'exact', head: true }),
      sb.from('testimonials').select('id', { count: 'exact', head: true }),
      sb.from('heroes').select('id', { count: 'exact', head: true }),
    ]);
    return {
      photos: photos.count || 0,
      services: services.count || 0,
      reels: reels.count || 0,
      team: team.count || 0,
      testimonials: testimonials.count || 0,
      heroes: heroes.count || 0,
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
  { href: '/admin/team', label: 'Team Members', icon: Users, description: 'Photographers, retouchers and studio artists' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Client reviews and ratings' },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white font-light tracking-wide">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome to Venner Photo Studio admin panel</p>
      </div>

      {/* Supabase not configured warning */}
      {!isSupabaseConfigured && (
        <div className="mb-8 bg-amber-950/50 border border-amber-700/50 rounded-xl p-6 flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm mb-1">Supabase not connected yet</p>
            <p className="text-amber-500/80 text-xs leading-relaxed">
              The website is currently running on mock data. To enable live editing:
            </p>
            <ol className="text-amber-500/80 text-xs mt-2 space-y-1 list-decimal list-inside">
              <li>Go to <strong className="text-amber-400">supabase.com</strong> → Create a free project</li>
              <li>Copy your <strong className="text-amber-400">Project URL</strong> and <strong className="text-amber-400">Anon Key</strong></li>
              <li>Paste them into <code className="bg-amber-900/50 px-1 rounded">.env.local</code> (replace the placeholder values)</li>
              <li>Run the SQL schema from <code className="bg-amber-900/50 px-1 rounded">supabase/schema.sql</code> in Supabase SQL Editor</li>
              <li>Restart the dev server with <code className="bg-amber-900/50 px-1 rounded">npm run dev</code></li>
            </ol>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Heroes', value: stats.heroes, icon: Layers },
            { label: 'Services', value: stats.services, icon: Camera },
            { label: 'Photos', value: stats.photos, icon: Image },
            { label: 'Reels', value: stats.reels, icon: Film },
            { label: 'Team', value: stats.team, icon: Users },
            { label: 'Reviews', value: stats.testimonials, icon: MessageSquare },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-[#C9A86C] mx-auto mb-2" />
              <p className="text-2xl font-serif text-white font-light">{value}</p>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
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
            className="group bg-[#1a1a1a] hover:bg-[#222222] border border-white/10 hover:border-[#C9A86C]/30 rounded-xl p-6 flex items-start gap-4 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#C9A86C]/10 border border-[#C9A86C]/20 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#C9A86C]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm group-hover:text-[#C9A86C] transition-colors">{label}</p>
              <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#C9A86C] group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
