import { sanityClient } from '@/sanity/client';
import { urlForImage, urlForOgImage } from '@/sanity/image';
import { AppConfig, VoucherItem, SuggestedVoucherItem, ThemeConfig, BannerSlideItem } from './types';

interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheItem<any>>();

function getCached<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (item && item.expiresAt > Date.now()) {
    return item.data as T;
  }
  return null;
}

function setCached<T>(key: string, data: T, ttlSeconds: number = 60): T {
  const actualTtl = process.env.NODE_ENV === 'development' ? 2 : ttlSeconds;
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + actualTtl * 1000,
  });
  return data;
}

export function clearSanityCache() {
  memoryCache.clear();
}

/**
 * 1. Cached AppConfig (TTL: 60s)
 */
export async function getAppConfigCached(ttl: number = 60): Promise<AppConfig> {
  const cacheKey = 'sanity_app_config';
  const cached = getCached<AppConfig>(cacheKey);
  if (cached) return cached;

  try {
    const config = await sanityClient.fetch<AppConfig>(
      `*[_type == "appConfig"] | order(_updatedAt desc)[0]{
        affiliateId,
        defaultSubId,
        savingsNotice,
        zaloGroupUrl,
        autoBlinkTopDiscount,
        facebookSampleUrls,
        enableAffipad,
        affipadAccounts,
        affipadCacheTtlHours,
        fallbackVoucherUrl,
        fallbackNotice,
        enableTelegramNotify,
        telegramBotToken,
        telegramChatId,
        telegramCooldownSeconds
      }`
    );

    if (config?.affiliateId) {
      return setCached(cacheKey, config, ttl);
    }
  } catch (err) {
    console.error('[SanityCache] Error fetching appConfig:', err);
  }

  const fallback: AppConfig = {
    affiliateId: process.env.DEFAULT_AFFILIATE_ID || 'an_17387060372',
    defaultSubId: process.env.DEFAULT_SUB_ID || 'web_converter',
    savingsNotice: 'Áp dụng mã trên App Shopee để nhận ưu đãi cao nhất!',
    zaloGroupUrl: 'https://zalo.me/g/kczvyi443',
    autoBlinkTopDiscount: true,
  };

  return setCached(cacheKey, fallback, 15); // Fallback short TTL in case of temporary network issue
}

/**
 * 2. Cached Active Vouchers (TTL: 60s)
 */
