-- =====================================================================
-- MIGRATION: SEO, Blog & Website Traffic Analytics Functionality
-- Target Database: PostgreSQL (venner_photo_studio / pgAdmin)
-- =====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. Table: blogs (SEO Articles & Editorial Journal)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT DEFAULT 'Wedding',
  author TEXT DEFAULT 'Venner Photo Studio',
  meta_title TEXT,
  meta_description TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  reading_time TEXT DEFAULT '5 min read',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for high-performance slug queries & listing by publish date
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);

-- ---------------------------------------------------------------------
-- 2. Table: seo_settings (Global SEO defaults & manageable footer keywords)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_title TEXT,
  meta_description TEXT,
  default_keywords TEXT,
  footer_keywords JSONB DEFAULT '[]'::jsonb,
  google_site_verification TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  robots_txt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 3. Table: analytics_events (Privacy-friendly website traffic & page views)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visitor_id TEXT,
  session_id TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for analytics aggregations & recent timeline queries
CREATE INDEX IF NOT EXISTS idx_analytics_path ON public.analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_device ON public.analytics_events(device_type);

-- ---------------------------------------------------------------------
-- 4. Supabase Row Level Security (RLS) Policies (Safe for Postgres & Supabase)
-- ---------------------------------------------------------------------
DO $$
BEGIN
  -- Enable RLS if tables are in Supabase
  EXECUTE 'ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN
  -- Ignored if standard PostgreSQL without auth role
  NULL;
END $$;

-- Public READ policies
DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read seo_settings" ON public.seo_settings;
CREATE POLICY "Public read seo_settings" ON public.seo_settings FOR SELECT USING (true);

-- Analytics events: Public can INSERT tracking events
DROP POLICY IF EXISTS "Public insert analytics_events" ON public.analytics_events;
CREATE POLICY "Public insert analytics_events" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Analytics events: Authenticated can view events
DROP POLICY IF EXISTS "Auth read analytics_events" ON public.analytics_events;
CREATE POLICY "Auth read analytics_events" ON public.analytics_events FOR SELECT USING (true);

-- Authenticated WRITE policies for Admin Panel
DROP POLICY IF EXISTS "Auth write blogs" ON public.blogs;
CREATE POLICY "Auth write blogs" ON public.blogs FOR ALL USING (true);

DROP POLICY IF EXISTS "Auth write seo_settings" ON public.seo_settings;
CREATE POLICY "Auth write seo_settings" ON public.seo_settings FOR ALL USING (true);

-- ---------------------------------------------------------------------
-- 5. Seed Data: Default SEO Settings & Footer Keywords
-- ---------------------------------------------------------------------
INSERT INTO public.seo_settings (
  id,
  site_title,
  meta_description,
  default_keywords,
  footer_keywords,
  canonical_url,
  robots_txt
) VALUES (
  'default',
  'Venner Photo Studio | Luxury Wedding & Portrait Photography in Surat',
  'Surat premier high-end photography studio specializing in luxury weddings, cinematic reels, editorial portraits, baby shoots, and commercial brand storytelling.',
  'wedding photographer surat, best photo studio surat, luxury wedding photography, pre wedding shoot surat, baby photoshoot surat, maternity photographer, modeling portfolio surat',
  '[
    {"keyword": "Best Wedding Photographer in Surat", "url": "/services/wedding-photography"},
    {"keyword": "Luxury Pre-Wedding Shoot Surat", "url": "/services/engagement-photography"},
    {"keyword": "Cinematic Wedding Highlights & Films", "url": "/reels"},
    {"keyword": "Indoor Photo Studio Katargam Surat", "url": "/services/indoor-studio-photography"},
    {"keyword": "Born Baby & Newborn Photography Surat", "url": "/services/born-baby"},
    {"keyword": "Baby Shower & Maternity Shoots", "url": "/services/baby-shower-photography"},
    {"keyword": "Fashion & Modeling Portfolio Shoots", "url": "/services/modeling-photography"},
    {"keyword": "Toddler & Kids Portrait Photography", "url": "/services/toddler-children"},
    {"keyword": "Commercial & Product Photography", "url": "/services/product-photography"},
    {"keyword": "Candid Destination Wedding Shoots", "url": "/portfolio"},
    {"keyword": "Professional Photographers in Surat", "url": "/team"},
    {"keyword": "Studio Journal & Wedding Guides", "url": "/blog"}
  ]'::jsonb,
  'https://vennerphotostudio.com',
  'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /studio/\nDisallow: /api/'
) ON CONFLICT (id) DO UPDATE SET
  footer_keywords = EXCLUDED.footer_keywords,
  updated_at = NOW();

