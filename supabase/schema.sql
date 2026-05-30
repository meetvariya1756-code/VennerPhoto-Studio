-- ============================================================
-- VENNER PHOTO STUDIO — Supabase Database Schema
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: site_settings (singleton row — only 1 row ever)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  studio_name TEXT NOT NULL DEFAULT 'Venner Photo Studio',
  tagline TEXT DEFAULT 'Capturing Timeless Moments with Cinematic Elegance',
  phone TEXT DEFAULT '+91 98259 83437',
  email TEXT DEFAULT 'vennerphoto@gmail.com',
  address TEXT DEFAULT 'B-27 Rangdarshan So-1, Dhanmora, Katargam, Surat',
  working_hours TEXT DEFAULT 'Mon - Sat: 9:00 AM - 8:00 PM',
  sunday_hours TEXT DEFAULT 'Available By Appointment Only',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/vennerphoto?igsh=cW53NnFuNjduanVj',
  facebook_url TEXT DEFAULT 'https://www.facebook.com/share/18frTUd7PD/',
  youtube_url TEXT DEFAULT 'https://m.youtube.com/@vennerphoto',
  whatsapp_number TEXT DEFAULT '919825983437',
  google_map_embed_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO site_settings (studio_name) VALUES ('Venner Photo Studio')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLE: heroes
-- ============================================================
CREATE TABLE IF NOT EXISTS heroes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Chasing the Light, Capturing the Soul',
  subtitle TEXT DEFAULT 'Premium editorial, wedding, and commercial photography tailored to your story.',
  cta_text TEXT DEFAULT 'Book Your Session',
  cta_link TEXT DEFAULT '/contact',
  background_image_url TEXT DEFAULT '',
  mobile_background_image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: service_gallery
-- ============================================================
CREATE TABLE IF NOT EXISTS service_gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: service_packages
-- ============================================================
CREATE TABLE IF NOT EXISTS service_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: portfolio_photos
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'wedding-photography',
  alt_text TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  captured_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: reels
-- ============================================================
CREATE TABLE IF NOT EXISTS reels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  category TEXT DEFAULT 'wedding-photography',
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  specialization TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  service_type TEXT DEFAULT '',
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS (run these separately if needed)
-- ============================================================
-- Create a single public bucket for all media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public READ access for all tables (website can read everything)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read heroes" ON heroes FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read service_gallery" ON service_gallery FOR SELECT USING (true);
CREATE POLICY "Public read service_packages" ON service_packages FOR SELECT USING (true);
CREATE POLICY "Public read portfolio_photos" ON portfolio_photos FOR SELECT USING (true);
CREATE POLICY "Public read reels" ON reels FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- Authenticated WRITE access (admin only)
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write heroes" ON heroes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write service_gallery" ON service_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write service_packages" ON service_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write portfolio_photos" ON portfolio_photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write reels" ON reels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Storage: Public read, Auth write
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — default services
-- ============================================================
INSERT INTO services (title, slug, short_description, display_order, is_active) VALUES
  ('Wedding Photography', 'wedding-photography', 'Capturing your most precious moments on your special day with cinematic elegance.', 1, true),
  ('Engagement Photography', 'engagement-photography', 'Beautiful pre-wedding shoots that tell your unique love story.', 2, true),
  ('Baby Shower Photography', 'baby-shower-photography', 'Cherish the excitement of welcoming a new life with timeless photos.', 3, true),
  ('Children Photography', 'children-photography', 'Playful, candid, and expressive portraits of your little ones.', 4, true),
  ('Indoor Studio Photography', 'indoor-studio-photography', 'Professional controlled lighting studio sessions for portraits and creative shoots.', 5, true),
  ('Product Photography', 'product-photography', 'High-quality commercial product photos that make your brand stand out.', 6, true),
  ('Modeling Photography', 'modeling-photography', 'Portfolio and editorial modeling shoots for aspiring and professional models.', 7, true),
  ('Corporate Event Photography', 'corporate-event-photography', 'Professional documentation of conferences, seminars, and corporate events.', 8, true),
  ('Birthday Photography', 'birthday-photography', 'Fun and vibrant photos to celebrate your birthday milestones.', 9, true),
  ('Maternity Photography', 'maternity-photography', 'Elegant and emotive portraits celebrating the beauty of pregnancy.', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABLE: before_after_comparisons
-- ============================================================
CREATE TABLE IF NOT EXISTS before_after_comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: wedding_highlights
-- ============================================================
CREATE TABLE IF NOT EXISTS wedding_highlights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE before_after_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_highlights ENABLE ROW LEVEL SECURITY;

-- Policies: Public Read
CREATE POLICY "Public read before_after_comparisons" ON before_after_comparisons FOR SELECT USING (true);
CREATE POLICY "Public read wedding_highlights" ON wedding_highlights FOR SELECT USING (true);

-- Policies: Authenticated Admin Write
CREATE POLICY "Auth write before_after_comparisons" ON before_after_comparisons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write wedding_highlights" ON wedding_highlights FOR ALL USING (auth.role() = 'authenticated');