export async function getActiveVouchersCached(ttl: number = 60): Promise<VoucherItem[]> {
  const cacheKey = 'sanity_active_vouchers';
  const cached = getCached<VoucherItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const vouchers = await sanityClient.fetch<VoucherItem[]>(
      `*[_type == "voucher" && !(_id in path("drafts.**")) && isActive != false] | order(orderPriority asc, discountPercent desc){
        _id,
        voucherCode,
        buttonLabel,
        channel,
        discountPercent,
        maxDiscount,
        minSpend,
        customTitle,
        customMinSpendText,
        description,
        brandPreset,
        brandLabel,
        "customBrandLogoUrl": customBrandLogo.asset->url,
        badgeType,
        badgeText,
        urgencyType,
        customUrgencyText,
        expiryText,
        status,
        isActive,
        orderPriority,
        usageProgress,
        startTime,
        endTime
      }`
    );

    if (vouchers && vouchers.length > 0) {
      const activeList = vouchers.filter((v) => v.isActive !== false);
      return setCached(cacheKey, activeList, ttl);
    }
  } catch (err) {
    console.error('[SanityCache] Error fetching active vouchers:', err);
  }

  const fallbackVouchers: VoucherItem[] = [
    {
      _id: 'v_fb22',
      voucherCode: 'FB22SALE',
      buttonLabel: 'Mã FB 22%',
      channel: 'fb_22',
      discountPercent: 22,
      maxDiscount: 300000,
      minSpend: 50000,
      customTitle: 'giảm 22% Giảm tối đa 300kđ',
      customMinSpendText: 'Đơn tối thiểu 50kđ',
      brandPreset: 'facebook',
      brandLabel: 'FACEBOOK',
      badgeType: 'exclusive_outline',
      badgeText: 'Độc Quyền Facebook',
      urgencyType: 'percent_used',
      expiryText: 'Còn 13 giờ',
      status: 'active',
      orderPriority: 1,
      usageProgress: 82,
    },
    {
      _id: 'v_ytb',
      voucherCode: 'YOUTUBE18',
      buttonLabel: 'Mã YouTube 18%',
      channel: 'ytb',
      discountPercent: 18,
      maxDiscount: 2000000,
      minSpend: 500000,
      customTitle: 'giảm 18% Giảm tối đa 2trđ',
      customMinSpendText: 'Đơn tối thiểu 500kđ',
      brandPreset: 'youtube',
      brandLabel: 'YouTube',
      badgeType: 'exclusive_outline',
      badgeText: 'Độc Quyền YouTube Shopping',
      urgencyType: 'none',
      expiryText: 'Còn 1 ngày',
      status: 'active',
      orderPriority: 2,
      usageProgress: 75,
    },
    {
      _id: 'v_trendy',
      voucherCode: 'TRENDY15',
      buttonLabel: 'Mã Shopee Trendy 15%',
      channel: 'all',
      discountPercent: 15,
      maxDiscount: 350000,
      minSpend: 100000,
      customTitle: 'giảm 15% Giảm tối đa 350kđ',
      customMinSpendText: 'Đơn tối thiểu 100kđ',
      brandPreset: 'shopee_trendy',
      brandLabel: 'Toàn Ngành Hàng',
      badgeType: 'flash_sale',
      badgeText: 'Số lượng có hạn',
      urgencyType: 'running_out',
      expiryText: 'Còn 13 giờ',
      status: 'active',
      orderPriority: 3,
      usageProgress: 65,
    },
    {
      _id: 'v_shopee',
      voucherCode: 'SHOPEE20',
      buttonLabel: 'Mã Shopee 20%',
      channel: 'all',
      discountPercent: 20,
      maxDiscount: 10000,
      minSpend: 0,
      customTitle: 'giảm 20% Giảm tối đa 10kđ',
      customMinSpendText: 'Đơn tối thiểu 0đ',
      brandPreset: 'shopee',
      brandLabel: 'SHOPEE',
      badgeType: 'none',
      urgencyType: 'none',
      expiryText: 'Còn 13 giờ',
      status: 'active',
      orderPriority: 4,
      usageProgress: 45,
    },
  ];

  return setCached(cacheKey, fallbackVouchers, 15);
}

/**
 * 2b. Cached Suggested Vouchers Hot (TTL: 60s)
 */
export async function getSuggestedVouchersCached(ttl: number = 60): Promise<SuggestedVoucherItem[]> {
  const cacheKey = 'sanity_suggested_vouchers';
  const cached = getCached<SuggestedVoucherItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const vouchers = await sanityClient.fetch<any[]>(
      `*[_type == "suggestedVoucher" && isActive != false] | order(orderPriority asc, _createdAt desc){
        _id,
        title,
        image,
        "imageUrl": image.asset->url,
        linkUrl,
        badgeText,
        orderPriority,
        isActive
      }`
    );

    if (vouchers && vouchers.length > 0) {
      return setCached(cacheKey, vouchers, ttl);
    }
  } catch (err) {
    console.error('[SanityCache] Error fetching suggested vouchers:', err);
  }

  return [];
}

/**
 * 3. Cached Theme Config (TTL: 60s)
 */
