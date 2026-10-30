/**
 * db.ts — Central data access layer for Venner Photo Studio
 * Queries local/production PostgreSQL database (`venner_photo_studio`).
 * Seamlessly falls back to migrated dataset (`migratedData.json`) so all real
 * uploaded photos, reels, and services display instantly without errors.
 */

import { createServerSupabaseClient } from './supabase-server';
import { queryPg } from './postgres';
import { getLocalTable, updateLocal } from './localDb';
import MIGRATED_DATA from './migratedData.json';
import type { BlogPost, SeoSettings, FooterKeyword, AnalyticsEvent, AnalyticsSummary } from '@/types';

export type { BlogPost, SeoSettings, FooterKeyword, AnalyticsEvent, AnalyticsSummary };

const data = MIGRATED_DATA as any;

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url' &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('enkyolmjklvryvnzsmvt') &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key'
  );
}

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
  privacy_policy: string;
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
  sub_category?: string | null;
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
// HELPER FOR MERGING LOCAL DB DATA OVER POSTGRES ROWS
// ─────────────────────────────────────────────────────────────────────

function mergeWithLocal<T extends { id?: string }>(dbRows: T[], tableName: string): T[] {
  const local = getLocalTable(tableName);
  if (!local || local.length === 0) {
    return dbRows;
  }
  const localMap = new Map<string, any>(local.filter((x: any) => x && x.id).map((item: any) => [item.id, item]));
  const dbIdSet = new Set(dbRows.filter((x: any) => x && x.id).map((r: any) => r.id));

  const merged: T[] = dbRows.map((r: any) => {
    if (r.id && localMap.has(r.id)) {
      return { ...r, ...localMap.get(r.id) };
    }
    return r;
  });

  for (const item of local) {
    if (item && item.id && !dbIdSet.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
}

// ─────────────────────────────────────────────────────────────────────
// PUBLIC QUERY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await queryPg<SiteSettings>('SELECT * FROM public.site_settings LIMIT 1');
  const merged = mergeWithLocal<SiteSettings>(rows, 'site_settings');
  if (merged.length > 0) return merged[0];
  if (data.site_settings?.length > 0) return data.site_settings[0];
  return {
    id: 'default',
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
    google_map_embed_url: '',
    privacy_policy: '### PRIVACY POLICY & TERMS'
  };
}

export async function getHeroes(): Promise<Hero[]> {
  const rows = await queryPg<Hero>('SELECT * FROM public.heroes WHERE is_active = TRUE ORDER BY display_order ASC');
  const merged = mergeWithLocal<Hero>(rows, 'heroes');
  if (merged.length > 0) return merged.filter((h: any) => h.is_active !== false);
  if (data.heroes?.length > 0) return data.heroes;
  return [];
}

export async function getServices(): Promise<Service[]> {
  const rows = await queryPg<Service>('SELECT * FROM public.services WHERE is_active = TRUE ORDER BY display_order ASC');
  const merged = mergeWithLocal<Service>(rows, 'services');
  if (merged.length > 0) return merged.filter((s: any) => s.is_active !== false);
  if (data.services?.length > 0) return data.services;
  return [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  const service = services.find((s: any) => s.slug === slug);
  if (service) {
    let gallery = await queryPg<ServiceGalleryImage>('SELECT * FROM public.service_gallery WHERE service_id = $1 ORDER BY display_order ASC', [service.id]);
    gallery = mergeWithLocal<ServiceGalleryImage>(gallery, 'service_gallery').filter((g: any) => g.service_id === service.id);

    let packages = await queryPg<ServicePackage>('SELECT * FROM public.service_packages WHERE service_id = $1 ORDER BY display_order ASC', [service.id]);
    packages = mergeWithLocal<ServicePackage>(packages, 'service_packages').filter((p: any) => p.service_id === service.id);

    return {
      ...service,
      gallery: gallery || [],
      packages: packages || [],
    };
  }

  // Fallback to migrated dataset
  const migratedServices = data.services || [];
  const migratedService = migratedServices.find((s: any) => s.slug === slug);
  if (migratedService) {
    const gallery = (data.service_gallery || []).filter((g: any) => g.service_id === migratedService.id);
    const packages = (data.service_packages || []).filter((p: any) => p.service_id === migratedService.id);
    return {
      ...migratedService,
      gallery: gallery || [],
      packages: packages || [],
    };
  }

  return null;
}

export async function getPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  const rows = await queryPg<PortfolioPhoto>('SELECT * FROM public.portfolio_photos ORDER BY created_at DESC');
  const merged = mergeWithLocal<PortfolioPhoto>(rows, 'portfolio_photos');
  let photos = merged.length > 0 ? merged : data.portfolio_photos || [];
  return photos.map((p: any, idx: number) => ({
    ...p,
    id: p.id || p._id || `p_${idx}`,
    image_url: p.image_url || p.image || undefined,
  }));
}

export async function getFeaturedPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  const rows = await queryPg<PortfolioPhoto>('SELECT * FROM public.portfolio_photos ORDER BY is_featured DESC, created_at DESC LIMIT 9');
  const merged = mergeWithLocal<PortfolioPhoto>(rows, 'portfolio_photos');
  let photos: any[] = merged.filter((p: any) => p.is_featured);
  if (photos.length === 0) photos = merged.slice(0, 9);
  if (photos.length === 0) photos = (data.portfolio_photos || []).slice(0, 9);
  return photos.map((p: any, idx: number) => ({
    ...p,
    id: p.id || p._id || `p_feat_${idx}`,
    image_url: p.image_url || p.image || undefined,
  }));
}

