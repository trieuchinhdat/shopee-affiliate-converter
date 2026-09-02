import { NextRequest, NextResponse } from 'next/server';
import { getTelegramConfigCached } from '@/lib/sanityCache';
import { NotifyClickPayload } from '@/lib/types';
import {
  formatVietnamTime,
  parseDevice,
  parseLocation,
  maskIp,
  isBotUserAgent,
  sendTelegramMessage,
} from '@/lib/telegram';

export const dynamic = 'force-dynamic';

// In-Memory cache for server-side deduplication & rate limiting
const recentClicksMap = new Map<string, number>();

// Clean up stale entries every 5 minutes to prevent memory leak
function cleanupStaleEntries() {
  const now = Date.now();
  recentClicksMap.forEach((timestamp, key) => {
    if (now - timestamp > 5 * 60 * 1000) {
      recentClicksMap.delete(key);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || '';

    // Step 1: Filter Bots and Crawlers
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json({ success: true, status: 'bot_ignored' });
    }

    const config = await getTelegramConfigCached(120);

    // Step 2: Check if Telegram notification is enabled and configured
    if (!config.enabled) {
      return NextResponse.json({ success: true, status: 'disabled' });
    }

    if (!config.token || !config.chatId) {
      return NextResponse.json({
        success: true,
        status: 'not_configured',
        hint: 'Vui lòng cấu hình Telegram Bot Token và Chat ID trong Sanity Studio hoặc .env.local',
      });
    }

    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      '127.0.0.1';

    const body: NotifyClickPayload = await req.json().catch(() => ({}));
    const product = body.product || { productName: 'Sản phẩm Shopee' };
    const voucher = body.voucher || {};

    const itemId = product.itemId || 'unknown';
    const dedupKey = `${rawIp}_${itemId}`;
    const now = Date.now();
    const cooldownMs = config.cooldownSeconds * 1000;

    // Step 3: Server-side Deduplication / Cooldown Check
    const lastClickTime = recentClicksMap.get(dedupKey);
    if (lastClickTime && now - lastClickTime < cooldownMs) {
      return NextResponse.json({ success: true, status: 'cooldown_debounced' });
    }

    // Record click timestamp
    recentClicksMap.set(dedupKey, now);
    if (recentClicksMap.size > 200) {
      cleanupStaleEntries();
    }

    // Step 4: Parse Device, Location, Time
    const timeFormatted = formatVietnamTime(new Date());
    const deviceFormatted = parseDevice(userAgent);
    const locationFormatted = parseLocation(req.headers);
    const maskedIp = maskIp(rawIp);

    // Format Voucher text: "FB22 (-22%)" or "Mã FB 22% (-22%)"
    const voucherCode = voucher.voucherCode || voucher.buttonLabel || 'Ưu đãi Shopee';
    const discountText = voucher.discountPercent ? ` (-${voucher.discountPercent}%)` : '';
    const voucherFormatted = `${voucherCode}${discountText}`;

    // Format ShopId / ItemId
    const shopItemIdFormatted =
      product.shopId && product.itemId
        ? `${product.shopId} / ${product.itemId}`
        : product.itemId || 'Chưa rõ';

    // Step 5: Format Telegram Message
    const message = [
      '🔔 [Shopee Affiliate] Lượt Click Mới!',
      `⏱️ Thời gian: ${timeFormatted}`,
      '━━━━━━━━━━━━━━━━━━',
      `🛍️ Sản phẩm: ${product.productName || 'Sản phẩm Shopee'}`,
      `🏷️ Mã: ${voucherFormatted}`,
      `📱 Thiết bị: ${deviceFormatted}`,
      `🌐 IP / Vị trí: ${maskedIp} (${locationFormatted})`,
      `🔗 ShopId/ItemId: ${shopItemIdFormatted}`,
    ].join('\n');

    // Step 6: Dispatch message (await to ensure Vercel Lambda does not freeze before completion)
    try {
      const sendResult = await sendTelegramMessage(config.token!, config.chatId!, message);
      if (!sendResult.success) {
        console.error('[Notify Click] Telegram failed:', sendResult.error);
        return NextResponse.json({ success: false, status: 'telegram_api_error', error: sendResult.error });
      }
    } catch (sendErr: any) {
      console.error('[Notify Click] Failed to dispatch Telegram message:', sendErr);
      return NextResponse.json({ success: false, status: 'dispatch_error', error: sendErr?.message });
    }

    return NextResponse.json({ success: true, status: 'notified' });
  } catch (err: any) {
    console.error('[Notify Click] Route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
