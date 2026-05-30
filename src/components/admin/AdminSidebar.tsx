'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Settings, Image, Film, Users, MessageSquare,
  Camera, LogOut, ChevronRight, Menu, X, Layers, Mail, Columns
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
  { href: '/admin/before-after', label: 'Before/After Showcase', icon: Columns },
  { href: '/admin/team', label: 'Team Members', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/inquiries', label: 'Contact Inquiries', icon: Mail },
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
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-200/60">
        <Link href="/" target="_blank" className="flex flex-col items-center gap-1">
          <img
            src="/logo-black.png"
            alt="Venner Photo Studio Logo"
            className="h-28 w-auto object-contain"
          />
          <span className="text-[8px] font-sans tracking-[0.25em] text-[#C9A86C] uppercase block mt-1.5">
            Admin Panel
          </span>
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
                ? 'bg-[#1A1A1A] text-[#C9A86C] font-semibold shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#1A1A1A]'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
            {isActive(href, exact) && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-neutral-200/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-neutral-500 hover:text-[#1A1A1A] text-xs tracking-wider uppercase transition-colors mb-1"
        >
          <Camera className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-500 hover:text-red-600 text-xs tracking-wider uppercase transition-colors"
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
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200/60 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-neutral-200/60 flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo-black.png"
            alt="Venner Photo Studio Logo"
            className="h-20 w-auto object-contain"
          />
          <span className="text-[7px] font-sans tracking-[0.25em] text-[#C9A86C] uppercase mt-1">
            Admin
          </span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#1A1A1A] p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-white border-r border-neutral-200/60 flex flex-col pt-14">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