export async function getReels(): Promise<Reel[]> {
  const rows = await queryPg<Reel>('SELECT * FROM public.reels ORDER BY published_at DESC');
  const merged = mergeWithLocal<Reel>(rows, 'reels');
  if (merged.length > 0) return merged;
  if (data.reels?.length > 0) return data.reels;
  return [];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const rows = await queryPg<TeamMember>('SELECT * FROM public.team_members ORDER BY display_order ASC');
  const merged = mergeWithLocal<TeamMember>(rows, 'team_members');
  if (merged.length > 0) return merged;
  if (data.team_members?.length > 0) return data.team_members;
  return [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await queryPg<Testimonial>('SELECT * FROM public.testimonials WHERE is_active = TRUE ORDER BY created_at DESC');
  const merged = mergeWithLocal<Testimonial>(rows, 'testimonials');
  if (merged.length > 0) return merged.filter((t: any) => t.is_active !== false);
  if (data.testimonials?.length > 0) return data.testimonials;
  return [];
}

export async function getBeforeAfterComparisons(): Promise<BeforeAfterComparison[]> {
  const rows = await queryPg<BeforeAfterComparison>('SELECT * FROM public.before_after_comparisons WHERE is_active = TRUE ORDER BY display_order ASC');
  const merged = mergeWithLocal<BeforeAfterComparison>(rows, 'before_after_comparisons');
  if (merged.length > 0) return merged.filter((b: any) => b.is_active !== false);
  if (data.before_after_comparisons?.length > 0) return data.before_after_comparisons;
  return [];
}

export async function getWeddingHighlights(): Promise<WeddingHighlight[]> {
  const rows = await queryPg<WeddingHighlight>('SELECT * FROM public.wedding_highlights WHERE is_active = TRUE ORDER BY display_order ASC');
  const merged = mergeWithLocal<WeddingHighlight>(rows, 'wedding_highlights');
  if (merged.length > 0) return merged.filter((w: any) => w.is_active !== false);
  if (data.wedding_highlights?.length > 0) return data.wedding_highlights;
  return [];
}

// ─────────────────────────────────────────────────────────────────────
// BLOGS, SEO SETTINGS & ANALYTICS
// ─────────────────────────────────────────────────────────────────────

export async function getBlogs(publishedOnly = true): Promise<BlogPost[]> {
  const sql = publishedOnly
    ? 'SELECT * FROM public.blogs WHERE is_published = TRUE ORDER BY published_at DESC'
    : 'SELECT * FROM public.blogs ORDER BY created_at DESC';
  const rows = await queryPg<BlogPost>(sql);
  const merged = mergeWithLocal<BlogPost>(rows, 'blogs');
  let list = merged;
  if (publishedOnly) {
    list = list.filter((b: any) => b.is_published !== false);
  }
  return list.sort((a, b) => {
    const timeA = new Date(a.published_at || a.created_at || 0).getTime();
    const timeB = new Date(b.published_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs(false);
  const post = blogs.find(b => b.slug === slug);
  return post || null;
}

export async function incrementBlogViews(slugOrId: string): Promise<void> {
  try {
    await queryPg(
      'UPDATE public.blogs SET views = COALESCE(views, 0) + 1 WHERE slug = $1 OR id = $1',
      [slugOrId]
    );
    const localBlogs = getLocalTable('blogs');
    const blog = localBlogs.find(b => b.slug === slugOrId || b.id === slugOrId);
    if (blog && blog.id) {
      updateLocal('blogs', blog.id, { views: (blog.views || 0) + 1 });
    }
  } catch (err) {
    console.warn('Failed to increment blog views:', err);
  }
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const rows = await queryPg<SeoSettings>('SELECT * FROM public.seo_settings LIMIT 1');
  const merged = mergeWithLocal<SeoSettings>(rows, 'seo_settings');
  if (merged.length > 0) return merged[0];

  return {
    id: 'default',
    site_title: 'Venner Photo Studio | Luxury Wedding & Portrait Photography in Surat',
    meta_description: "Surat's premier high-end photography studio specializing in luxury weddings, cinematic reels, editorial portraits, baby shoots, and commercial brand storytelling.",
    default_keywords: 'wedding photographer surat, best photo studio surat, luxury wedding photography, pre wedding shoot surat, baby photoshoot surat, maternity photographer, modeling portfolio surat',
    footer_keywords: [
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
      { keyword: 'Professional Photographers in Surat', url: '/team' }
    ],
    google_site_verification: '',
    og_image_url: '/logo.png',
    canonical_url: 'https://vennerphotostudio.com',
    robots_txt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /studio/\nDisallow: /api/',
  };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const rows = await queryPg<AnalyticsEvent>('SELECT * FROM public.analytics_events ORDER BY created_at DESC LIMIT 5000');
  const merged = mergeWithLocal<AnalyticsEvent>(rows, 'analytics_events');

  const totalViews = merged.length;
  const visitorIds = new Set<string>();
  const sessionIds = new Set<string>();
  const pageViewMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();

  const todayStr = new Date().toISOString().slice(0, 10);
  let todayViews = 0;

  for (const ev of merged) {
    if (ev.visitor_id) visitorIds.add(ev.visitor_id);
    if (ev.session_id) sessionIds.add(ev.session_id);

    const path = ev.page_path || '/';
    pageViewMap.set(path, (pageViewMap.get(path) || 0) + 1);

    const ref = ev.referrer && ev.referrer.trim() ? ev.referrer : 'Direct / Organic';
    let cleanRef = ref;
    try {
      if (ref.startsWith('http')) {
        const u = new URL(ref);
        cleanRef = u.hostname.replace('www.', '');
      }
    } catch {}
    referrerMap.set(cleanRef, (referrerMap.get(cleanRef) || 0) + 1);

    const dev = ev.device_type || 'Desktop';
    deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);

    const dateStr = (ev.created_at || '').slice(0, 10) || todayStr;
    dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
    if (dateStr === todayStr) {
      todayViews++;
    }
  }

  // Top pages
  const topPages = Array.from(pageViewMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top referrers
  const topReferrers = Array.from(referrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Devices
  const devices = Array.from(deviceMap.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  // Last 14 days sorted ascending
  const dailyViews = Array.from(dailyMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return {
    totalViews,
    totalVisitors: visitorIds.size || (totalViews > 0 ? Math.ceil(totalViews * 0.7) : 0),
    totalSessions: sessionIds.size || totalViews,
    todayViews,
    topPages,
    topReferrers,
    devices,
    dailyViews,
    recentVisits: merged.slice(0, 15),
  };
}


