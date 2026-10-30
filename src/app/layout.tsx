import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import { getSiteSettings, getSeoSettings } from '@/lib/db';
import { getLocalBusinessSchema } from '@/lib/metadata';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSeoSettings().catch(() => null),
  ]);

  const studioName = settings?.studio_name || 'Venner Photo Studio';
  const titleText = seo?.site_title || `${studioName} | Luxury Wedding & Portrait Photography`;
  const descriptionText = seo?.meta_description || settings?.tagline || 'Capturing Timeless Moments with Cinematic Elegance';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleText,
      template: `%s | ${studioName}`,
    },
    description: descriptionText,
    keywords: seo?.default_keywords || 'wedding photographer surat, luxury wedding photography, pre wedding shoot surat, baby photoshoot surat, indoor studio surat',
    verification: seo?.google_site_verification ? { google: seo.google_site_verification } : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: studioName,
      title: titleText,
      description: descriptionText,
      images: [
        {
          url: seo?.og_image_url || '/logo.png',
          width: 1200,
          height: 630,
          alt: studioName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description: descriptionText,
      images: [seo?.og_image_url || '/logo.png'],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = getLocalBusinessSchema();
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Venner Photo Studio',
    'url': 'https://vennerphotostudio.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://vennerphotostudio.com/services?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema, webSiteSchema]),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="flex flex-col min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
      >
        {/* Background privacy-friendly page view analytics tracker */}
        <AnalyticsTracker />

        {/* Responsive blurred header */}
        <Navbar />

        {/* Dynamic page context streams */}
        <main className="flex-1 w-full relative">
          {children}
        </main>

        {/* Global studio details footer deck */}
        <Footer />

        {/* Client-side toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              borderRadius: '0px',
              fontFamily: 'sans-serif',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#C9A86C',
                secondary: '#1A1A1A',
              },
            },
          }}
        />

        {/* Floating WhatsApp inquiry widget across all pages */}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
