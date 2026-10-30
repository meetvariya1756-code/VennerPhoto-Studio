export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export interface Hero {
  _id: string;
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImage;
  mobileBackgroundImage?: SanityImage;
  backgroundVideoUrl?: string; // custom URL if using Cloudinary
  ctaButtonText?: string;
  ctaButtonLink?: string;
  isActive: boolean;
}

export interface ServicePackage {
  packageName: string;
  price: string;
  features: string[];
}

export interface Service {
  _id: string;
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  shortDescription: string;
  fullDescription?: any[]; // Block content rich text
  heroImage?: SanityImage;
  gallery?: SanityImage[];
  packages?: ServicePackage[];
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  order: number;
}

export interface PortfolioPhoto {
  _id: string;
  title: string;
  image: SanityImage;
  category: string; // e.g., 'wedding', 'product'
  tags?: string[];
  isFeatured: boolean;
  capturedDate?: string;
  altText?: string;
}

export interface Reel {
  _id: string;
  title: string;
  videoUrl: string; // Cloudinary URL
  thumbnailImage?: SanityImage;
  category: string;
  description?: string;
  isFeatured: boolean;
  publishedAt?: string;
}

export interface TeamMember {
  _id: string;
  fullName: string;
  role: string;
  photo: SanityImage;
  bio?: string;
  specialization?: string;
  instagramUrl?: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  serviceType?: string;
  quote: string;
  rating: number; // 1-5
  clientPhoto?: SanityImage;
  isActive: boolean;
}

export interface SiteSettings {
  _id: string;
  studioName: string;
  logo?: SanityImage;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  googleMapEmbedUrl?: string;
  privacyPolicy?: string;
}

export interface BeforeAfterComparison {
  _id: string;
  title: string;
  description?: string;
  beforeImage: string;
  afterImage: string;
  isActive: boolean;
  order: number;
}

export interface WeddingHighlight {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  category: string;
  author: string;
  meta_title?: string;
  meta_description?: string;
  seo_keywords?: string;
  is_published: boolean;
  published_at: string;
  views: number;
  reading_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FooterKeyword {
  keyword: string;
  url?: string;
}

export interface SeoSettings {
  id: string;
  site_title?: string;
  meta_description?: string;
  default_keywords?: string;
  footer_keywords: FooterKeyword[];
  google_site_verification?: string;
  og_image_url?: string;
  canonical_url?: string;
  robots_txt?: string;
  updated_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  page_path: string;
  visitor_id?: string;
  session_id?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalVisitors: number;
  totalSessions: number;
  todayViews: number;
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  devices: { device: string; count: number }[];
  dailyViews: { date: string; views: number }[];
  recentVisits: AnalyticsEvent[];
}

