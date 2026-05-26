import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';
import { getSiteSettings } from '@/lib/sanity.queries';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const studioName = settings?.studioName || 'Venner Photo Studio';
  const tagline = settings?.tagline || 'Capturing Timeless Moments with Cinematic Elegance';

  return {
    title: {
      default: `${studioName} | Professional Photography`,
      template: `%s | ${studioName}`,
    },
    description: tagline,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://vennerphotostudio.com',
      siteName: studioName,
      title: studioName,
      description: tagline,
    },
    twitter: {
      card: 'summary_large_image',
      title: studioName,
      description: tagline,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="flex flex-col min-h-screen bg-[#F9F7F4] text-[#1A1A1A]"
      >
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