export async function getThemeConfigCached(ttl: number = 60): Promise<ThemeConfig> {
  const cacheKey = 'sanity_theme_config';
  const cached = getCached<ThemeConfig>(cacheKey);
  if (cached) return cached;

  try {
    const [rawTheme, rawAppConfig] = await Promise.all([
      sanityClient.fetch<any>(
        `*[_type == "themeConfig"] | order(_updatedAt desc)[0]{
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
          // Slide Banner Fields
          showHeroBanner,
          bannerAutoSlide,
          bannerAutoSlideInterval,
          bannerSlides[]{
            _key,
            title,
            image,
            desktopImage,
            mobileImage,
            linkUrl,
            openInNewTab,
            isActive
          },
          // Legacy Banner Fields for backwards compatibility
          heroBannerDesktopImage,
          heroBannerMobileImage,
          heroBannerAltText,
          heroBannerLink,
          // Mobile Home Sections & Notice Toggles
          voucherNoticeText,
          showSocialProofTicker,
          socialProofMessages,
          showQuickGuide,
          showSuggestedVouchers,
          suggestedVouchersTitle,
          suggestedVouchersLayout,
          // Desktop Restriction & QR Handoff
          blockDesktopConvert,
          desktopButtonText,
          desktopModalTitle,
          desktopModalSubtitle,
          // Zalo & Social Fields
          showZaloCard,
          zaloCardTitle,
          zaloCardSubtitle,
          zaloCardMembers,
          zaloCardButtonText,
          showFloatingZalo,
          floatingZaloText,
          metaTitle,
          metaDescription,
          metaKeywords,
          ogImage,
          canonicalUrl
        }`
      ),
      getAppConfigCached(ttl),
    ]);

    const logoText = rawTheme?.logoText || 'SALE';
    const logoHighlightText = rawTheme?.logoHighlightText || 'HUNTER';

    // Parse and normalize banner slides
    const parsedSlides: BannerSlideItem[] = Array.isArray(rawTheme?.bannerSlides)
      ? rawTheme.bannerSlides
          .filter((s: any) => s && s.isActive !== false)
          .map((s: any) => {
            const singleImg = s.image ? urlForImage(s.image) : undefined;
            const desktopImg = s.desktopImage ? urlForImage(s.desktopImage) : undefined;
            const mobileImg = s.mobileImage ? urlForImage(s.mobileImage) : undefined;
            const resolvedImg = singleImg || desktopImg || mobileImg;

            return {
              _key: s._key,
              title: s.title || 'Banner Khuyến Mãi Shopee',
              imageUrl: resolvedImg,
              desktopImageUrl: resolvedImg,
              mobileImageUrl: resolvedImg,
              linkUrl: s.linkUrl || undefined,
              openInNewTab: s.openInNewTab !== false,
              isActive: s.isActive !== false,
            };
          })
          .filter((s: BannerSlideItem) => Boolean(s.imageUrl || s.desktopImageUrl || s.mobileImageUrl))
      : [];

    // Fallback to legacy single banner if slides are not configured yet
    if (parsedSlides.length === 0 && rawTheme?.heroBannerDesktopImage) {
      const legacyDesktop = urlForImage(rawTheme.heroBannerDesktopImage);
      const legacyMobile = rawTheme.heroBannerMobileImage ? urlForImage(rawTheme.heroBannerMobileImage) : legacyDesktop;
      const legacyImg = legacyDesktop || legacyMobile;
      if (legacyImg) {
        parsedSlides.push({
          _key: 'legacy-banner-slide',
          title: rawTheme.heroBannerAltText || 'Banner Siêu Sale Shopee',
          imageUrl: legacyImg,
          desktopImageUrl: legacyImg,
          mobileImageUrl: legacyImg,
          linkUrl: rawTheme.heroBannerLink || undefined,
          openInNewTab: true,
          isActive: true,
        });
      }
    }

    const defaultMetaTitle = 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%';
    const defaultMetaDesc = 'Sale Hunter - Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.';

    const defaultSocialMessages = [
      'Khách HN vừa nhận mã FB 22% (-65k)',
      'Khách HCM vừa áp mã YT 20% (-150k)',
      'Khách ĐN vừa nhận mã FB 25% (-120k)',
      '1.450+ lượt lấy mã thành công hôm nay',
      'Mã Shopee Live & Video vừa áp (-70k)',
    ];

    const result: ThemeConfig = {
      logoType: rawTheme?.logoType || 'text',
      logoText,
      logoHighlightText,
      logoBadge: rawTheme?.logoBadge || 'VIP',
      logoImageUrl: rawTheme?.logoImage ? urlForImage(rawTheme.logoImage) : undefined,
      subTitle: rawTheme?.subTitle || 'Sale Hunter Shopee',
      backgroundType: rawTheme?.backgroundType || 'gradient',
      backgroundColor: rawTheme?.backgroundColor || '#0b0f19',
      gradientStart: rawTheme?.gradientStart || '#0b0f19',
      gradientEnd: rawTheme?.gradientEnd || '#1c1008',
      backgroundImageUrl: rawTheme?.backgroundImage ? urlForImage(rawTheme.backgroundImage) : undefined,
      backgroundOverlayOpacity: typeof rawTheme?.backgroundOverlayOpacity === 'number' ? rawTheme.backgroundOverlayOpacity : 85,
      // Slide Banner Mapped Fields
      showHeroBanner: rawTheme?.showHeroBanner !== false,
      bannerAutoSlide: rawTheme?.bannerAutoSlide !== false,
      bannerAutoSlideInterval: typeof rawTheme?.bannerAutoSlideInterval === 'number' && rawTheme.bannerAutoSlideInterval >= 2 ? rawTheme.bannerAutoSlideInterval : 5,
      bannerSlides: parsedSlides,
      voucherNoticeText: rawTheme?.voucherNoticeText || 'Nếu click link không thấy mã Youtube/Facebook/Instagram → cần xóa shopee tải lại hoặc đổi tài khoản khác do tài khoản của bạn đã bị lọc.',
      // Mobile Home Sections Toggles
      showSocialProofTicker: rawTheme?.showSocialProofTicker !== false,
      socialProofMessages: Array.isArray(rawTheme?.socialProofMessages) && rawTheme.socialProofMessages.filter(Boolean).length > 0
        ? rawTheme.socialProofMessages.filter(Boolean)
        : defaultSocialMessages,
      showQuickGuide: rawTheme?.showQuickGuide !== false,
      showSuggestedVouchers: rawTheme?.showSuggestedVouchers !== false,
      suggestedVouchersTitle: rawTheme?.suggestedVouchersTitle || 'Gợi Ý Voucher Hot Hôm Nay',
      suggestedVouchersLayout: rawTheme?.suggestedVouchersLayout === 'grid' ? 'grid' : 'slide',
      // Desktop Restriction Settings
      blockDesktopConvert: rawTheme?.blockDesktopConvert !== false,
      desktopButtonText: rawTheme?.desktopButtonText || 'QUÉT MÃ MỞ TRÊN ĐIỆN THOẠI',
      desktopModalTitle: rawTheme?.desktopModalTitle || 'Mở trên điện thoại để nhận mã 25%',
      desktopModalSubtitle: rawTheme?.desktopModalSubtitle || 'Mã giảm giá Shopee độc quyền và tính năng tự động mở App hoạt động tối ưu nhất trên điện thoại di động.',
      // Zalo Card & Floating
      zaloGroupUrl: rawAppConfig?.zaloGroupUrl || 'https://zalo.me/g/kczvyi443',
      showZaloCard: rawTheme?.showZaloCard !== false,
      zaloCardTitle: rawTheme?.zaloCardTitle || 'Nhóm Zalo Báo Mã Săn Sale',
      zaloCardSubtitle: rawTheme?.zaloCardSubtitle || 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
      zaloCardMembers: rawTheme?.zaloCardMembers || 'Hơn 15.000+ thành viên',
      zaloCardButtonText: rawTheme?.zaloCardButtonText || 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
      showFloatingZalo: rawTheme?.showFloatingZalo !== false,
      floatingZaloText: rawTheme?.floatingZaloText || 'Nhận mã 22% & mã Live sớm nhất!',
      metaTitle: rawTheme?.metaTitle || defaultMetaTitle,
      metaDescription: rawTheme?.metaDescription || defaultMetaDesc,
      metaKeywords: rawTheme?.metaKeywords || 'săn mã shopee, chuyển đổi link shopee, mã giảm giá shopee, voucher shopee 22%, mã shopee live, mã youtube shopee, săn sale shopee',
      ogImageUrl: rawTheme?.ogImage ? urlForOgImage(rawTheme.ogImage) : rawTheme?.backgroundImage ? urlForOgImage(rawTheme.backgroundImage) : undefined,
      canonicalUrl: rawTheme?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || undefined,
    };

    return setCached(cacheKey, result, ttl);
  } catch (err) {
    console.error('[SanityCache] Error fetching theme:', err);
  }

  const fallbackTheme: ThemeConfig = {
    logoType: 'text',
    logoText: 'SALE',
    logoHighlightText: 'HUNTER',
    logoBadge: 'PRO',
    subTitle: 'Sale Hunter Shopee',
    backgroundType: 'gradient',
    backgroundColor: '#0b0f19',
    gradientStart: '#0b0f19',
    gradientEnd: '#1c1008',
    showHeroBanner: true,
    bannerAutoSlide: true,
    bannerAutoSlideInterval: 5,
    bannerSlides: [],
    voucherNoticeText: 'Nếu click link không thấy mã Youtube/Facebook/Instagram → cần xóa shopee tải lại hoặc đổi tài khoản khác do tài khoản của bạn đã bị lọc.',
    showSocialProofTicker: true,
    socialProofMessages: [
      'Khách HN vừa nhận mã FB 22% (-65k)',
      'Khách HCM vừa áp mã YT 20% (-150k)',
      'Khách ĐN vừa nhận mã FB 25% (-120k)',
      '1.450+ lượt lấy mã thành công hôm nay',
      'Mã Shopee Live & Video vừa áp (-70k)',
    ],
    showQuickGuide: true,
    showSuggestedVouchers: true,
    suggestedVouchersTitle: 'Gợi Ý Voucher Hot Hôm Nay',
    suggestedVouchersLayout: 'slide',
    blockDesktopConvert: true,
    desktopButtonText: 'QUÉT MÃ MỞ TRÊN ĐIỆN THOẠI',
    desktopModalTitle: 'Mở trên điện thoại để nhận mã 25%',
    desktopModalSubtitle: 'Mã giảm giá Shopee độc quyền và tính năng tự động mở App hoạt động tối ưu nhất trên điện thoại di động.',
    zaloGroupUrl: 'https://zalo.me/g/kczvyi443',
    showZaloCard: true,
    zaloCardTitle: 'Nhóm Zalo Báo Mã Săn Sale',
    zaloCardSubtitle: 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
    zaloCardMembers: 'Hơn 15.000+ thành viên',
    zaloCardButtonText: 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
    showFloatingZalo: true,
    floatingZaloText: 'Nhận mã 22% & mã Live sớm nhất!',
    metaTitle: 'Sale Hunter - Săn Mã Shopee & Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%',
    metaDescription: 'Sale Hunter - Chuyển đổi link Shopee để tự động áp dụng voucher FB 22%, YouTube 20% độc quyền và nhận ưu đãi tốt nhất.',
    metaKeywords: 'săn mã shopee, chuyển đổi link shopee, mã giảm giá shopee, voucher shopee 22%, mã shopee live, mã youtube shopee, săn sale shopee',
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  };

  return setCached(cacheKey, fallbackTheme, 15);
}

