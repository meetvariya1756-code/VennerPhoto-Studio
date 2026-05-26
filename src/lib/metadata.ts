import { Metadata } from 'next';

interface MetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function generateSiteMetadata({ title, description, path, image }: MetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = `${siteUrl}${path}`;
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const ogImage = image || defaultImage;

  return {
    title: `${title} | Venner Photo Studio`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | Venner Photo Studio`,
      description,
      url: fullUrl,
      siteName: 'Venner Photo Studio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Venner Photo Studio`,
      description,
      images: [ogImage],
    },
  };
}

export function getLocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Venner Photo Studio',
    'image': `${siteUrl}/og-image.jpg`,
    '@id': siteUrl,
    'url': siteUrl,
    'telephone': '+91 98259 83437',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'B-27 Rangdarshan So-1 , Dhanmora , Katargam',
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395004',
      'addressCountry': 'IN',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 21.22272,
      'longitude': 72.82747,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '09:00',
        'closes': '20:00',
      },
    ],
    'sameAs': [
      'https://instagram.com/vennerphotostudio',
      'https://facebook.com/vennerphotostudio',
      'https://youtube.com/vennerphotostudio',
    ],
  };
}
