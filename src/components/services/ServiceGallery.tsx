'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import SectionHeader from '../ui/SectionHeader';
import { SanityImage } from '@/types';

interface ServiceGalleryProps {
  gallery?: SanityImage[];
  serviceTitle: string;
  serviceSlug?: string;
}

// Rich image pools per service category (12 high-quality Unsplash images each)
const SERVICE_IMAGE_POOLS: Record<string, string[]> = {
  'wedding-photography': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
  ],
  'engagement-photography': [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1445633629932-0029acc44e88?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546961342-ea5f71a193b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574170609306-c5ab0b28edde?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1200&q=80',
  ],
  'baby-shower-photography': [
    'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531914485145-b9a7bc70d0a6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1588769737932-1e3e2b8e5b55?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553530979-fbb9e4aee36f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b24?auto=format&fit=crop&w=1200&q=80',
  ],
  'children-photography': [
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510022151265-1bce987a2e47?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b24?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543342384-1f1350e27861?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511949860663-92c5c57d48a7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1200&q=80',
  ],
  'indoor-studio-photography': [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533636721434-0e2d61030955?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617122018524-e9b80c7d8e50?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520316587275-5e4f06f355e3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1467913135492-5786dfc832f4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  ],
  'product-photography': [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581068532941-58baf67dfedd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587304773958-28ac4b01523c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
  ],
  'modeling-photography': [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520316587275-5e4f06f355e3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
  ],
  'corporate-event-photography': [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559223607-b4d0555ae227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
  ],
  'birthday-photography': [
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524666041070-9d87656c25b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=1200&q=80',
  ],
  'maternity-photography': [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b24?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531914485145-b9a7bc70d0a6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553530979-fbb9e4aee36f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1588769737932-1e3e2b8e5b55?auto=format&fit=crop&w=1200&q=80',
  ],
};

// Fallback generic photography images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559223607-b4d0555ae227?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520316587275-5e4f06f355e3?auto=format&fit=crop&w=1200&q=80',
];

const MOCK_WEDDING_GALLERY = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80', subCategory: 'candid' },
  { url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80', subCategory: 'portrait' },
];

export default function ServiceGallery({ gallery, serviceTitle, serviceSlug }: ServiceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'candid' | 'portrait'>('all');
  const thumbnailRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Determine which image pool to use
  const slug = serviceSlug || serviceTitle.toLowerCase().replace(/\s+/g, '-');
  
  // Safe extraction of dynamic gallery images uploaded via Supabase Admin
  const defaultPool = SERVICE_IMAGE_POOLS[slug] || FALLBACK_IMAGES;
  const galleryItems = gallery && gallery.length > 0 
    ? gallery.map(item => {
        if (typeof item === 'string') return { url: item, subCategory: null };
        const url = (item as any).image_url || (item as any).url || (item as any).asset?._ref || '';
        const subCategory = (item as any).sub_category || null;
        return { url, subCategory };
      }).filter(x => !!x.url)
    : (slug === 'wedding-photography' 
        ? MOCK_WEDDING_GALLERY 
        : defaultPool.map(url => ({ url, subCategory: null })));

  const filteredItems = galleryItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.subCategory === activeTab;
  });

  const imageUrls = filteredItems.map(item => item.url);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % imageUrls.length));
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + imageUrls.length) % imageUrls.length));
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Scroll active thumbnail into view
  React.useEffect(() => {
    if (lightboxIndex !== null && thumbnailRefs.current[lightboxIndex]) {
      thumbnailRefs.current[lightboxIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [lightboxIndex]);

  return (
    <div className="w-full">
      <SectionHeader
        title="Photo Gallery"
        subtitle={`${serviceTitle} Collection`}
        align="center"
      />

      <p className="text-center text-neutral-500 font-sans text-sm mb-10 -mt-4">
        Click any photo to view full screen • {imageUrls.length} photos
      </p>

      {slug === 'wedding-photography' && (
        <div className="flex justify-center items-center gap-6 mb-10 -mt-4">
          {(['all', 'candid', 'portrait'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setLightboxIndex(null);
              }}
              className={`relative font-sans text-xs tracking-widest uppercase pb-2 transition-colors duration-300 ${
                activeTab === tab
                  ? 'text-[#C9A86C] font-semibold'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeGalleryTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A86C]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-style grid - varied column spans for visual richness */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {imageUrls.map((url, index) => {
          // Every 7th image takes a double column span for visual variety
          const isWide = index === 0 || index === 6;
          const isTall = index === 3 || index === 9;

          return (
            <motion.div
              key={`gal-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
              onClick={() => setLightboxIndex(index)}
              className={`group relative overflow-hidden bg-neutral-200 cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 ${
                isWide ? 'col-span-2' : ''
              } ${isTall ? 'row-span-2' : ''}`}
              style={{ aspectRatio: isTall ? '3/4' : isWide ? '16/9' : '4/3' }}
            >
              <Image
                src={url}
                alt={`${serviceTitle} - Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Dark hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300" />
              </div>
              {/* Photo number badge */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white font-sans text-[10px] tracking-widest uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {String(index + 1).padStart(2, '0')}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/97 backdrop-blur-md flex flex-col justify-between select-none"
          >
            {/* Top bar: counter + close */}
            <div className="w-full flex items-center justify-between z-50 text-white px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
              <span className="font-sans text-xs tracking-widest uppercase text-neutral-300">
                {serviceTitle} &nbsp;·&nbsp; {lightboxIndex + 1} / {imageUrls.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/20 transition-all focus:outline-none cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area (Image + Navigation Arrows) */}
            <div className="relative flex-1 w-full flex items-center justify-center px-4 md:px-16">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10 hover:scale-105 active:scale-95 transition-all duration-200 z-50 focus:outline-none cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image Container */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-7xl h-full max-h-[75vh] md:max-h-[82vh] flex items-center justify-center relative"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrls[lightboxIndex]}
                    alt={`${serviceTitle} - Photo ${lightboxIndex + 1}`}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10 hover:scale-105 active:scale-95 transition-all duration-200 z-50 focus:outline-none cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom thumbnail strip */}
            <div className="w-full pb-6 pt-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full px-8 py-2 justify-start md:justify-center">
                {imageUrls.map((url, i) => (
                  <button
                    key={i}
                    ref={(el) => {
                      thumbnailRefs.current[i] = el;
                    }}
                    onClick={() => setLightboxIndex(i)}
                    className={`relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 overflow-hidden rounded transition-all duration-200 cursor-pointer ${
                      i === lightboxIndex
                        ? 'ring-2 ring-[#C9A86C] scale-110 z-10 opacity-100'
                        : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <Image src={url} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