/**
 * 4. Cached Telegram Config (TTL: 120s)
 */
export async function getTelegramConfigCached(ttl: number = 120): Promise<{
  enabled: boolean;
  token?: string;
  chatId?: string;
  cooldownSeconds: number;
}> {
  const cacheKey = 'sanity_telegram_config';
  const cached = getCached<{
    enabled: boolean;
    token?: string;
    chatId?: string;
    cooldownSeconds: number;
  }>(cacheKey);
  if (cached) return cached;

  const appConfig = await getAppConfigCached(ttl);

  let enabled = true;
  let token = process.env.TELEGRAM_BOT_TOKEN || '';
  let chatId = process.env.TELEGRAM_CHAT_ID || '';
  let cooldownSeconds = 30;

  if (typeof appConfig.enableTelegramNotify === 'boolean') {
    enabled = appConfig.enableTelegramNotify;
  }
  if (appConfig.telegramBotToken && appConfig.telegramBotToken.trim()) {
    token = appConfig.telegramBotToken.trim();
  }
  if (appConfig.telegramChatId && appConfig.telegramChatId.trim()) {
    chatId = appConfig.telegramChatId.trim();
  }
  if (typeof appConfig.telegramCooldownSeconds === 'number' && appConfig.telegramCooldownSeconds > 0) {
    cooldownSeconds = appConfig.telegramCooldownSeconds;
  }

  const result = { enabled, token, chatId, cooldownSeconds };
  return setCached(cacheKey, result, ttl);
}
