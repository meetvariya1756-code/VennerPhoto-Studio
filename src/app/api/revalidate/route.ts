import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // 1. Verify webhook query token
    const revalidateSecret = process.env.REVALIDATE_SECRET || 'venner_studio_secret_9988';

    if (!secret || secret !== revalidateSecret) {
      return NextResponse.json({ error: 'Unauthorized revalidation request' }, { status: 401 });
    }

    // 2. Perform on-demand cache revalidation for standard pages
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/reels');
    revalidatePath('/services');
    revalidatePath('/services/[slug]', 'page');
    revalidatePath('/team');

    return NextResponse.json({
      revalidated: true,
      message: 'On-demand cache revalidation triggered successfully for all static paths',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Revalidation Error' }, { status: 500 });
  }
}
