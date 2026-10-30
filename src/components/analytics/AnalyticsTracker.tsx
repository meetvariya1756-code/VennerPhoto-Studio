'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Do not track admin or studio views
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/studio')) {
      return;
    }

    // Prevent duplicate tracks for the same path in a single render cycle
    if (lastTrackedPathRef.current === pathname) {
      return;
    }
    lastTrackedPathRef.current = pathname;

    try {
      // Get or create persistent visitor ID
      let visitorId = localStorage.getItem('venner_visitor_id');
      if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem('venner_visitor_id', visitorId);
      }

      // Get or create session ID
      let sessionId = sessionStorage.getItem('venner_session_id');
      if (!sessionId) {
        sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem('venner_session_id', sessionId);
      }

      const referrer = document.referrer || '';

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: pathname,
          visitor_id: visitorId,
          session_id: sessionId,
          referrer,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Ignore client tracking errors
    }
  }, [pathname]);

  return null;
}

