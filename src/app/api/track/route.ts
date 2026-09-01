import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/sanity/client';
import { ClickTrackPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body: ClickTrackPayload = await req.json();
    const { channel, targetUrl, productName, conversionLogId } = body;

    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

    (async () => {
      try {
        if (process.env.SANITY_API_WRITE_TOKEN) {
          await sanityWriteClient.create({
            _type: 'clickTrack',
            channel: channel || 'unknown',
            targetUrl: targetUrl || '',
            productName: productName || 'Sản phẩm Shopee',
            conversionLogId: conversionLogId || '',
            ip,
            clickedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('[API Track] Sanity click track error:', err);
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API Track] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
