import { client, isMockMode, MOCK_DATA } from './sanity';
import { Hero, Service, PortfolioPhoto, Reel, TeamMember, Testimonial, SiteSettings } from '@/types';
import { getMockPlaceholder } from './utils';

// GROQ query definitions
export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;
export const heroesQuery = `*[_type == "hero" && isActive == true] | order(_createdAt desc)`;
export const servicesQuery = `*[_type == "service" && isActive == true] | order(order asc)`;
export const serviceBySlugQuery = `*[_type == "service" && slug.current == $slug && isActive == true][0]`;
export const portfolioPhotosQuery = `*[_type == "portfolioPhoto"] | order(capturedDate desc)`;
export const featuredPortfolioPhotosQuery = `*[_type == "portfolioPhoto" && isFeatured == true] | order(capturedDate desc)`;
export const reelsQuery = `*[_type == "reel"] | order(publishedAt desc)`;
export const teamMembersQuery = `*[_type == "teamMember"] | order(order asc)`;
export const testimonialsQuery = `*[_type == "testimonial" && isActive == true] | order(_createdAt desc)`;

// Fetching wrappers that dynamically resolve between CMS and high-fidelity mockups
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isMockMode) {
    return MOCK_DATA.siteSettings as SiteSettings;
  }
  return client.fetch(siteSettingsQuery);
}

export async function getHeroes(): Promise<Hero[]> {
  if (isMockMode) {
    return MOCK_DATA.heroes.map((hero, i) => ({
      ...hero,
      backgroundImage: {
        _type: 'image' as const,
        asset: { _ref: `mock-hero-${i}`, _type: 'reference' as const }
      }
    })) as Hero[];
  }
  return client.fetch(heroesQuery);
}

export async function getServices(): Promise<Service[]> {
  if (isMockMode) {
    return MOCK_DATA.services.map((srv, i) => ({
      ...srv,
      heroImage: {
        _type: 'image' as const,
        asset: { _ref: `mock-srv-${i}`, _type: 'reference' as const }
      }
    })) as unknown as Service[];
  }
  return client.fetch(servicesQuery);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (isMockMode) {
    const srv = MOCK_DATA.services.find(s => s.slug.current === slug);
    if (!srv) return null;
    return {
      ...srv,
      heroImage: {
        _type: 'image' as const,
        asset: { _ref: `mock-srv-slug`, _type: 'reference' as const }
      }
    } as unknown as Service;
  }
  return client.fetch(serviceBySlugQuery, { slug });
}

export async function getPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  if (isMockMode) {
    return MOCK_DATA.portfolioPhotos.map((photo, i) => ({
      ...photo,
      image: {
        _type: 'image' as const,
        asset: { _ref: `mock-photo-${i}`, _type: 'reference' as const }
      }
    })) as PortfolioPhoto[];
  }
  return client.fetch(portfolioPhotosQuery);
}

export async function getFeaturedPortfolioPhotos(): Promise<PortfolioPhoto[]> {
  if (isMockMode) {
    return MOCK_DATA.portfolioPhotos
      .filter(p => p.isFeatured)
      .map((photo, i) => ({
        ...photo,
        image: {
          _type: 'image' as const,
          asset: { _ref: `mock-photo-feat-${i}`, _type: 'reference' as const }
        }
      })) as PortfolioPhoto[];
  }
  return client.fetch(featuredPortfolioPhotosQuery);
}

export async function getReels(): Promise<Reel[]> {
  if (isMockMode) {
    return MOCK_DATA.reels.map((reel, i) => ({
      ...reel,
      thumbnailImage: {
        _type: 'image' as const,
        asset: { _ref: `mock-reel-${i}`, _type: 'reference' as const }
      }
    })) as Reel[];
  }
  return client.fetch(reelsQuery);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isMockMode) {
    return MOCK_DATA.team.map((t, i) => ({
      ...t,
      photo: {
        _type: 'image' as const,
        asset: { _ref: `mock-team-${i}`, _type: 'reference' as const }
      }
    })) as TeamMember[];
  }
  return client.fetch(teamMembersQuery);
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  if (isMockMode) {
    return MOCK_DATA.testimonials as Testimonial[];
  }
  return client.fetch(testimonialsQuery);
}
