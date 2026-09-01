import { NextRequest, NextResponse } from 'next/server';
import { resolveShopeeProduct, isValidShopeeUrl } from '@/lib/shopee-resolver';
import { generateAllUniversalLinks } from '@/lib/universal-link';
import { sanityClient, sanityWriteClient } from '@/sanity/client';
import { AppConfig, VoucherItem, ConvertResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

let cachedConfig: { data: AppConfig; expiresAt: number } | null = null;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && cachedConfig.expiresAt > Date.now()) {
    return cachedConfig.data;
  }

  try {
    const config = await sanityClient.fetch<AppConfig>(
      `*[_type == "appConfig"][0]{
        affiliateId,
        defaultSubId,
        savingsNotice,
        zaloGroupUrl,
        autoBlinkTopDiscount
      }`
    );

    if (config?.affiliateId) {
      cachedConfig = {
        data: config,
        expiresAt: Date.now() + 60 * 1000,
      };
      return config;
    }
  } catch (err) {
    console.error('[API Convert] Error fetching Sanity appConfig:', err);
  }

  return {
    affiliateId: process.env.DEFAULT_AFFILIATE_ID || 'an_17356640097',
    defaultSubId: process.env.DEFAULT_SUB_ID || 'web_converter',
    savingsNotice: 'Áp dụng mã trên App Shopee để nhận ưu đãi cao nhất!',
    zaloGroupUrl: 'https://zalo.me/g/kczvyi443',
    autoBlinkTopDiscount: true,
  };
}

async function getActiveVouchers(): Promise<VoucherItem[]> {
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
        usageProgress
      }`
    );

    if (vouchers && vouchers.length > 0) {
      return vouchers;
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

    if (!url || typeof url !== 'string') {
      return NextResponse.json<ConvertResult>(
        { success: false, error: 'Vui lòng cung cấp link Shopee hợp lệ.' },
        { status: 400 }
      );
    }

    if (!isValidShopeeUrl(url)) {
      return NextResponse.json<ConvertResult>(
        { success: false, error: 'Link không đúng định dạng Shopee (shopee.vn, s.shopee.vn, shp.ee).' },
        { status: 400 }
      );
    }

    const product = await resolveShopeeProduct(url);
    const [config, vouchers] = await Promise.all([getAppConfig(), getActiveVouchers()]);

    const links = generateAllUniversalLinks(
      product.shopId,
      product.itemId,
      config.affiliateId,
      config.defaultSubId || 'web_converter'
    );

    let maxPercent = 22;
    const topVoucher = vouchers.find((v) => v.status === 'active');
    if (topVoucher && topVoucher.discountPercent) {
      maxPercent = topVoucher.discountPercent;
    }

    const price = product.price || 150000;
    const estimatedSavings = Math.min(Math.round((price * maxPercent) / 100), 2000000);

    let logId: string | undefined = undefined;
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(userAgent);

    (async () => {
      try {
        if (process.env.SANITY_API_WRITE_TOKEN) {
          await sanityWriteClient.create({
            _type: 'conversionLog',
            inputUrl: url,
            shopId: product.shopId,
            itemId: product.itemId,
            productName: product.productName,
            price: product.price || 0,
            imageUrl: product.imageUrl,
            ip,
            userAgent,
            device: isMobile ? 'Mobile' : 'Desktop',
            affiliateIdUsed: config.affiliateId,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (logErr) {
        console.error('[API Convert] Sanity log error:', logErr);
      }
    })();

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
      conversionLogId: logId,
    });
  } catch (err: any) {
    console.error('[API Convert] Error:', err);
    return NextResponse.json<ConvertResult>(
      { success: false, error: err.message || 'Lỗi khi xử lý link Shopee.' },
      { status: 500 }
    );
  }
}
