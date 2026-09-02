export interface ShopeeProduct {
  shopId: string;
  itemId: string;
  productName: string;
  imageUrl: string;
  price?: number;
  formattedPrice?: string;
  originalUrl: string;
  canonicalUrl: string;
}

export interface UniversalLinks {
  facebook: {
    fb25?: string;
    fb22: string;
    fb20: string;
  };
  youtube: string;
  instagram: string;
  zalo: string;
}

export interface VoucherItem {
  _id: string;
  voucherCode: string;
  buttonLabel: string;
  channel: 'fb_25' | 'fb_22' | 'fb_20' | 'ytb' | 'ig' | 'zalo' | 'all';
  discountPercent: number;
  maxDiscount?: number;
  minSpend?: number;
  customTitle?: string;
  customMinSpendText?: string;
  description?: string;
  brandPreset?: 'facebook' | 'youtube' | 'shopee' | 'shopee_trendy' | 'shopee_live' | 'shopee_video' | 'zalo' | 'custom' | string;
  brandLabel?: string;
  customBrandLogoUrl?: string;
  badgeType?: 'none' | 'flash_sale' | 'exclusive_outline' | 'custom_tag' | string;
  badgeText?: string;
  urgencyType?: 'running_out' | 'percent_used' | 'none' | 'custom' | string;
  customUrgencyText?: string;
  expiryText?: string;
  status: 'active' | 'expired' | 'incoming';
  isActive?: boolean;
  orderPriority: number;
  usageProgress?: number;
  startTime?: string;
  endTime?: string;
}

export interface ThemeConfig {
  logoType?: 'text' | 'image';
  logoText?: string;
  logoHighlightText?: string;
  logoBadge?: string;
  logoImageUrl?: string;
  subTitle?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundImageUrl?: string;
  backgroundOverlayOpacity?: number;
  bannerBadgeText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  // Hero Banner Advanced Settings
  showHeroBanner?: boolean;
  heroBannerType?: 'compact_text' | 'fomo_ticker' | 'image_banner' | 'interactive_card';
  heroHighlights?: string[];
  heroTickerText?: string;
  heroCardTag?: string;
  heroBannerDesktopImageUrl?: string;
  heroBannerMobileImageUrl?: string;
  heroBannerAltText?: string;
  bannerClickAction?: 'focus_input' | 'open_link';
  heroBannerLink?: string;
  voucherNoticeText?: string;
  zaloGroupUrl?: string;
  // Zalo Community Card Settings
  showZaloCard?: boolean;
  zaloCardTitle?: string;
  zaloCardSubtitle?: string;
  zaloCardMembers?: string;
  zaloCardButtonText?: string;
  // Floating Chatbox Settings
  showFloatingZalo?: boolean;
  floatingZaloText?: string;
  // SEO & Social Sharing Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
}

export interface FacebookSampleItem {
  url: string;
  label?: string;
  isActive?: boolean;
}

export interface FacebookTemplatePayload {
  tokenType?: 'credential' | 'encrypted';
  credentialToken?: string;
  encryptedPayload?: string;
  fbContentId?: string;
  gadsTSig?: string;
  utmCampaign?: string;
  expGroup?: string;
  contentType?: string;
  contentSource?: string;
}

export interface AppConfig {
  affiliateId: string;
  defaultSubId?: string;
  savingsNotice?: string;
  zaloGroupUrl?: string;
  autoBlinkTopDiscount?: boolean;
  facebookSampleUrls?: FacebookSampleItem[];
  // Telegram Notification Settings
  enableTelegramNotify?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramCooldownSeconds?: number;
}

export interface ConvertResult {
  success: boolean;
  error?: string;
  product?: ShopeeProduct;
  links?: UniversalLinks;
  vouchers?: VoucherItem[];
  savingsEstimate?: {
    percent: number;
    amount: number;
    formattedAmount: string;
  };
}

export interface NotifyClickPayload {
  product?: {
    productName: string;
    shopId?: string;
    itemId?: string;
    imageUrl?: string;
  };
  voucher?: {
    voucherCode?: string;
    buttonLabel?: string;
    channel?: string;
    discountPercent?: number;
  };
  targetUrl?: string;
}
