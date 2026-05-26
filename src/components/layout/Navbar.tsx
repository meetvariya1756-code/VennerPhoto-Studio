'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

// Mock list of services for dropdown
const SERVICE_LINKS = [
  { title: 'Wedding Photography', slug: 'wedding-photography' },
  { title: 'Engagement Photography', slug: 'engagement-photography' },
  { title: 'Baby Shower Photography', slug: 'baby-shower-photography' },
  { title: 'Children Photography', slug: 'children-photography' },
  { title: 'Indoor Studio Photography', slug: 'indoor-studio-photography' },
  { title: 'Product Photography', slug: 'product-photography' },
  { title: 'Modeling Photography', slug: 'modeling-photography' },
  { title: 'Corporate Event Photography', slug: 'corporate-event-photography' },
  { title: 'Birthday Photography', slug: 'birthday-photography' },
  { title: 'Maternity Photography', slug: 'maternity-photography' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately in case page starts scrolled
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'Services', href: '/services', dropdown: true },
    { title: 'Reels', href: '/reels' },
    { title: 'Team', href: '/team' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out border-b',
          isScrolled
            ? 'bg-[#1A1A1A]/90 backdrop-blur-md border-neutral-800/20 py-4 shadow-lg'
            : isHome
            ? 'bg-transparent border-transparent py-6'
            : 'bg-[#1A1A1A] border-neutral-800/10 py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-xl md:text-2xl tracking-wider text-white uppercase font-light group-hover:text-[#C9A86C] transition-colors">
              Venner
            </span>
            <span className="text-[9px] font-sans tracking-[0.3em] text-[#C9A86C] uppercase -mt-0.5">
              Photo Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.title}
                    className="relative group/drop"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-1 font-sans text-xs tracking-widest uppercase font-medium transition-colors hover:text-[#C9A86C]',
                        pathname.startsWith('/services') ? 'text-[#C9A86C]' : 'text-white/80'
                      )}
                    >
                      {link.title}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    {/* Services Dropdown */}
                    <div
                      className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#1A1A1A] border border-neutral-800 rounded-none shadow-2xl p-2 transition-all duration-300 transform origin-top',
                        servicesDropdownOpen
                          ? 'opacity-100 scale-100 pointer-events-auto'
                          : 'opacity-0 scale-95 pointer-events-none'
                      )}
                    >
                      <div className="grid grid-cols-1 gap-0.5">
                        {SERVICE_LINKS.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className={cn(
                              'px-4 py-2.5 font-sans text-xs tracking-wider uppercase transition-all duration-200 hover:bg-neutral-800 hover:text-[#C9A86C] text-left block',
                              pathname === `/services/${service.slug}`
                                ? 'text-[#C9A86C] bg-neutral-900'
                                : 'text-white/70'
                            )}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    'font-sans text-xs tracking-widest uppercase font-medium transition-colors hover:text-[#C9A86C]',
                    isActive ? 'text-[#C9A86C]' : 'text-white/80'
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:block">
            <Button variant="gold" size="sm" href="/contact">
              Book Now
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-[#C9A86C] focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#1A1A1A] flex flex-col justify-center px-12 md:px-24 transition-all duration-500 ease-in-out lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
        )}
      >
        <nav className="flex flex-col gap-6 text-left my-8">
          {navLinks.map((link) => {
            if (link.dropdown) {
              return (
                <div key={link.title} className="flex flex-col gap-2">
                  <span className="font-serif text-xl tracking-wider text-white/50 uppercase font-light">
                    {link.title}
                  </span>
                  <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-l border-[#C9A86C]/30 my-1">
                    {SERVICE_LINKS.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className={cn(
                          'font-sans text-xs tracking-wider uppercase py-1 hover:text-[#C9A86C] transition-colors',
                          pathname === `/services/${service.slug}` ? 'text-[#C9A86C]' : 'text-white/80'
                        )}
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  'font-serif text-2xl tracking-wider uppercase font-light transition-colors hover:text-[#C9A86C]',
                  isActive ? 'text-[#C9A86C]' : 'text-white'
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-neutral-800">
          <Button variant="gold" size="md" href="/contact" className="w-full">
            Book Appointment
          </Button>
        </div>
      </div>
    </>
  );
}
