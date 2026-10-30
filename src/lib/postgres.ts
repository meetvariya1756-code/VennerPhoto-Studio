import { Pool } from 'pg';

let pool: Pool | null = null;
let isPgOffline = false;
let lastPgCheckTime = 0;
const PG_OFFLINE_COOLDOWN_MS = 15000; // 15 seconds cooldown before re-probing offline PostgreSQL

export function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  
  // If no custom DATABASE_URL configured or dummy placeholder, return null to fallback smoothly
  if (!connectionString || connectionString.includes('your-postgres-connection-string')) {
    return null;
  }

  // Fast circuit breaker: if PostgreSQL failed recently, skip trying for 15s to keep website load 0ms
  if (isPgOffline && Date.now() - lastPgCheckTime < PG_OFFLINE_COOLDOWN_MS) {
    return null;
  }

  if (!pool) {
    const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');

    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 1500, // Reduced timeout so pages never hang
      ssl: isRemote ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.warn('PostgreSQL Pool notice:', err?.message || err);
      isPgOffline = true;
      lastPgCheckTime = Date.now();
    });
  }
  return pool;
}

let tablesChecked = false;

export async function ensureTablesExist(): Promise<void> {
  if (tablesChecked) return;
  const p = getPgPool();
  if (!p) return;

  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image_url TEXT,
        category TEXT DEFAULT 'Photography',
        author TEXT DEFAULT 'Venner Photo Studio',
        meta_title TEXT,
        meta_description TEXT,
        seo_keywords TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        views INTEGER DEFAULT 0,
        reading_time TEXT DEFAULT '4 min read',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

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
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        page_path TEXT NOT NULL,
        visitor_id TEXT,
        session_id TEXT,
        referrer TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs (slug);
      CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs (is_published, published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_analytics_path ON public.analytics_events (page_path);
      CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events (created_at DESC);
    `);
    tablesChecked = true;
  } catch (err: any) {
    console.warn('PostgreSQL table check notice:', err?.message || err);
  }
}

export async function queryPg<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const p = getPgPool();
    if (!p) return [];
    if (!tablesChecked && (sql.includes('blogs') || sql.includes('seo_settings') || sql.includes('analytics_events'))) {
      await ensureTablesExist();
    }
    const result = await p.query(sql, params);
    isPgOffline = false; // Connection healthy
    return result.rows as T[];
  } catch (error: any) {
    isPgOffline = true;
    lastPgCheckTime = Date.now();
    console.warn('PostgreSQL Query Notice:', error?.message || error);
    return [];
  }
}


