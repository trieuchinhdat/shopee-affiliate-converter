import { NextResponse } from 'next/server';
import { getActiveVouchersCached } from '@/lib/sanityCache';

export const revalidate = 60;

export async function GET() {
  try {
    const vouchers = await getActiveVouchersCached(60);

    return NextResponse.json({
      success: true,
      vouchers,
    });
  } catch (err: any) {
    console.error('[API Vouchers] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
