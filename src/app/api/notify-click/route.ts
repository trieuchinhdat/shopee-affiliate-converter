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
  escapeHtml,
  truncateProductName,
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

    // Prioritize Cloudflare / Vercel Edge IP headers for highest accuracy
    const rawIp =
      req.headers.get('cf-connecting-ip')?.trim() ||
      req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip')?.trim() ||
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

    // Format Product Title & Direct Shopee Link
    const rawProductName = product.productName || 'Sản phẩm Shopee';
    const truncatedTitle = truncateProductName(rawProductName, 55);
    const productShopeeUrl =
      product.shopId && product.itemId
        ? `https://shopee.vn/product/${product.shopId}/${product.itemId}`
        : product.canonicalUrl || product.originalUrl || 'https://shopee.vn';

    // Format Voucher text: METAPARSEP2201 (-22% FB)
    const discountPercent = voucher.discountPercent || 0;
    const rawVoucherCode = voucher.voucherCode || voucher.buttonLabel || 'Ưu đãi Shopee';
    const channelRaw = voucher.channel || '';
    const channelTag = channelRaw.startsWith('fb')
      ? ' FB'
      : channelRaw === 'ytb'
      ? ' YT'
      : channelRaw === 'ig'
      ? ' IG'
      : channelRaw === 'zalo'
      ? ' Zalo'
      : '';
    const discountTag = discountPercent > 0 ? ` (-${discountPercent}%${channelTag})` : '';

    // Step 5: Format Telegram Message in HTML mode (Minimalist layout without emoji icons)
    const message = [
      '━━━━━━━━━━━━━━━━━━',
      '<b>[Shopee Affiliate] Lượt Click Mới!</b>',
      timeFormatted,
      `<b>Sản phẩm:</b> <a href="${productShopeeUrl}">${escapeHtml(truncatedTitle)}</a>`,
      `<b>Voucher:</b> <code>${escapeHtml(rawVoucherCode)}</code>${discountTag}`,
      `<b>Thiết bị:</b> ${escapeHtml(deviceFormatted)} · ${escapeHtml(locationFormatted)} (<code>${maskedIp}</code>)`,
      '━━━━━━━━━━━━━━━━━━',
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
