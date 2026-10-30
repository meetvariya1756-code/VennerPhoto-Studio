'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

const FALLBACK_SERVICES = [
  { title: 'Wedding Photography', href: '/services/wedding-photography' },
  { title: 'Engagement Shoots', href: '/services/engagement-photography' },
  { title: 'Baby Shower Portraits', href: '/services/baby-shower-photography' },
  { title: 'Indoor Studio Sessions', href: '/services/indoor-studio-photography' },
  { title: 'Product & Brand Shoot', href: '/services/product-photography' },
  { title: 'Modeling Portfolio', href: '/services/modeling-photography' },
];

const FALLBACK_KEYWORDS = [
  { keyword: 'Best Wedding Photographer in Surat', url: '/services/wedding-photography' },
  { keyword: 'Luxury Pre-Wedding Shoot Surat', url: '/services/engagement-photography' },
  { keyword: 'Cinematic Wedding Highlights & Films', url: '/reels' },
  { keyword: 'Indoor Photo Studio Katargam Surat', url: '/services/indoor-studio-photography' },
  { keyword: 'Born Baby & Newborn Photography Surat', url: '/services/born-baby' },
  { keyword: 'Baby Shower & Maternity Shoots', url: '/services/baby-shower-photography' },
  { keyword: 'Fashion & Modeling Portfolio Shoots', url: '/services/modeling-photography' },
  { keyword: 'Toddler & Kids Portrait Photography', url: '/services/toddler-children' },
  { keyword: 'Commercial & Product Photography', url: '/services/product-photography' },
  { keyword: 'Candid Destination Wedding Shoots', url: '/portfolio' },
  { keyword: 'Professional Photographers in Surat', url: '/team' },
];

export default function Footer() {
  const pathname = usePathname();
  const [services, setServices] = React.useState(FALLBACK_SERVICES);
  const [seoKeywords, setSeoKeywords] = React.useState<any[]>(FALLBACK_KEYWORDS);

  React.useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setServices(
              data.slice(0, 6).map((s: any) => ({
                title: s.title,
                href: `/services/${s.slug}`,
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch services for footer:', err);
      }
    }

    async function fetchSeoSettings() {
      try {
        const res = await fetch('/api/admin/seo_settings?limit=1');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].footer_keywords)) {
            if (data[0].footer_keywords.length > 0) {
              setSeoKeywords(data[0].footer_keywords);
            }
          }
        }
      } catch (err) {
        // keep fallback keywords
      }
    }

    fetchServices();
    fetchSeoSettings();
  }, []);

  // Do not render footer in admin dashboard or sanity studio
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) {
    return null;
  }
  const quickLinks = [
    { title: 'Home', href: '/' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Services', href: '/services' },
    { title: 'Video Reels', href: '/reels' },
    { title: 'Journal / Blog', href: '/blog' },
    { title: 'Our Team', href: '/team' },
    { title: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-[#1A1A1A] border-t border-neutral-800 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand & Tagline */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center w-fit">
            <img
              src="/logo.png"
              alt="Venner Photo Studio Logo"
              className="h-18 md:h-24 w-auto object-contain"
            />
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed mt-2 max-w-xs">
            Bespoke high-end photography capturing luxury weddings, editorial portraits, commercial branding, and timeless lifecycles with cinematic distinction.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://www.instagram.com/vennerphoto?igsh=cW53NnFuNjduanVj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/share/18frTUd7PD/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://m.youtube.com/%40vennerphoto?fbclid=PAb21jcASCG99leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAae0Ku13NdzYLWLCq1NucKAK0JBd3IB3xc8WLAuernPLHIWGihGMKLWsXO5NMw_aem_I2_94LJLB5ri58jfCwYCSg"
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
              <span>B-27 Rangdarshan So-1 , Dhanmora , Katargam , Surat</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <a href="tel:+919825983437" className="text-neutral-400 hover:text-[#C9A86C] transition-colors">
                +91 98259 83437
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C9A86C] shrink-0" />
              <a href="mailto:vennerphoto@gmail.com" className="text-neutral-400 hover:text-[#C9A86C] transition-colors">
                vennerphoto@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-3 mt-1.5 pt-3 border-t border-neutral-800">
              <Clock className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-0.5">Hours</p>
                <p className="text-xs text-neutral-400">Mon - Sat: 9:00 AM - 8:00 PM</p>
                <p className="text-xs text-neutral-400">Sunday: Available By Appointment Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manageable SEO Keywords Section */}
      {seoKeywords && seoKeywords.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 border-t border-neutral-800/80 pt-8 pb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86C]" />
              <h4 className="font-sans text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">
                Popular Photography Searches & Specializations
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              {seoKeywords.map((item: any, idx: number) => {
                const keyword = typeof item === 'string' ? item : item.keyword;
                const url = typeof item === 'string' ? '/services' : (item.url || '/services');
                return (
                  <React.Fragment key={idx}>
                    <Link
                      href={url}
                      className="text-neutral-400 hover:text-[#C9A86C] transition-colors duration-200"
                    >
                      {keyword}
                    </Link>
                    {idx < seoKeywords.length - 1 && (
                      <span className="text-neutral-700 select-none">•</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Bottom Deck */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between text-neutral-500 text-xs font-light">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Venner Photo Studio. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Link href="/policy" className="text-neutral-500 hover:text-[#C9A86C] transition-colors border-b border-transparent hover:border-[#C9A86C]/40 pb-0.5">
            Privacy Policy
          </Link>
        </div>
        <p className="mt-2 md:mt-0 tracking-wider">
          DESIGNED WITH PASSION & ELEGANCE
        </p>
      </div>
    </footer>
  );
}
