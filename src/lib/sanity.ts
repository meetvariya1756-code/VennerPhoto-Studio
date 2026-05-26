import { createClient } from 'next-sanity';
import { getMockPlaceholder } from './utils';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mock-project-id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2023-05-03';

export const client = createClient({
  projectId: projectId === 'mock-project-id' ? 'your-sanity-project-id' : projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

// Helper to determine if we are in mock mode
export const isMockMode = !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
                         process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'mock-project-id' ||
                         process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-sanity-project-id';

// High-fidelity Mock data generator for Venner Photo Studio
export const MOCK_DATA = {
  siteSettings: {
    studioName: 'Venner Photo Studio',
    tagline: 'Capturing Timeless Moments with Cinematic Elegance',
    phone: '+91 98259 83437',
    email: 'vennerphoto@gmail.com',
    address: 'B-27 Rangdarshan So-1 , Dhanmora , Katargam , Surat',
    workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM | Sunday: Available By Appointment Only',
    instagramUrl: 'https://instagram.com/vennerphotostudio',
    facebookUrl: 'https://facebook.com/vennerphotostudio',
    youtubeUrl: 'https://youtube.com/vennerphotostudio',
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.3462713549743!2d72.8274729!3d21.22271945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ebffcf5793f%3A0xf5564469239a54e7!2sVenner%20Photo%20Studio!5e1!3m2!1sen!2sin!4v1779775316406!5m2!1sen!2sin',
  },
  heroes: [
    {
      _id: 'hero-1',
      title: 'Chasing the Light, Capturing the Soul',
      subtitle: 'Premium editorial, wedding, and commercial photography tailored to your story.',
      ctaButtonText: 'Book Your Session',
      ctaButtonLink: '/contact',
      backgroundImage: { _type: 'image', asset: { _ref: 'image-1', _type: 'reference' } },
      backgroundVideoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/dog.mp4', // sample Cloudinary video
      isActive: true,
    },
    {
      _id: 'hero-2',
      title: 'Crafted with Elegance and Passion',
      subtitle: 'Immortalizing milestones, fashion editorials, and refined branding collections.',
      ctaButtonText: 'Explore Portfolio',
      ctaButtonLink: '/portfolio',
      backgroundImage: { _type: 'image', asset: { _ref: 'image-2', _type: 'reference' } },
      isActive: true,
    }
  ],
  services: [
    {
      _id: 'srv-wedding',
      title: 'Wedding Photography',
      slug: { _type: 'slug', current: 'wedding-photography' },
      shortDescription: 'Capturing your most precious moments on your special day with cinematic elegance.',
      fullDescription: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Our Wedding Photography service is designed for couples who seek a luxurious, emotional, and timeless record of their special day. We blend high-fashion editorial styling with candid photojournalism to encapsulate every tear, laugh, and dance move.',
            }
          ]
        }
      ],
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-0', _type: 'reference' } },
      gallery: [
        { _type: 'image', asset: { _ref: 'image-g1', _type: 'reference' } },
        { _type: 'image', asset: { _ref: 'image-g2', _type: 'reference' } },
        { _type: 'image', asset: { _ref: 'image-g3', _type: 'reference' } }
      ],
      packages: [
        {
          packageName: 'Classic Collection',
          price: '$2,500',
          features: ['6 Hours of Coverage', '1 Lead Photographer', '400 High-Res Edited Photos', 'Online Private Gallery']
        },
        {
          packageName: 'Luxury Collection',
          price: '$4,200',
          features: ['10 Hours of Coverage', '2 Lead Photographers', 'Engagements Shoot Included', '800 High-Res Edited Photos', 'Premium Linen Album']
        }
      ],
      order: 1,
      isActive: true
    },
    {
      _id: 'srv-engagement',
      title: 'Engagement Photography',
      slug: { _type: 'slug', current: 'engagement-photography' },
      shortDescription: 'Beautiful pre-wedding shoots that tell your unique love story.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-1', _type: 'reference' } },
      packages: [
        { packageName: 'Storybook Session', price: '$850', features: ['2 Hours on Location', '2 Outfits', '50 Edited Images', 'Digital Downloads'] }
      ],
      order: 2,
      isActive: true
    },
    {
      _id: 'srv-babyshower',
      title: 'Baby Shower Photography',
      slug: { _type: 'slug', current: 'baby-shower-photography' },
      shortDescription: 'Cherish the excitement of welcoming a new life with timeless photos.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-2', _type: 'reference' } },
      packages: [
        { packageName: 'Baby Bliss Standard', price: '$600', features: ['3 Hours Coverage', 'All raw files', '40 Retouched Images'] }
      ],
      order: 3,
      isActive: true
    },
    {
      _id: 'srv-children',
      title: 'Children Photography',
      slug: { _type: 'slug', current: 'children-photography' },
      shortDescription: 'Playful, candid, and expressive portraits of your little ones.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-3', _type: 'reference' } },
      packages: [
        { packageName: 'Laughter Session', price: '$400', features: ['1.5 Hour Session', 'Props Included', '30 Retouched Images'] }
      ],
      order: 4,
      isActive: true
    },
    {
      _id: 'srv-studio',
      title: 'Indoor Studio Photography',
      slug: { _type: 'slug', current: 'indoor-studio-photography' },
      shortDescription: 'Professional controlled lighting studio sessions for portraits and creative shoots.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-4', _type: 'reference' } },
      packages: [
        { packageName: 'Studio Elite', price: '$500', features: ['2 Hours Studio Time', 'Multiple Backdrops', '15 Fully Retouched Headshots'] }
      ],
      order: 5,
      isActive: true
    },
    {
      _id: 'srv-product',
      title: 'Product Photography',
      slug: { _type: 'slug', current: 'product-photography' },
      shortDescription: 'High-quality commercial product photos that make your brand stand out.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-5', _type: 'reference' } },
      packages: [
        { packageName: 'E-Commerce Pack', price: '$900', features: ['Up to 15 Products', 'Studio Lighting', 'White & Styled Backgrounds', 'Commercial Licensing'] }
      ],
      order: 6,
      isActive: true
    },
    {
      _id: 'srv-modeling',
      title: 'Modeling Photography',
      slug: { _type: 'slug', current: 'modeling-photography' },
      shortDescription: 'Portfolio and editorial modeling shoots for aspiring and professional models.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-6', _type: 'reference' } },
      packages: [
        { packageName: 'Editorial Portfolio', price: '$1,200', features: ['4 Hours Session', 'Makeup Artist On-Site', '4 Outfit Changes', '25 Premium Editorial Edits'] }
      ],
      order: 7,
      isActive: true
    },
    {
      _id: 'srv-corporate',
      title: 'Corporate Event Photography',
      slug: { _type: 'slug', current: 'corporate-event-photography' },
      shortDescription: 'Professional documentation of conferences, seminars, launches, and corporate events.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-7', _type: 'reference' } },
      packages: [
        { packageName: 'Half Day Corporate', price: '$1,500', features: ['4 Hours Coverage', 'Quick 24-Hour Highlights Delivery', 'Full Digital Library'] }
      ],
      order: 8,
      isActive: true
    },
    {
      _id: 'srv-birthday',
      title: 'Birthday Photography',
      slug: { _type: 'slug', current: 'birthday-photography' },
      shortDescription: 'Fun and vibrant photos to celebrate your birthday milestones.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-8', _type: 'reference' } },
      packages: [
        { packageName: 'Celebration Pack', price: '$500', features: ['3 Hours Coverage', 'Candid Party Photos', 'Online Group Gallery'] }
      ],
      order: 9,
      isActive: true
    },
    {
      _id: 'srv-maternity',
      title: 'Maternity Photography',
      slug: { _type: 'slug', current: 'maternity-photography' },
      shortDescription: 'Elegant and emotive portraits celebrating the beauty of pregnancy.',
      heroImage: { _type: 'image', asset: { _ref: 'image-srv-9', _type: 'reference' } },
      packages: [
        { packageName: 'Grace Maternity', price: '$650', features: ['2 Hours Shoot', 'Maternity Gowns Provided', '30 Retouched Art Prints'] }
      ],
      order: 10,
      isActive: true
    }
  ],
  portfolioPhotos: [
    { _id: 'p1', title: 'Eternal Vows', category: 'wedding-photography', isFeatured: true, tags: ['wedding', 'luxury'] },
    { _id: 'p2', title: 'Sunset Romance', category: 'engagement-photography', isFeatured: true, tags: ['engagement', 'sunset'] },
    { _id: 'p3', title: 'Golden Hour Smile', category: 'baby-shower-photography', isFeatured: false, tags: ['baby', 'celebration'] },
    { _id: 'p4', title: 'Pure Innocence', category: 'children-photography', isFeatured: true, tags: ['children', 'candid'] },
    { _id: 'p5', title: 'Shadow Play', category: 'indoor-studio-photography', isFeatured: true, tags: ['studio', 'editorial'] },
    { _id: 'p6', title: 'Aesthetic Geometry', category: 'product-photography', isFeatured: true, tags: ['product', 'brand'] },
    { _id: 'p7', title: 'High-Fashion Bold', category: 'modeling-photography', isFeatured: true, tags: ['modeling', 'fashion'] },
    { _id: 'p8', title: 'Leadership Conference', category: 'corporate-event-photography', isFeatured: false, tags: ['corporate', 'event'] },
    { _id: 'p9', title: 'Vibrant Milestones', category: 'birthday-photography', isFeatured: false, tags: ['birthday', 'fun'] },
    { _id: 'p10', title: 'Motherhood Grace', category: 'maternity-photography', isFeatured: true, tags: ['maternity', 'portrait'] }
  ],
  reels: [
    { _id: 'r1', title: 'The Cinematic Wedding Dream', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', category: 'wedding-photography', isFeatured: true },
    { _id: 'r2', title: 'Minimalist Leather Branding Product', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', category: 'product-photography', isFeatured: true },
    { _id: 'r3', title: 'Neon Studio Fashion Editorial', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', category: 'modeling-photography', isFeatured: true },
    { _id: 'r4', title: 'Sweet Maternity Golden Session', videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4', category: 'maternity-photography', isFeatured: false }
  ],
  team: [
    { _id: 't1', fullName: 'Julian Venner', role: 'Founder & Principal Photographer', bio: 'With over 12 years of experience capturing global fashion campaigns and elite destination weddings, Julian drives the artistic vision of Venner Studio.', specialization: 'Weddings & High Fashion Editorials', order: 1 },
    { _id: 't2', fullName: 'Sophia Reyes', role: 'Lead Lifestyle Photographer', bio: 'Sophia is a mastermind at children and maternity stories, capturing soft, emotive and natural lighting profiles.', specialization: 'Maternity, Children & Family Portraits', order: 2 },
    { _id: 't3', fullName: 'Marcus Vance', role: 'Senior Retoucher & Studio Artist', bio: 'Marcus meticulously refines every single piece of artwork, ensuring publication-quality color palettes and flawless tones.', specialization: 'Digital Art & Commercial Grade Color Grading', order: 3 }
  ],
  testimonials: [
    { _id: 'ts1', clientName: 'Alexander & Evelyn', serviceType: 'Wedding Photography', quote: 'Our wedding album is a masterpiece. Julian did not just take photos; he captured the exact emotions we felt. We will treasure these for our entire lives.', rating: 5, isActive: true },
    { _id: 'ts2', clientName: 'Nouveau Couture', serviceType: 'Product Photography', quote: 'Stunning commercial results! Our website conversion rate increased by 40% after posting Venner Photo Studio’s high-grade product portfolios.', rating: 5, isActive: true },
    { _id: 'ts3', clientName: 'Clara Bennett', serviceType: 'Maternity Photography', quote: 'Sophia made me feel incredibly comfortable, and the maternity shoot is absolutely breathtaking. Simply the best studio experience in NY.', rating: 5, isActive: true }
  ]
};
