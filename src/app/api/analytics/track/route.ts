import { NextResponse } from 'next/server';
import { queryPg } from '@/lib/postgres';
import { insertLocal } from '@/lib/localDb';
import { incrementBlogViews } from '@/lib/db';

function parseUserAgent(userAgent: string): { device: string; browser: string; os: string } {
  const ua = userAgent.toLowerCase();
  
  // Device
  let device = 'Desktop';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    device = 'Mobile';
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'Tablet';
  }

  // OS
  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Other';
  if (/instagram/i.test(ua)) browser = 'Instagram';
  else if (/fbav|fban/i.test(ua)) browser = 'Facebook';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { device, browser, os };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { page_path, visitor_id, session_id, referrer } = body;

    if (!page_path || typeof page_path !== 'string') {
      return NextResponse.json({ error: 'Missing page_path' }, { status: 400 });
    }

    // Never track admin or sanity studio paths
    if (page_path.startsWith('/admin') || page_path.startsWith('/studio')) {
      return NextResponse.json({ skipped: true });
    }

    const uaHeader = request.headers.get('user-agent') || '';
    const { device, browser, os } = parseUserAgent(uaHeader);

    const eventRecord = {
      page_path,
      visitor_id: visitor_id || null,
      session_id: session_id || null,
      referrer: referrer || null,
      device_type: device,
      browser,
      os,
      created_at: new Date().toISOString(),
    };

    // Increment blog views if viewing a specific blog
    if (page_path.startsWith('/blog/')) {
      const slug = page_path.replace('/blog/', '').split('?')[0].split('#')[0];
      if (slug) {
        incrementBlogViews(slug).catch(() => {});
      }
    }

    // Insert into Postgres if available
    try {
      await queryPg(
        `INSERT INTO public.analytics_events (page_path, visitor_id, session_id, referrer, device_type, browser, os, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [page_path, visitor_id || null, session_id || null, referrer || null, device, browser, os]
      );
    } catch {}

    // Always store in localDb
    insertLocal('analytics_events', eventRecord);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Tracking error' }, { status: 500 });
  }
}

