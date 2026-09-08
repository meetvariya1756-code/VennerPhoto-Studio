import { NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const services = await getServices();
    const serviceLinks = services.map(s => ({
      title: s.title,
      slug: typeof s.slug === 'object' && s.slug ? (s.slug as any).current : s.slug,
    }));
    return NextResponse.json(serviceLinks);
  } catch (error) {
    console.error('API /api/services error:', error);
    return NextResponse.json([]);
  }
}
