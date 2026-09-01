import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';
import { VoucherItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const vouchers = await sanityClient.fetch<VoucherItem[]>(
      `*[_type == "voucher" && isActive != false] | order(orderPriority asc, discountPercent desc){
        _id,
        voucherCode,
        buttonLabel,
        channel,
        discountPercent,
        maxDiscount,
        minSpend,
        description,
        status,
        isActive,
        isHighlighted,
        orderPriority,
        usageProgress,
        startTime,
        endTime
      }`,
      {},
      { cache: 'no-store' }
    );

    return NextResponse.json({
      success: true,
      vouchers: (vouchers || []).filter((v) => v.isActive !== false),
    });
  } catch (err: any) {
    console.error('[API Vouchers] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
