'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Settings, Image, Film, Users, MessageSquare,
  Camera, LogOut, ChevronRight, Menu, X, Layers
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/heroes', label: 'Hero Banners', icon: Layers },
  { href: '/admin/services', label: 'Services', icon: Camera },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { href: '/admin/reels', label: 'Video Reels', icon: Film },
  { href: '/admin/team', label: 'Team Members', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" target="_blank" className="flex flex-col">
          <span className="font-serif text-xl tracking-wider text-white uppercase font-light">Venner</span>
          <span className="text-[9px] font-sans tracking-[0.3em] text-[#C9A86C] uppercase -mt-0.5">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-sans transition-all duration-200 group',
              isActive(href, exact)
                ? 'bg-[#C9A86C] text-[#1A1A1A] font-semibold'
                : 'text-neutral-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
            {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-xs tracking-wider uppercase transition-colors mb-1"
        >
          <Camera className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-red-400 text-xs tracking-wider uppercase transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111111] border-r border-white/10 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#111111] border-b border-white/10 flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-lg tracking-wider text-white uppercase font-light">Venner</span>
          <span className="text-[8px] font-sans tracking-[0.3em] text-[#C9A86C] uppercase -mt-0.5">Admin Panel</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#111111] border-r border-white/10 flex flex-col pt-14">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
