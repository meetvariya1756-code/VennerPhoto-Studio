import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Venner Photo Studio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      <AdminSidebar />

      {/* Main content area — offset for sidebar */}
      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#111111]">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-sans">Venner Photo Studio</p>
            <p className="text-white font-semibold text-sm">Content Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-neutral-400">Live</span>
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
