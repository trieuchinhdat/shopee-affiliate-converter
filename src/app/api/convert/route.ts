import { NextRequest, NextResponse } from 'next/server';
import { resolveShopeeProduct, isValidShopeeUrl, extractShopeeUrl, extractShopeeIds } from '@/lib/shopee-resolver';
import { generateAllUniversalLinks, parseFacebookPayload, DEFAULT_FB_PAYLOAD } from '@/lib/universal-link';
import { sanityClient } from '@/sanity/client';
import { AppConfig, VoucherItem, ConvertResult } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

async function getAppConfig(): Promise<AppConfig> {
  try {
    const config = await sanityClient.fetch<AppConfig>(
      `*[_type == "appConfig"] | order(_updatedAt desc)[0]{
        affiliateId,
        defaultSubId,
        savingsNotice,
        zaloGroupUrl,
        autoBlinkTopDiscount,
        facebookSampleUrls
      }`,
      {},
      { cache: 'no-store' }
    );

    if (config?.affiliateId) {
      return config;
    }
  } catch (err) {
    console.error('[API Convert] Error fetching Sanity appConfig:', err);
  }

  return {
    affiliateId: process.env.DEFAULT_AFFILIATE_ID || 'an_17387060372',
    defaultSubId: process.env.DEFAULT_SUB_ID || 'web_converter',
    savingsNotice: 'Áp dụng mã trên App Shopee để nhận ưu đãi cao nhất!',
    zaloGroupUrl: 'https://zalo.me/g/kczvyi443',
    autoBlinkTopDiscount: true,
  };
}

async function getActiveVouchers(): Promise<VoucherItem[]> {
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
        usageProgress
      }`,
      {},
      { cache: 'no-store' }
    );

    if (vouchers && vouchers.length > 0) {
      return vouchers.filter((v) => v.isActive !== false);
    }
  } catch (err) {
    console.error('[API Convert] Error fetching vouchers:', err);
  }

  return [
    {
      _id: 'v_fb22',
      voucherCode: 'FB22SALE',
      buttonLabel: 'Mã FB 22%',
      channel: 'fb_22',
      discountPercent: 22,
      maxDiscount: 100000,
      minSpend: 150000,
      description: 'Giảm 22% tối đa 100k cho đơn từ 150k',
      status: 'active',
      isHighlighted: true,
      orderPriority: 1,
      usageProgress: 88,
    },
    {
      _id: 'v_fb20',
      voucherCode: 'FB20OFF',
      buttonLabel: 'Mã FB 20%',
      channel: 'fb_20',
      discountPercent: 20,
      maxDiscount: 2000000,
      minSpend: 500000,
      description: 'Giảm 20% tối đa 2tr cho đơn từ 500k',
      status: 'active',
      isHighlighted: false,
      orderPriority: 2,
      usageProgress: 85,
    },
    {
      _id: 'v_ytb',
      voucherCode: 'YOUTUBE20',
      buttonLabel: 'Mã YouTube 20%',
      channel: 'ytb',
      discountPercent: 20,
      maxDiscount: 2000000,
      minSpend: 500000,
      description: 'Giảm 20% tối đa 2tr đơn từ 500k (Độc quyền)',
      status: 'active',
      isHighlighted: true,
      orderPriority: 3,
      usageProgress: 90,
    },
    {
      _id: 'v_ig',
      voucherCode: 'IGSALE',
      buttonLabel: 'Mã IG',
      channel: 'ig',
      discountPercent: 18,
      maxDiscount: 100000,
      minSpend: 150000,
      description: 'Giảm 18% tối đa 100k cho đơn từ 150k',
      status: 'active',
      isHighlighted: false,
      orderPriority: 4,
      usageProgress: 80,
    },
  ];
}

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
    const [config, vouchers] = await Promise.all([getAppConfig(), getActiveVouchers()]);

    let selectedFbPayload = DEFAULT_FB_PAYLOAD;

    if (config.facebookSampleUrls && config.facebookSampleUrls.length > 0) {
      const activeUrls = config.facebookSampleUrls.filter(
        (item) => item.isActive !== false && item.url && item.url.trim()
      );

      if (activeUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeUrls.length);
        const chosen = activeUrls[randomIndex];
        const parsed = parseFacebookPayload(chosen.url);
        if (parsed) {
          selectedFbPayload = parsed;
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
