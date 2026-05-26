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
}
