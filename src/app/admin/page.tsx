import React from 'react';
import Link from 'next/link';
import { queryPg } from '@/lib/postgres';
import { getAnalyticsSummary } from '@/lib/db';
import {
  Camera, Image, Film, Users, MessageSquare, Layers, Settings,
  ArrowRight, Mail, Columns, Video, BookOpen, Globe, TrendingUp,
  Activity, Eye, UserCheck, Smartphone, Monitor, Compass
} from 'lucide-react';

async function getStats() {
  try {
    const [photos, services, reels, team, testimonials, heroes, inquiries, comparisons, highlights, blogs] = await Promise.all([
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.portfolio_photos'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.services'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.reels'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.team_members'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.testimonials'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.heroes'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.contact_inquiries'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.before_after_comparisons'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.wedding_highlights'),
      queryPg<{ count: string }>('SELECT COUNT(*)::text as count FROM public.blogs'),
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
      blogs: parseInt(blogs[0]?.count || '0', 10),
    };
  } catch {
    return null;
  }
}

const SECTIONS = [
  { href: '/admin/blogs', label: 'Blog & Articles', icon: BookOpen, description: 'Publish and manage SEO articles to drive organic search traffic' },
  { href: '/admin/seo', label: 'SEO & Keywords', icon: Globe, description: 'Manage footer SEO keywords, meta tags, and sitemaps' },
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
  const [stats, analytics] = await Promise.all([
    getStats(),
    getAnalyticsSummary().catch(() => null),
  ]);

  const maxDailyViews = Math.max(...(analytics?.dailyViews.map((d) => d.views) || [1]), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">
            Dashboard & Traffic Analytics
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Real-time website traffic, content performance, and studio administration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#C9A86C] hover:text-[#1A1A1A] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Blogs</span>
          </Link>
          <Link
            href="/admin/seo"
            className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 hover:border-[#C9A86C] text-[#1A1A1A] px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-[#C9A86C]" />
            <span>SEO Settings</span>
          </Link>
        </div>
      </div>

      {/* ─── WEBSITE TRAFFIC ANALYTICS SECTION ─── */}
      {analytics && (
        <div className="space-y-6">
          {/* Key Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Page Views */}
            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider">
                  Total Page Views
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C9A86C] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-serif text-[#1A1A1A] font-semibold">
                {analytics.totalViews.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{analytics.todayViews} views recorded today</span>
              </div>
            </div>

            {/* Total Unique Visitors */}
            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider">
                  Unique Visitors
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-serif text-[#1A1A1A] font-semibold">
                {analytics.totalVisitors.toLocaleString()}
              </p>
              <p className="text-neutral-400 text-xs mt-2">Identified unique devices</p>
            </div>

            {/* Total Sessions */}
            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider">
                  Total Sessions
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-serif text-[#1A1A1A] font-semibold">
                {analytics.totalSessions.toLocaleString()}
              </p>
              <p className="text-neutral-400 text-xs mt-2">Active browse journeys</p>
            </div>

            {/* Articles Published */}
            <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider">
                  Articles Published
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-serif text-[#1A1A1A] font-semibold">
                {stats?.blogs || 3}
              </p>
              <p className="text-neutral-400 text-xs mt-2">SEO indexed blog posts</p>
            </div>
          </div>

          {/* Traffic Breakdown & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Traffic Activity Chart */}
            <div className="lg:col-span-2 bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#1A1A1A]">
                    Traffic Activity Trend
                  </h3>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Daily page view counts over the last 14 days
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-sans">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A86C]" />
                  <span>Page Views</span>
                </div>
              </div>

              {/* Bar Chart Representation */}
              <div className="h-44 flex items-end gap-2 pt-6 pb-2 border-b border-neutral-100">
                {analytics.dailyViews.map((day, idx) => {
                  const heightPercent = Math.max(Math.round((day.views / maxDailyViews) * 100), 8);
                  const displayDate = day.date.slice(5); // MM-DD
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.views}
                      </div>
                      <div
                        className="w-full bg-[#1A1A1A] group-hover:bg-[#C9A86C] rounded-t-sm transition-all duration-300 relative"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] text-neutral-400 font-mono">{displayDate}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Device & Referrer Breakdown */}
            <div className="bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-medium text-[#1A1A1A] mb-4">
                  Device Distribution
                </h3>
                <div className="space-y-3 mb-6">
                  {analytics.devices.map(({ device, count }) => {
                    const pct = Math.round((count / (analytics.totalViews || 1)) * 100);
                    const isMobile = device.toLowerCase().includes('mobile');
                    return (
                      <div key={device} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                            {isMobile ? <Smartphone className="w-3.5 h-3.5 text-[#C9A86C]" /> : <Monitor className="w-3.5 h-3.5 text-[#C9A86C]" />}
                            {device}
                          </span>
                          <span className="text-neutral-400 font-mono">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A86C] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base font-medium text-[#1A1A1A] mb-3">
                  Top Traffic Sources
                </h3>
                <div className="space-y-2">
                  {analytics.topReferrers.slice(0, 4).map(({ referrer, count }) => (
                    <div key={referrer} className="flex items-center justify-between text-xs py-1 border-b border-neutral-100">
                      <span className="text-neutral-600 truncate max-w-[160px]">{referrer}</span>
                      <span className="text-neutral-400 font-mono font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Visited Pages Table */}
          <div className="bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-base font-medium text-[#1A1A1A] mb-4">
              Top Visited Website Pages
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-neutral-200/60 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-2">Page URL</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Traffic Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {analytics.topPages.map(({ path, views }) => {
                    const share = Math.round((views / (analytics.totalViews || 1)) * 100);
                    return (
                      <tr key={path} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-2.5 font-medium text-[#1A1A1A] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
                          <span>{path}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-neutral-700">
                          {views}
                        </td>
                        <td className="py-2.5 text-right text-neutral-400 font-mono">
                          {share}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Content Counts Grid */}
      {stats && (
        <div>
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Published Content Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {[
              { label: 'Heroes', value: stats.heroes, icon: Layers },
              { label: 'Services', value: stats.services, icon: Camera },
              { label: 'Photos', value: stats.photos, icon: Image },
              { label: 'Reels', value: stats.reels, icon: Film },
              { label: 'Highlights', value: stats.highlights, icon: Video },
              { label: 'Blogs', value: stats.blogs || 3, icon: BookOpen },
              { label: 'Sliders', value: stats.comparisons, icon: Columns },
              { label: 'Team', value: stats.team, icon: Users },
              { label: 'Reviews', value: stats.testimonials, icon: MessageSquare },
              { label: 'Inquiries', value: stats.inquiries, icon: Mail },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-neutral-200/60 rounded-xl p-3.5 text-center shadow-sm">
                <Icon className="w-4 h-4 text-[#C9A86C] mx-auto mb-1.5" />
                <p className="text-xl font-serif text-[#1A1A1A] font-semibold">{value}</p>
                <p className="text-neutral-400 text-[9px] uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Section Cards */}
      <div>
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Manage Studio Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map(({ href, label, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white hover:bg-neutral-50 border border-neutral-200/60 hover:border-[#C9A86C]/40 rounded-xl p-5 flex items-start gap-4 transition-all duration-200 shadow-sm"
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
    </div>
  );
}

