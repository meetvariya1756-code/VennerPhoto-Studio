-- ============================================================
-- VENNER PHOTO STUDIO — Production PostgreSQL Database Schema
-- Compatible with Standard PostgreSQL (pgAdmin/Postgres 18) & Supabase Cloud
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create auth schema & role stub for standard PostgreSQL compatibility (pgAdmin)
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text AS $$
  SELECT 'authenticated'::text;
$$ LANGUAGE sql STABLE;

-- ============================================================
-- UTILITY FUNCTIONS & TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE 1: site_settings (singleton row)
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
  privacy_policy TEXT DEFAULT '### PRIVACY POLICY & TERMS\n\nWelcome to Venner Photo Studio. We value your privacy and are committed to protecting your personal data.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure updated_at updates automatically
DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Default settings row
INSERT INTO site_settings (studio_name) VALUES ('Venner Photo Studio')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLE 2: heroes (Banners / Slider)
-- ============================================================
CREATE TABLE IF NOT EXISTS heroes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Chasing the Light, Capturing the Soul',
  subtitle TEXT DEFAULT 'Premium editorial, wedding, and commercial photography tailored to your story.',
  cta_text TEXT DEFAULT 'Book Your Session',
  cta_link TEXT DEFAULT '/contact',
  background_image_url TEXT DEFAULT '',
  mobile_background_image_url TEXT DEFAULT '',
  blur_data_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_heroes_active_order ON heroes(is_active, display_order ASC) WHERE is_active = TRUE;

-- ============================================================
-- TABLE 3: services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  thumbnail_image_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(is_active, display_order ASC);

-- ============================================================
-- TABLE 4: service_gallery (High performance image structure)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  blur_data_url TEXT DEFAULT '', -- LQIP Base64 blur placeholder for instant preview
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(5,2),
  file_size_bytes BIGINT,
  mime_type TEXT DEFAULT 'image/webp',
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  sub_category TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_gallery_service_order ON service_gallery(service_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_service_gallery_sub_category ON service_gallery(service_id, sub_category);

-- ============================================================
-- TABLE 5: service_packages
-- ============================================================
CREATE TABLE IF NOT EXISTS service_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  price TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_packages_service_order ON service_packages(service_id, display_order ASC);

-- ============================================================
-- TABLE 6: portfolio_photos (Optimized Large-Scale Gallery)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  image_url TEXT NOT NULL,               -- High resolution webp/avif CDN link
  thumbnail_url TEXT DEFAULT '',         -- Low resolution thumbnail for grid view
  blur_data_url TEXT DEFAULT '',         -- 10-20 byte Base64 BlurHash / SVG for 0-CLS preview
  width INTEGER,                         -- Image width in pixels
  height INTEGER,                        -- Image height in pixels
  aspect_ratio NUMERIC(5,2),             -- Pre-computed aspect ratio (e.g. 1.50)
  file_size_bytes BIGINT,                -- Storage byte size for telemetry
  mime_type TEXT DEFAULT 'image/webp',   -- File type
  category TEXT NOT NULL DEFAULT 'wedding-photography',
  alt_text TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',              -- Categorization array
  exif_data JSONB DEFAULT '{}'::jsonb,   -- Camera metadata (ISO, lens, shutter, camera model)
  is_featured BOOLEAN DEFAULT FALSE,
  captured_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes for 100,000+ photo scaling
CREATE INDEX IF NOT EXISTS idx_portfolio_category_created ON portfolio_photos(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_photos(is_featured, created_at DESC) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_portfolio_tags ON portfolio_photos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio_photos(created_at DESC);

-- Trigger for portfolio updated_at
DROP TRIGGER IF EXISTS trg_portfolio_photos_updated_at ON portfolio_photos;
CREATE TRIGGER trg_portfolio_photos_updated_at
  BEFORE UPDATE ON portfolio_photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TABLE 7: reels (Video Content)
-- ============================================================
CREATE TABLE IF NOT EXISTS reels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  blur_data_url TEXT DEFAULT '',
  category TEXT DEFAULT 'wedding-photography',
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reels_category ON reels(category, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_featured ON reels(is_featured, published_at DESC) WHERE is_featured = TRUE;

-- ============================================================
-- TABLE 8: team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  blur_data_url TEXT DEFAULT '',
  specialization TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(display_order ASC);

-- ============================================================
-- TABLE 9: testimonials
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

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active, created_at DESC) WHERE is_active = TRUE;

-- ============================================================
-- TABLE 10: before_after_comparisons
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

CREATE INDEX IF NOT EXISTS idx_before_after_order ON before_after_comparisons(is_active, display_order ASC);

-- ============================================================
-- TABLE 11: wedding_highlights
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

CREATE INDEX IF NOT EXISTS idx_wedding_highlights_order ON wedding_highlights(is_active, display_order ASC);

-- ============================================================
-- ROW LEVEL SECURITY (Compatible with local Postgres & Supabase RLS)
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_after_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_highlights ENABLE ROW LEVEL SECURITY;

-- Public READ policies
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read heroes" ON heroes;
CREATE POLICY "Public read heroes" ON heroes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read service_gallery" ON service_gallery;
CREATE POLICY "Public read service_gallery" ON service_gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read service_packages" ON service_packages;
CREATE POLICY "Public read service_packages" ON service_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read portfolio_photos" ON portfolio_photos;
CREATE POLICY "Public read portfolio_photos" ON portfolio_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read reels" ON reels;
CREATE POLICY "Public read reels" ON reels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read team_members" ON team_members;
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read before_after_comparisons" ON before_after_comparisons;
CREATE POLICY "Public read before_after_comparisons" ON before_after_comparisons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read wedding_highlights" ON wedding_highlights;
CREATE POLICY "Public read wedding_highlights" ON wedding_highlights FOR SELECT USING (true);

-- Authenticated WRITE policies (Admin dashboard)
DROP POLICY IF EXISTS "Auth write site_settings" ON site_settings;
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write heroes" ON heroes;
CREATE POLICY "Auth write heroes" ON heroes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write services" ON services;
CREATE POLICY "Auth write services" ON services FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write service_gallery" ON service_gallery;
CREATE POLICY "Auth write service_gallery" ON service_gallery FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write service_packages" ON service_packages;
CREATE POLICY "Auth write service_packages" ON service_packages FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write portfolio_photos" ON portfolio_photos;
CREATE POLICY "Auth write portfolio_photos" ON portfolio_photos FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write reels" ON reels;
CREATE POLICY "Auth write reels" ON reels FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write team_members" ON team_members;
CREATE POLICY "Auth write team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write testimonials" ON testimonials;
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write before_after_comparisons" ON before_after_comparisons;
CREATE POLICY "Auth write before_after_comparisons" ON before_after_comparisons FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth write wedding_highlights" ON wedding_highlights;
CREATE POLICY "Auth write wedding_highlights" ON wedding_highlights FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- INITIAL SEED DATA
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
