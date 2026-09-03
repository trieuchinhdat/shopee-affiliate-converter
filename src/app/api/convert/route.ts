import { NextRequest, NextResponse } from 'next/server';
import { resolveShopeeProduct, isValidShopeeUrl, extractShopeeUrl, extractShopeeIds } from '@/lib/shopee-resolver';
import { generateAllUniversalLinks } from '@/lib/universal-link';
import { getAppConfigCached, getActiveVouchersCached, getThemeConfigCached } from '@/lib/sanityCache';
import { affipadService } from '@/lib/affipad-service';
import { ConvertResult, UniversalLinks } from '@/lib/types';

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

    // Server-side Desktop Guard (protects AffiPad quota from PC bots and scrapers)
    const theme = await getThemeConfigCached(60);
    if (theme.blockDesktopConvert !== false) {
      const userAgent = req.headers.get('user-agent') || '';
      const secChUaMobile = req.headers.get('sec-ch-ua-mobile');
      const isClientHintMobile = secChUaMobile === '?1';

      if (!isClientHintMobile) {
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
        const isDesktopOS = /Windows NT|Macintosh|Linux x86_64|X11/i.test(userAgent) && !isMobileUA;
        const isBot = !userAgent || /curl|postman|python|axios|httpclient/i.test(userAgent);

        if (isDesktopOS || isBot) {
          return NextResponse.json<ConvertResult>(
            {
              success: false,
              error: 'Vui lòng sử dụng điện thoại để quét mã và chuyển đổi link trên Shopee App.',
            },
            { status: 403 }
          );
        }
      }
    }

    const config = await getAppConfigCached(60);

    // ⚡ KIỂM TRA NHANH (0ms): Nếu toàn bộ tài khoản AffiPad đã cạn kiệt 1.000 lượt và có Link Kho Voucher Dự Phòng
    // Thực hiện Direct Auto-Redirect ngay lập tức để ghi nhận hoa hồng gián tiếp cho khách
    const affipadConfigured = config.enableAffipad !== false && config.affipadAccounts && config.affipadAccounts.length > 0;
    const hasAvailableAffipad = affipadConfigured && affipadService.hasAvailableAccounts(config.affipadAccounts!);

    if (!hasAvailableAffipad && config.fallbackVoucherUrl && config.fallbackVoucherUrl.trim()) {
      const fallbackUrl = config.fallbackVoucherUrl.trim();
      return NextResponse.json<ConvertResult>({
        success: true,
        isFallback: true,
        directRedirectUrl: fallbackUrl,
        fallbackNotice: config.fallbackNotice || 'Đang mở Kho Voucher Shopee để nhận ưu đãi...',
      });
    }

    const [product, vouchers] = await Promise.all([
      resolveShopeeProduct(cleanUrl),
      getActiveVouchersCached(60),
    ]);

    let links: UniversalLinks;
    let isFallback = false;
    let fallbackNotice: string | undefined = undefined;

    // ⚡ 1. Ưu tiên chuyển đổi qua AffiPad Multi-Account Pool (Tạo link có credential_token sống cho từng sản phẩm)
    let directLink: string | null = null;
    if (affipadConfigured) {
      try {
        const affResult = await affipadService.convertProductUrl(
          cleanUrl,
          product.shopId,
          product.itemId,
          config.affipadAccounts!,
          config.affipadCacheTtlHours || 12
        );

        if (affResult && affResult.link) {
          directLink = affResult.link;
        }
      } catch (affErr) {
        console.error('[API Convert] Affipad conversion error:', affErr);
      }
    }

    if (directLink) {
      // Thành công với AffiPad
      links = {
        facebook: {
          fb25: directLink,
          fb22: directLink,
          fb20: directLink,
        },
        youtube: directLink,
        instagram: directLink,
        zalo: directLink,
      };
    } else if (config.fallbackVoucherUrl && config.fallbackVoucherUrl.trim()) {
      // ⚡ 2. Kích hoạt Direct Auto-Redirect đến Kho Voucher Shopee khi hết 1.000 lượt (hoa hồng gián tiếp)
      const fallbackUrl = config.fallbackVoucherUrl.trim();
      return NextResponse.json<ConvertResult>({
        success: true,
        isFallback: true,
        directRedirectUrl: fallbackUrl,
        fallbackNotice: config.fallbackNotice || 'Đang mở Kho Voucher Shopee để nhận ưu đãi...',
      });
    } else {
      // ⚡ 3. Dự phòng cấp 3: Tạo Universal Link sản phẩm cơ bản
      links = generateAllUniversalLinks(
        product.shopId,
        product.itemId,
        config.affiliateId,
        config.defaultSubId || 'web_converter'
      );
    }

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
      isFallback,
      fallbackNotice,
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
