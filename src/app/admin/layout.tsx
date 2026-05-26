'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#1A1A1A] font-sans">
      <AdminSidebar />

      {/* Main content area — offset for sidebar */}
      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-neutral-200/60 bg-white">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-sans font-semibold">Venner Photo Studio</p>
            <p className="text-[#1A1A1A] font-serif text-base font-medium">Content Management System</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="pt-16 lg:pt-0 px-4 md:px-8 py-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
