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
  channel: 'fb_22' | 'fb_20' | 'ytb' | 'ig' | 'zalo' | 'all';
  discountPercent: number;
  maxDiscount?: number;
  minSpend?: number;
  description: string;
  status: 'active' | 'expired' | 'incoming';
  isHighlighted?: boolean;
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
}

export interface AppConfig {
  affiliateId: string;
  defaultSubId?: string;
  savingsNotice?: string;
  zaloGroupUrl?: string;
  autoBlinkTopDiscount?: boolean;
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
  conversionLogId?: string;
}

export interface ClickTrackPayload {
  conversionLogId?: string;
  channel: 'fb_22' | 'fb_20' | 'ytb' | 'ig' | 'zalo';
  targetUrl: string;
  productName?: string;
}
