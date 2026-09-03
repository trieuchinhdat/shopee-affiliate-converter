import { NextRequest, NextResponse } from 'next/server';
import { getAppConfigCached } from '@/lib/sanityCache';
import { affipadService } from '@/lib/affipad-service';

export async function GET(req: NextRequest) {
  try {
    const config = await getAppConfigCached(0); // bypass cache for fresh quota
    const accounts = config.affipadAccounts || [];

    if (accounts.length === 0) {
      return NextResponse.json({
        success: true,
        enabled: config.enableAffipad !== false,
        fallbackVoucherUrl: config.fallbackVoucherUrl || null,
        fallbackNotice: config.fallbackNotice || null,
        totalAccounts: 0,
        activeAccounts: 0,
        totalLimit: 0,
        totalUsed: 0,
        totalRemaining: 0,
        accounts: [],
        message: 'Chưa cấu hình tài khoản AffiPad nào trong Sanity Studio.',
      });
    }

    const quotaList = await affipadService.checkAllQuotas(accounts);

    let totalLimit = 0;
    let totalUsed = 0;
    let totalRemaining = 0;
    let activeAccountsCount = 0;

    for (const item of quotaList) {
      if (!item.error && item.plan !== 'Tắt') {
        totalLimit += item.limit;
        totalUsed += item.used;
        totalRemaining += item.remaining;
        activeAccountsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      enabled: config.enableAffipad !== false,
      fallbackVoucherUrl: config.fallbackVoucherUrl || null,
      fallbackNotice: config.fallbackNotice || null,
      totalAccounts: accounts.length,
      activeAccounts: activeAccountsCount,
      totalLimit,
      totalUsed,
      totalRemaining,
      accounts: quotaList,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API Admin Affipad Quota] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Không thể kiểm tra hạn mức AffiPad',
      },
      { status: 500 }
    );
  }
}
