import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check for admin session cookie fallback
  const adminSession = request.cookies.get('admin_session')?.value;
  if (adminSession === 'true') {
    return response;
  }

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'your-supabase-url' ||
    supabaseAnonKey === 'your-supabase-anon-key'
  ) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // 2.5s timeout safety so Vercel edge never throws 504 GATEWAY_TIMEOUT / MIDDLEWARE_INVOCATION_TIMEOUT
    const getUserPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null }; error: any }>((_, reject) =>
      setTimeout(() => reject(new Error('Auth Timeout')), 2500)
    );

    const { data } = await Promise.race([getUserPromise, timeoutPromise]);
    const user = data?.user;

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error('Middleware auth check error/timeout:', error);
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};