-- ---------------------------------------------------------------------
-- 6. Seed Data: Initial High-Quality SEO Blog Posts
-- ---------------------------------------------------------------------
INSERT INTO public.blogs (
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image_url,
  category,
  author,
  meta_title,
  meta_description,
  seo_keywords,
  is_published,
  views,
  reading_time
) VALUES
(
  'e7b51138-032a-4ce2-a0b8-d9da1b0f51b1',
  'Top 10 Locations for Pre-Wedding Shoots in Surat & South Gujarat',
  'top-10-locations-pre-wedding-shoots-surat',
  'Discover the most breathtaking spots in Surat and South Gujarat for dreamy, cinematic pre-wedding photography sessions.',
  'Planning a pre-wedding shoot is one of the most exciting milestones before the big day. Surat, known for its rich cultural heritage and modern riverfront marvels, provides a sensational tapestry of backdrops for couples seeking cinematic romance.

### 1. Dumas Heritage & Coastal Shores
The golden hour at the coastline creates an ethereal atmosphere with soft reflective sand and breezy drama. We recommend flowing gowns and coordinated pastel attire to contrast against the sea.

### 2. Gopi Talav & Historic Dutch Gardens
For couples who appreciate regal heritage, the stone pavilions, intricately carved arches, and ancient brickwork provide an opulent ambiance reminiscent of royal eras.

### 3. Tapi Riverfront Walkway
Modern, sleek, and vibrant — the Tapi riverfront at sunset gives couples a metropolitan backdrop with twilight reflections that sparkle on camera.

### 4. Sarthana Nature Park & Dense Botanical Groves
Lush green canopies and dappled sunlight make this ideal for organic, fairy-tale aesthetics where the focus remains purely on candid intimacy.

### 5. Private Luxury Farmhouses & Controlled Studio Sets
At Venner Photo Studio, we also offer custom studio sets with specialized architectural lighting, ensuring perfect climate control, complete privacy, and magazine-grade portraits.

#### Tips for Your Shoot:
- **Timing**: Schedule 2 hours before sunset for the coveted golden hour.
- **Outfits**: Bring at least one royal traditional ensemble and one contemporary formal look.
- **Chemistry**: The best shots are unposed moments of laughter and subtle touch.',
  '/uploads/1788853159647_VAPW4871.jpg',
  'Pre-Wedding',
  'Venner Photo Studio',
  'Top 10 Pre-Wedding Shoot Locations in Surat | Venner Photo Studio',
  'Planning a pre-wedding shoot in Surat? Explore our curated list of 10 stunning locations with tips on lighting, outfits, and timing for cinematic photos.',
  'pre wedding shoot surat, best wedding photographer surat, pre wedding locations gujarat, cinematic photoshoot surat',
  true,
  248,
  '5 min read'
),
(
  'f8c62249-143b-4df3-b1c9-e0eb2c1f62c2',
  'Complete Wedding Photography Guide: Capturing Indian Ceremonies with Cinematic Elegance',
  'complete-indian-wedding-photography-guide',
  'From vibrant Haldi rituals to the poignant Vidai, here is how we capture every royal nuance and authentic emotion of Indian weddings.',
  'An Indian wedding is a kaleidoscopic symphony of emotion, traditions, and celebratory grandeur. With hundreds of guests and dozens of rituals spanning multiple days, thorough photographic planning is essential.

### The Haldi & Mehendi: Color and Spontaneity
Haldi is about joyous abandon and candid laughter. We prioritize prime lenses with fast apertures (f/1.4 - f/1.8) to isolate genuine reactions, tears of happiness, and flying yellow petals against soft blurry backgrounds.

### Sangeet & Cocktail Nights: Kinetic Energy
With elaborate dance choreography and dramatic stage lighting, high-speed shutter work and multi-strobe synchronization are crucial. Our cinematography team captures fluid 4K gimbal tracking shots that bring the performance to life.

### The Sacred Pheras & Royal Portraits
The ceremony requires solemn respect and razor-sharp anticipation. We capture both wide environmental compositions that show the mandap majesty, and intimate telephoto crops of the couple exchanging vows.

### Creating Your Custom Timeline
We always recommend scheduling 45 uninterrupted minutes between bridal dressing and the baraat arrival for dedicated solo bridal and groom editorial portraits before the whirlwind begins.',
  '/uploads/1788853176437_VAPW4872.jpg',
  'Wedding',
  'Venner Photo Studio',
  'Indian Wedding Photography Checklist & Guide | Venner Studio Surat',
  'Discover essential tips for planning your wedding photography coverage. Capture Haldi, Mehndi, and Pheras with timeless cinematic mastery.',
  'indian wedding photography, luxury wedding photographer surat, candid wedding photos, wedding cinematography surat',
  true,
  389,
  '6 min read'
),
(
  'a9d73350-254c-4ef4-c2da-f1fc3d2f73d3',
  'Mastering Studio Lighting: How We Create Timeless Editorial Portraits',
  'mastering-studio-lighting-editorial-portraits',
  'A behind-the-scenes look into our studio light setups, modifier choices, and color grading that define magazine-grade portraits.',
  'In studio portraiture, light is not merely illumination — it is the primary instrument of emotion and sculpture. In our Katargam, Surat studio, every light source is calibrated to accentuate skin tones and sculpt cheekbones.

### The Beauty Dish & Octabox Synergy
For high-fashion modeling portfolios and executive headshots, a 27-inch silver beauty dish positioned slightly above eye level creates signature catchlights and crisp contouring, while a 120cm diffused octabox provides gentle shadow fill.

### Negative Fill for Drama
By introducing large black V-flats on the shadow side of our subjects, we absorb stray bounces. This creates deep, cinematic Rembrandt falloff that evokes classical European oil paintings.

### Styling & Color Harmony
We advise clients to avoid heavy micro-patterns that cause moire distortion on camera. Monochromes, rich jewel tones, and tailored fits render with breathtaking clarity under our high-CRI strobe arrays.',
  '/uploads/1788853159647_VAPW4871.jpg',
  'Portrait',
  'Venner Photo Studio',
  'Studio Portrait Photography & Lighting Guide | Venner Photo Studio',
  'Learn how professional lighting and creative styling elevate indoor studio sessions, fashion portfolios, and commercial shoots.',
  'studio photography surat, portrait photographer surat, fashion portfolio shoot, indoor photo studio',
  true,
  182,
  '4 min read'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  seo_keywords = EXCLUDED.seo_keywords,
  updated_at = NOW();

