-- =====================================================================
-- VENNER PHOTO STUDIO — STANDALONE POSTGRESQL DATABASE SCHEMA
-- Target Database: venner_photo_studio
-- =====================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- Table: site_settings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  studio_name VARCHAR(255) NOT NULL DEFAULT 'Venner Photo Studio',
  tagline VARCHAR(255) DEFAULT 'Capturing Timeless Moments with Cinematic Elegance',
  phone VARCHAR(50) DEFAULT '+91 98259 83437',
  email VARCHAR(100) DEFAULT 'vennerphoto@gmail.com',
  address TEXT DEFAULT 'B-27 Rangdarshan So-1, Dhanmora, Katargam, Surat',
  working_hours VARCHAR(100) DEFAULT 'Mon - Sat: 9:00 AM - 8:00 PM',
  sunday_hours VARCHAR(100) DEFAULT 'Available By Appointment Only',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/vennerphoto',
  facebook_url TEXT DEFAULT 'https://www.facebook.com/share/18frTUd7PD/',
  youtube_url TEXT DEFAULT 'https://m.youtube.com/@vennerphoto',
  whatsapp_number VARCHAR(50) DEFAULT '919825983437',
  google_map_embed_url TEXT DEFAULT '',
  privacy_policy TEXT DEFAULT '### PRIVACY POLICY & TERMS',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: heroes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.heroes (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text VARCHAR(100) DEFAULT 'Book Your Session',
  cta_link VARCHAR(255) DEFAULT '/contact',
  background_image_url TEXT NOT NULL,
  mobile_background_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: services
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  hero_image_url TEXT,
  thumbnail_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: service_packages
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_packages (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  service_id VARCHAR(255) REFERENCES public.services(id) ON DELETE CASCADE,
  package_name VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  features TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: service_gallery
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_gallery (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  service_id VARCHAR(255) REFERENCES public.services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sub_category VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: portfolio_photos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_photos (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  alt_text TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  captured_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: reels
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reels (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: wedding_highlights
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wedding_highlights (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: before_after_comparisons
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.before_after_comparisons (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: team_members
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url TEXT,
  specialization VARCHAR(255),
  instagram_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: testimonials
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Table: contact_inquiries
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  service VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  location TEXT,
  message TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
