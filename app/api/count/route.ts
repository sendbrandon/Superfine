import { NextResponse } from 'next/server';
import { getCount } from '@/lib/list';

export const dynamic = 'force-dynamic';

export async function GET() {
  const c = await getCount();
  return NextResponse.json(c, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
