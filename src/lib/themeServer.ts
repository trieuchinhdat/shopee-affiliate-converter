import { sanityClient } from '@/sanity/client';
import { urlForImage } from '@/sanity/image';
import { ThemeConfig } from '@/lib/types';

export async function getThemeConfig(): Promise<ThemeConfig> {
  try {
    const [rawTheme, rawAppConfig] = await Promise.all([
      sanityClient.fetch<any>(
        `*[_type == "themeConfig"][0]{
          logoType,
          logoText,
          logoHighlightText,
          logoBadge,
          logoImage,
          subTitle,
          backgroundType,
          backgroundColor,
          gradientStart,
          gradientEnd,
          backgroundImage,
          backgroundOverlayOpacity,
          bannerBadgeText,
          heroTitle,
          heroSubtitle,
          showZaloCard,
          zaloCardTitle,
          zaloCardSubtitle,
          zaloCardMembers,
          zaloCardButtonText,
          showFloatingZalo,
          floatingZaloText
        }`,
        {},
        { next: { revalidate: 0 } }
      ),
      sanityClient.fetch<any>(
        `*[_type == "appConfig"][0]{
          zaloGroupUrl
        }`,
        {},
        { next: { revalidate: 0 } }
      ),
    ]);

    return {
      logoType: rawTheme?.logoType || 'text',
      logoText: rawTheme?.logoText || 'SALE',
      logoHighlightText: rawTheme?.logoHighlightText || 'SỐC',
      logoBadge: rawTheme?.logoBadge || 'VIP',
      logoImageUrl: rawTheme?.logoImage ? urlForImage(rawTheme.logoImage) : undefined,
      subTitle: rawTheme?.subTitle || 'Voucher Hunter Shopee',
      backgroundType: rawTheme?.backgroundType || 'gradient',
      backgroundColor: rawTheme?.backgroundColor || '#0b0f19',
      gradientStart: rawTheme?.gradientStart || '#0b0f19',
      gradientEnd: rawTheme?.gradientEnd || '#1c1008',
      backgroundImageUrl: rawTheme?.backgroundImage ? urlForImage(rawTheme.backgroundImage) : undefined,
      backgroundOverlayOpacity: typeof rawTheme?.backgroundOverlayOpacity === 'number' ? rawTheme.backgroundOverlayOpacity : 85,
      bannerBadgeText: rawTheme?.bannerBadgeText || 'Tự động kích hoạt mã giảm giá sâu nhất',
      heroTitle: rawTheme?.heroTitle || 'Chuyển Đổi Link Shopee',
      heroSubtitle: rawTheme?.heroSubtitle || 'Dán link sản phẩm Shopee để nhận ngay mã FB 22%, YouTube 20% độc quyền.',
      zaloGroupUrl: rawAppConfig?.zaloGroupUrl || 'https://zalo.me/g/kczvyi443',
      showZaloCard: rawTheme?.showZaloCard !== false,
      zaloCardTitle: rawTheme?.zaloCardTitle || 'Nhóm Zalo Báo Mã Săn Sale',
      zaloCardSubtitle: rawTheme?.zaloCardSubtitle || 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
      zaloCardMembers: rawTheme?.zaloCardMembers || 'Hơn 15.000+ thành viên',
      zaloCardButtonText: rawTheme?.zaloCardButtonText || 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
      showFloatingZalo: rawTheme?.showFloatingZalo !== false,
      floatingZaloText: rawTheme?.floatingZaloText || 'Nhận mã 22% & mã Live sớm nhất! 💬',
    };
  } catch (err) {
    console.error('[SSR Theme] Error fetching theme from Sanity:', err);
    return {
      logoType: 'text',
      logoText: 'SALE',
      logoHighlightText: 'SỐC',
      logoBadge: 'PRO',
      subTitle: 'Voucher Hunter Shopee',
      backgroundType: 'gradient',
      backgroundColor: '#0b0f19',
      gradientStart: '#0b0f19',
      gradientEnd: '#1c1008',
      bannerBadgeText: 'Tự động kích hoạt mã giảm giá sâu nhất',
      heroTitle: 'Chuyển Đổi Link Shopee',
      heroSubtitle: 'Dán link sản phẩm Shopee để nhận ngay mã FB 22%, YouTube 20% độc quyền.',
      zaloGroupUrl: 'https://zalo.me/g/kczvyi443',
      showZaloCard: true,
      zaloCardTitle: 'Nhóm Zalo Báo Mã Săn Sale',
      zaloCardSubtitle: 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
      zaloCardMembers: 'Hơn 15.000+ thành viên',
      zaloCardButtonText: 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
      showFloatingZalo: true,
      floatingZaloText: 'Nhận mã 22% & mã Live sớm nhất! 💬',
    };
  }
}
