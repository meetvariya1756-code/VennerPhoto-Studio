/**
 * db.ts — Central data access layer for Venner Photo Studio
 * Fetches from Supabase. Falls back to mock data when Supabase is not configured.
 */

import { createServerSupabaseClient } from './supabase-server';
import { getMockPlaceholder } from './utils';

// Check if Supabase is properly configured
const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key';

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  studio_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  sunday_hours: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  whatsapp_number: string;
  google_map_embed_url: string;
}

export interface Hero {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image_url: string;
  mobile_background_image_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface ServicePackage {
  id: string;
  service_id: string;
  package_name: string;
  price: string;
  features: string[];
  display_order: number;
}

export interface ServiceGalleryImage {
  id: string;
  service_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  hero_image_url: string;
  thumbnail_image_url?: string;
  is_active: boolean;
  display_order: number;
  seo_title: string;
  seo_description: string;
  packages?: ServicePackage[];
  gallery?: ServiceGalleryImage[];
}

export interface PortfolioPhoto {
  id: string;
  title: string;
  image_url: string;
  category: string;
  alt_text: string;
  tags: string[];
  is_featured: boolean;
  captured_date: string | null;
}

export interface Reel {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  is_featured: boolean;
  published_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  photo_url: string;
  specialization: string;
  instagram_url: string;
  display_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  service_type: string;
  quote: string;
  rating: number;
  is_active: boolean;
}

export interface BeforeAfterComparison {
  id: string;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  is_active: boolean;
  display_order: number;
}

export interface WeddingHighlight {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  seo_title?: string;
  seo_description?: string;
  is_active: boolean;
  display_order: number;
}

// ─────────────────────────────────────────────────────────────────────
// MOCK DATA FALLBACKS
// ─────────────────────────────────────────────────────────────────────

const MOCK_SETTINGS: SiteSettings = {
  id: 'mock-settings',
  studio_name: 'Venner Photo Studio',
  tagline: 'Capturing Timeless Moments with Cinematic Elegance',
  phone: '+91 98259 83437',
  email: 'vennerphoto@gmail.com',
  address: 'B-27 Rangdarshan So-1, Dhanmora, Katargam, Surat',
  working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  sunday_hours: 'Available By Appointment Only',
  instagram_url: 'https://www.instagram.com/vennerphoto?igsh=cW53NnFuNjduanVj',
  facebook_url: 'https://www.facebook.com/share/18frTUd7PD/',
  youtube_url: 'https://m.youtube.com/@vennerphoto',
  whatsapp_number: '919825983437',
  google_map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.3462713549743!2d72.8274729!3d21.22271945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ebffcf5793f%3A0xf5564469239a54e7!2sVenner%20Photo%20Studio!5e1!3m2!1sen!2sin!4v1779775316406!5m2!1sen!2sin',
};

const MOCK_HEROES: Hero[] = [
  {
    id: 'mock-hero-1',
    title: 'Chasing the Light, Capturing the Soul',
    subtitle: 'Premium editorial, wedding, and commercial photography tailored to your story.',
    cta_text: 'Book Your Session',
    cta_link: '/contact',
    background_image_url: getMockPlaceholder('hero', 0),
    mobile_background_image_url: getMockPlaceholder('hero', 0),
    is_active: true,
    display_order: 1,
  },
  {
    id: 'mock-hero-2',
    title: 'Crafted with Elegance and Passion',
    subtitle: 'Immortalizing milestones, fashion editorials, and refined branding collections.',
    cta_text: 'Explore Portfolio',
    cta_link: '/portfolio',
    background_image_url: getMockPlaceholder('hero', 1),
    mobile_background_image_url: getMockPlaceholder('hero', 1),
    is_active: true,
    display_order: 2,
  },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', title: 'Wedding Photography', slug: 'wedding-photography', short_description: 'Capturing your most precious moments on your special day with cinematic elegance.', full_description: '', hero_image_url: getMockPlaceholder('photo', 0), is_active: true, display_order: 1, seo_title: '', seo_description: '' },
  { id: 's2', title: 'Engagement Photography', slug: 'engagement-photography', short_description: 'Beautiful pre-wedding shoots that tell your unique love story.', full_description: '', hero_image_url: getMockPlaceholder('photo', 1), is_active: true, display_order: 2, seo_title: '', seo_description: '' },
  { id: 's3', title: 'Baby Shower Photography', slug: 'baby-shower-photography', short_description: 'Cherish the excitement of welcoming a new life with timeless photos.', full_description: '', hero_image_url: getMockPlaceholder('photo', 2), is_active: true, display_order: 3, seo_title: '', seo_description: '' },
  { id: 's4', title: 'Children Photography', slug: 'children-photography', short_description: 'Playful, candid, and expressive portraits of your little ones.', full_description: '', hero_image_url: getMockPlaceholder('photo', 3), is_active: true, display_order: 4, seo_title: '', seo_description: '' },
  { id: 's5', title: 'Indoor Studio Photography', slug: 'indoor-studio-photography', short_description: 'Professional controlled lighting studio sessions for portraits and creative shoots.', full_description: '', hero_image_url: getMockPlaceholder('photo', 4), is_active: true, display_order: 5, seo_title: '', seo_description: '' },
  { id: 's6', title: 'Product Photography', slug: 'product-photography', short_description: 'High-quality commercial product photos that make your brand stand out.', full_description: '', hero_image_url: getMockPlaceholder('photo', 5), is_active: true, display_order: 6, seo_title: '', seo_description: '' },
  { id: 's7', title: 'Modeling Photography', slug: 'modeling-photography', short_description: 'Portfolio and editorial modeling shoots for aspiring and professional models.', full_description: '', hero_image_url: getMockPlaceholder('photo', 6), is_active: true, display_order: 7, seo_title: '', seo_description: '' },
  { id: 's8', title: 'Corporate Event Photography', slug: 'corporate-event-photography', short_description: 'Professional documentation of conferences, seminars, and corporate events.', full_description: '', hero_image_url: getMockPlaceholder('photo', 7), is_active: true, display_order: 8, seo_title: '', seo_description: '' },
  { id: 's9', title: 'Birthday Photography', slug: 'birthday-photography', short_description: 'Fun and vibrant photos to celebrate your birthday milestones.', full_description: '', hero_image_url: getMockPlaceholder('photo', 8), is_active: true, display_order: 9, seo_title: '', seo_description: '' },
  { id: 's10', title: 'Maternity Photography', slug: 'maternity-photography', short_description: 'Elegant and emotive portraits celebrating the beauty of pregnancy.', full_description: '', hero_image_url: getMockPlaceholder('photo', 9), is_active: true, display_order: 10, seo_title: '', seo_description: '' },
];

const MOCK_PORTFOLIO: PortfolioPhoto[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mock-photo-${i}`,
  title: ['Eternal Vows', 'Sunset Romance', 'Golden Hour Smile', 'Pure Innocence', 'Shadow Play', 'Aesthetic Geometry', 'High-Fashion Bold', 'Leadership Conference', 'Vibrant Milestones', 'Motherhood Grace', 'Studio Radiance', 'Candid Joy'][i],
  image_url: getMockPlaceholder('photo', i % 10),
  category: ['wedding-photography', 'engagement-photography', 'baby-shower-photography', 'children-photography', 'indoor-studio-photography', 'product-photography', 'modeling-photography', 'corporate-event-photography', 'birthday-photography', 'maternity-photography', 'indoor-studio-photography', 'wedding-photography'][i],
  alt_text: '',
  tags: [],
  is_featured: i < 6,
  captured_date: null,
}));

const MOCK_REELS: Reel[] = [
  { id: 'r1', title: 'The Cinematic Wedding Dream', video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', thumbnail_url: getMockPlaceholder('video-thumb', 0), category: 'wedding-photography', is_featured: true, published_at: new Date().toISOString() },
  { id: 'r2', title: 'Minimalist Leather Branding', video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', thumbnail_url: getMockPlaceholder('video-thumb', 1), category: 'product-photography', is_featured: true, published_at: new Date().toISOString() },
  { id: 'r3', title: 'Neon Studio Fashion Editorial', video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', thumbnail_url: getMockPlaceholder('video-thumb', 2), category: 'modeling-photography', is_featured: true, published_at: new Date().toISOString() },
  { id: 'r4', title: 'Sweet Maternity Golden Session', video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', thumbnail_url: getMockPlaceholder('video-thumb', 0), category: 'maternity-photography', is_featured: false, published_at: new Date().toISOString() },
];

const MOCK_TEAM: TeamMember[] = [
  { id: 't1', full_name: 'Julian Venner', role: 'Founder & Principal Photographer', bio: 'With over 12 years of experience capturing global fashion campaigns and elite destination weddings, Julian drives the artistic vision of Venner Studio.', photo_url: getMockPlaceholder('avatar', 0), specialization: 'Weddings & High Fashion Editorials', instagram_url: '', display_order: 1 },
  { id: 't2', full_name: 'Sophia Reyes', role: 'Lead Lifestyle Photographer', bio: 'Sophia is a mastermind at children and maternity stories, capturing soft, emotive and natural lighting profiles.', photo_url: getMockPlaceholder('avatar', 1), specialization: 'Maternity, Children & Family Portraits', instagram_url: '', display_order: 2 },
  { id: 't3', full_name: 'Marcus Vance', role: 'Senior Retoucher & Studio Artist', bio: 'Marcus meticulously refines every single piece of artwork, ensuring publication-quality color palettes and flawless tones.', photo_url: getMockPlaceholder('avatar', 2), specialization: 'Digital Art & Commercial Color Grading', instagram_url: '', display_order: 3 },
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 'ts1', client_name: 'Alexander & Evelyn', service_type: 'Wedding Photography', quote: 'Our wedding album is a masterpiece. Julian did not just take photos; he captured the exact emotions we felt.', rating: 5, is_active: true },
  { id: 'ts2', client_name: 'Nouveau Couture', service_type: 'Product Photography', quote: 'Stunning commercial results! Our website conversion rate increased by 40% after posting Venner Photo Studio\'s portfolios.', rating: 5, is_active: true },
  { id: 'ts3', client_name: 'Clara Bennett', service_type: 'Maternity Photography', quote: 'Sophia made me feel incredibly comfortable, and the maternity shoot is absolutely breathtaking.', rating: 5, is_active: true },
];

const MOCK_COMPARISONS: BeforeAfterComparison[] = [
  {
    id: 'mc1',
    title: 'Outdoor Golden Hour Retouch',
    description: 'Enhancing warm skin tones, golden hour contrast, and soft background details while retaining realistic hair and skin textures.',
    before_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80&sat=-50',
    after_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 1
  },
  {
    id: 'mc2',
    title: 'Controlled Studio Lighting',
    description: 'Balancing skin smooth tones, highlights, shadow depths, and modern fashion background color-grading.',
    before_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80&sat=-40&contrast=10',
    after_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    display_order: 2
  }
];

const MOCK_HIGHLIGHTS: WeddingHighlight[] = [
  {
    id: 'mh1',
    title: 'The Royal Heritage Vows',
    video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    seo_title: 'Royal Heritage Wedding Highlights',
    seo_description: 'Widescreen cinematic wedding highlight film captured at the heritage palace.',
    is_active: true,
    display_order: 1
  },
  {
    id: 'mh2',
    title: 'Golden Hour Lakeside Union',
    video_url: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    seo_title: 'Lakeside Wedding Highlights Film',
    seo_description: 'Sunset lake vows cinematic highlights video with warm grade palette.',
    is_active: true,
    display_order: 2
  }
];

// ─────────────────────────────────────────────────────────────────────
// HELPER — safe supabase query with fallback
// ─────────────────────────────────────────────────────────────────────

async function safeQuery<T>(
  fn: () => Promise<{ data: T | null; error: unknown }>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await fn();
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────────────
// PUBLIC QUERY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('site_settings').select('*').limit(1).single();
  }, MOCK_SETTINGS);
}

export async function getHeroes(): Promise<Hero[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('heroes').select('*').eq('is_active', true).order('display_order');
  }, MOCK_HEROES);
}

export async function getServices(): Promise<Service[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('services').select('*').eq('is_active', true).order('display_order');
  }, MOCK_SERVICES);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!isSupabaseConfigured) {
    return MOCK_SERVICES.find(s => s.slug === slug) || null;
  }
  try {
    const sb = await createServerSupabaseClient();
    const { data: service, error } = await sb
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !service) {
      return MOCK_SERVICES.find(s => s.slug === slug) || null;
    }

    // Fetch related gallery and packages
    const [{ data: gallery }, { data: packages }] = await Promise.all([
      sb.from('service_gallery').select('*').eq('service_id', service.id).order('display_order'),
      sb.from('service_packages').select('*').eq('service_id', service.id).order('display_order'),
    ]);

    return {
      ...service,
      gallery: gallery || [],
      packages: packages || [],
    };
  } catch {
    return MOCK_SERVICES.find(s => s.slug === slug) || null;
  }
}

export async function getPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('portfolio_photos').select('*').order('created_at', { ascending: false });
  }, MOCK_PORTFOLIO);
}

export async function getFeaturedPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('portfolio_photos').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(9);
  }, MOCK_PORTFOLIO.filter(p => p.is_featured));
}

export async function getReels(): Promise<Reel[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('reels').select('*').order('published_at', { ascending: false });
  }, MOCK_REELS);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('team_members').select('*').order('display_order');
  }, MOCK_TEAM);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false });
  }, MOCK_TESTIMONIALS);
}

export async function getBeforeAfterComparisons(): Promise<BeforeAfterComparison[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('before_after_comparisons').select('*').eq('is_active', true).order('display_order');
  }, MOCK_COMPARISONS);
}

export async function getWeddingHighlights(): Promise<WeddingHighlight[]> {
  return safeQuery(async () => {
    const sb = await createServerSupabaseClient();
    return sb.from('wedding_highlights').select('*').eq('is_active', true).order('display_order');
  }, MOCK_HIGHLIGHTS);
}
