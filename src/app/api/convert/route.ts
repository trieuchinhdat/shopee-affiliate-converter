import { NextRequest, NextResponse } from 'next/server';
import { resolveShopeeProduct, isValidShopeeUrl, extractShopeeUrl, extractShopeeIds } from '@/lib/shopee-resolver';
import { generateAllUniversalLinks, resolveAndExtractFacebookPayload, DEFAULT_FB_PAYLOAD } from '@/lib/universal-link';
import { getAppConfigCached, getActiveVouchersCached } from '@/lib/sanityCache';
import { ConvertResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json<ConvertResult>(
        { success: false, error: 'Vui lòng dán link sản phẩm Shopee.' },
        { status: 400 }
      );
    }

    const rawInput = url.trim();
    const cleanUrl = extractShopeeUrl(rawInput) || rawInput;

    const hasDirectIds = Boolean(extractShopeeIds(cleanUrl) || extractShopeeIds(rawInput));

    if (!isValidShopeeUrl(cleanUrl) && !hasDirectIds) {
      return NextResponse.json<ConvertResult>(
        { success: false, error: 'Link không đúng định dạng Shopee (shopee.vn, s.shopee.vn, vn.shp.ee, shope.ee).' },
        { status: 400 }
      );
    }

    const product = await resolveShopeeProduct(cleanUrl);
    const [config, vouchers] = await Promise.all([getAppConfigCached(60), getActiveVouchersCached(60)]);

    let selectedFbPayload = DEFAULT_FB_PAYLOAD;

    if (config.facebookSampleUrls && config.facebookSampleUrls.length > 0) {
      const activeUrls = config.facebookSampleUrls.filter(
        (item) => item.isActive !== false && item.url && item.url.trim()
      );

      if (activeUrls.length > 0) {
        // Try active URLs in order (top item first), pick the first one that resolves successfully
        for (const item of activeUrls) {
          try {
            const parsed = await resolveAndExtractFacebookPayload(item.url);
            if (parsed) {
              selectedFbPayload = parsed;
              break;
            }
          } catch (err) {
            console.error('[API Convert] Error resolving FB sample item:', err);
          }
        }
      }
    }

    const links = generateAllUniversalLinks(
      product.shopId,
      product.itemId,
      config.affiliateId,
      config.defaultSubId || 'web_converter',
      selectedFbPayload
    );

    let maxPercent = 22;
    const topVoucher = vouchers.find((v) => v.status === 'active');
    if (topVoucher && topVoucher.discountPercent) {
      maxPercent = topVoucher.discountPercent;
    }

    const price = product.price || 150000;
    const estimatedSavings = Math.min(Math.round((price * maxPercent) / 100), 2000000);

    return NextResponse.json<ConvertResult>({
      success: true,
      product,
      links,
      vouchers,
      savingsEstimate: {
        percent: maxPercent,
        amount: estimatedSavings,
        formattedAmount: `${new Intl.NumberFormat('vi-VN').format(estimatedSavings)}đ`,
      },
    });
  } catch (err: any) {
    console.error('[API Convert] Error:', err);
    return NextResponse.json<ConvertResult>(
      { success: false, error: err.message || 'Lỗi khi xử lý link Shopee.' },
      { status: 500 }
    );
  }
}
