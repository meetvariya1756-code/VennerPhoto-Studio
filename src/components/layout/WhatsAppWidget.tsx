'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppWidget() {
  const pathname = usePathname();

  // Do not render WhatsApp widget in admin dashboard or sanity studio
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) {
    return null;
  }
  const [isVisible, setIsVisible] = useState(false);

  // Smooth entry animation after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = '919825983437';
  const defaultMessage = encodeURIComponent(
    'Hi Venner Photo Studio, I would like to inquire about your photography services.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Inquire on WhatsApp"
      >
        {/* Pulsing Official Green Background Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/30 group-hover:bg-[#25D366]/50 animate-ping opacity-75 transition-all duration-300" />
        
        {/* Custom High-Fidelity WhatsApp Logo SVG */}
        <svg
          className="w-6 h-6 fill-current text-white transition-transform duration-300 relative z-10 group-hover:scale-110"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.742.002-2.602-1.01-5.05-2.85-6.89C16.64 2.133 14.19 1.12 11.59 1.12c-5.439 0-9.861 4.37-9.865 9.745-.001 1.83.493 3.614 1.432 5.187l-1.01 3.687 3.8-.979zm11.236-4.587c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
        </svg>

        {/* Premium floating text banner (Hover Tooltip) */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#1A1A1A]/95 text-white border border-[#25D366]/40 px-3 py-1.5 text-xs font-sans tracking-wider uppercase whitespace-nowrap opacity-0 scale-90 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl">
          Inquire via WhatsApp
        </span>
      </a>
    </div>
  );
}
