import { NextResponse } from 'next/server';
import { getThemeConfig } from '@/lib/themeServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const theme = await getThemeConfig();

    return NextResponse.json(
      { success: true, theme },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('[API Theme] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
