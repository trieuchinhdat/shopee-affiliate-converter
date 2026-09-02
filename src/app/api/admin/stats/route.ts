import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const vouchersQuery = `*[_type == "voucher"] | order(orderPriority asc, discountPercent desc){
      _id,
      voucherCode,
      buttonLabel,
      channel,
      discountPercent,
      maxDiscount,
      minSpend,
      status,
      isActive,
      badgeText,
      orderPriority
    }`;

    const appConfigQuery = `*[_type == "appConfig"][0]{
      affiliateId,
      defaultSubId,
      savingsNotice,
      zaloGroupUrl,
      autoBlinkTopDiscount,
      facebookSampleUrls,
      enableTelegramNotify,
      telegramBotToken,
      telegramChatId,
      telegramCooldownSeconds
    }`;

    const themeConfigQuery = `*[_type == "themeConfig"][0]{
      logoText,
      logoHighlightText,
      metaTitle,
      backgroundType,
      _updatedAt
    }`;

    const adminCountQuery = `count(*[_type == "adminUser"])`;

    const [vouchers, appConfig, themeConfig, adminCount] = await Promise.all([
      sanityClient.fetch<any[]>(vouchersQuery),
      sanityClient.fetch<any>(appConfigQuery),
      sanityClient.fetch<any>(themeConfigQuery),
      sanityClient.fetch<number>(adminCountQuery),
    ]);

    const activeVouchers = (vouchers || []).filter((v) => v.isActive !== false && v.status === 'active');
    const expiredVouchers = (vouchers || []).filter((v) => v.isActive !== false && v.status === 'expired');
    const disabledVouchers = (vouchers || []).filter((v) => v.isActive === false);

    return NextResponse.json({
      success: true,
      stats: {
        totalVouchers: vouchers?.length || 0,
        activeVouchersCount: activeVouchers.length,
        expiredVouchersCount: expiredVouchers.length,
        disabledVouchersCount: disabledVouchers.length,
        vouchers: vouchers || [],
        appConfig: appConfig || null,
        themeConfig: themeConfig || null,
        adminUsersCount: adminCount || 0,
      },
    });
  } catch (err: any) {
    console.error('[API Admin Stats] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
