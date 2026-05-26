'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { title: 'Home', href: '/' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Services', href: '/services' },
    { title: 'Video Reels', href: '/reels' },
    { title: 'Our Team', href: '/team' },
    { title: 'Contact Us', href: '/contact' },
  ];

  const services = [
    { title: 'Wedding Photography', href: '/services/wedding-photography' },
    { title: 'Engagement Shoots', href: '/services/engagement-photography' },
    { title: 'Baby Shower Portraits', href: '/services/baby-shower-photography' },
    { title: 'Indoor Studio Sessions', href: '/services/indoor-studio-photography' },
    { title: 'Product & Brand Shoot', href: '/services/product-photography' },
    { title: 'Modeling Portfolio', href: '/services/modeling-photography' },
  ];

  return (
    <footer className="bg-[#1A1A1A] border-t border-neutral-800 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand & Tagline */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex flex-col w-fit">
            <span className="font-serif text-2xl tracking-wider uppercase font-light text-white">
              Venner
            </span>
            <span className="text-[10px] font-sans tracking-[0.3em] text-[#C9A86C] uppercase -mt-0.5">
              Photo Studio
            </span>
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed mt-2 max-w-xs">
            Bespoke high-end photography capturing luxury weddings, editorial portraits, commercial branding, and timeless lifecycles with cinematic distinction.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://instagram.com/vennerphotostudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/vennerphotostudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/vennerphotostudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg tracking-wide font-light text-white border-b border-neutral-800 pb-2 mb-2">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-neutral-400 hover:text-[#C9A86C] text-sm tracking-wide transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Photography Services */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg tracking-wide font-light text-white border-b border-neutral-800 pb-2 mb-2">
            Services
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {services.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-neutral-400 hover:text-[#C9A86C] text-sm tracking-wide transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Studio Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-lg tracking-wide font-light text-white border-b border-neutral-800 pb-2 mb-2">
            Studio Info
          </h3>
          <div className="flex flex-col gap-3.5 text-neutral-400 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <span>Studio 101, Luxury Arts District, New York, NY 10001</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <span>hello@vennerphotostudio.com</span>
            </div>
            <div className="flex items-start gap-3 mt-1.5 pt-3 border-t border-neutral-800">
              <Clock className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-0.5">Hours</p>
                <p className="text-xs text-neutral-400">Mon - Sat: 9am - 7pm</p>
                <p className="text-xs text-neutral-400">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Deck */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between text-neutral-500 text-xs font-light">
        <p>© {new Date().getFullYear()} Venner Photo Studio. All rights reserved.</p>
        <p className="mt-2 md:mt-0 tracking-wider">
          DESIGNED WITH PASSION & ELEGANCE
        </p>
      </div>
    </footer>
  );
}
