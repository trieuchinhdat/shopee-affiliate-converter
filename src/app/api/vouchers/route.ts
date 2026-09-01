import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';
import { VoucherItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vouchers = await sanityClient.fetch<VoucherItem[]>(
      `*[_type == "voucher"] | order(orderPriority asc, discountPercent desc){
        _id,
        voucherCode,
        buttonLabel,
        channel,
        discountPercent,
        maxDiscount,
        minSpend,
        description,
        status,
        isHighlighted,
        orderPriority,
        usageProgress,
        startTime,
        endTime
      }`
    );

    return NextResponse.json({ success: true, vouchers: vouchers || [] });
  } catch (err: any) {
    console.error('[API Vouchers] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
