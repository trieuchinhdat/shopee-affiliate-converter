'use client';

import React, { useState } from 'react';
import { VoucherItem, UniversalLinks, ShopeeProduct } from '@/lib/types';
import { Copy, Check, ArrowRight, Zap, Video } from 'lucide-react';

interface VoucherButtonsProps {
  vouchers: VoucherItem[];
  links: UniversalLinks;
  productName?: string;
  product?: ShopeeProduct;
  noticeText?: string;
  isFallback?: boolean;
  fallbackNotice?: string;
}

export default function VoucherButtons({
  vouchers,
  links,
  productName,
  product,
  noticeText,
  isFallback,
  fallbackNotice,
}: VoucherButtonsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getChannelUrl = (channel: string) => {
    switch (channel) {
      case 'fb_25':
        return links.facebook.fb25 || links.facebook.fb22;
      case 'fb_22':
        return links.facebook.fb22;
      case 'fb_20':
        return links.facebook.fb20;
      case 'ytb':
        return links.youtube;
      case 'ig':
        return links.instagram;
      case 'zalo':
        return links.zalo;
      default:
        return links.facebook.fb22;
    }
  };

  const handleOpenApp = (voucher: VoucherItem) => {
    const url = getChannelUrl(voucher.channel);

    // Auto-copy voucher code to clipboard before navigating
    if (voucher.voucherCode) {
      try {
        navigator.clipboard.writeText(voucher.voucherCode);
        setCopiedCode(voucher.voucherCode);
        setTimeout(() => setCopiedCode(null), 3000);
      } catch {
        // Ignore clipboard failure
      }
    }

    // Client-side debounce (30s) to prevent spamming notifications on double clicks
    const itemId = product?.itemId || productName || 'shopee_product';
    const cooldownKey = `last_notify_${itemId}`;
    const lastTime = typeof window !== 'undefined' ? sessionStorage.getItem(cooldownKey) : null;
    const now = Date.now();

    if (!lastTime || now - parseInt(lastTime, 10) > 30000) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(cooldownKey, now.toString());
      }

      try {
        const notifyPayload = JSON.stringify({
          product: product || {
            productName: productName || 'Sản phẩm Shopee',
          },
          voucher: {
            voucherCode: voucher.voucherCode,
            buttonLabel: voucher.buttonLabel,
            channel: voucher.channel,
            discountPercent: voucher.discountPercent,
          },
          targetUrl: url,
        });

        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const blob = new Blob([notifyPayload], { type: 'application/json' });
          navigator.sendBeacon('/api/notify-click', blob);
        } else {
          fetch('/api/notify-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: notifyPayload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Ignore background fetch error
      }
    }

    // Open target link (use window.location.href on mobile for instant Universal Link / App evoke, window.open on desktop)
    if (typeof window !== 'undefined') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener');
      }
    }
  };

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // 1. Helper render Title
  const getVoucherTitle = (voucher: VoucherItem) => {
    if (voucher.customTitle && voucher.customTitle.trim()) {
      return voucher.customTitle.trim();
    }

    if (voucher.discountPercent && voucher.discountPercent > 0) {
      let maxText = '';
      if (voucher.maxDiscount && voucher.maxDiscount > 0) {
        if (voucher.maxDiscount >= 1000000) {
          maxText = `${voucher.maxDiscount / 1000000}trđ`;
        } else if (voucher.maxDiscount >= 1000) {
          maxText = `${voucher.maxDiscount / 1000}kđ`;
        } else {
          maxText = `${voucher.maxDiscount}đ`;
        }
      }
      return `giảm ${voucher.discountPercent}%${maxText ? ` Giảm tối đa ${maxText}` : ''}`;
    }

    return voucher.buttonLabel || 'Voucher Shopee';
  };

  // 2. Helper render Min Spend (Trả về null nếu admin không nhập)
  const getMinSpendText = (voucher: VoucherItem) => {
    if (voucher.customMinSpendText && voucher.customMinSpendText.trim()) {
      return voucher.customMinSpendText.trim();
    }

    if (voucher.minSpend !== undefined && voucher.minSpend !== null) {
      if (voucher.minSpend === 0) {
        return 'Đơn tối thiểu 0đ';
      }
      if (voucher.minSpend >= 1000000) {
        return `Đơn tối thiểu ${voucher.minSpend / 1000000}trđ`;
      }
      if (voucher.minSpend >= 1000) {
        return `Đơn tối thiểu ${voucher.minSpend / 1000}kđ`;
      }
      return `Đơn tối thiểu ${voucher.minSpend}đ`;
    }

    return null;
  };

  // 3. Helper render Brand Label on Left Stub
  const getBrandLabel = (voucher: VoucherItem) => {
    if (voucher.brandLabel && voucher.brandLabel.trim()) {
      return voucher.brandLabel.trim();
    }

    switch (voucher.brandPreset) {
      case 'facebook':
        return 'FACEBOOK';
      case 'youtube':
        return 'YouTube';
      case 'shopee':
        return 'SHOPEE';
      case 'shopee_trendy':
        return 'Toàn Ngành Hàng';
      case 'shopee_live':
        return 'Shopee Live';
      case 'shopee_video':
        return 'Shopee Video';
      case 'zalo':
        return 'Zalo Săn Sale';
      case 'custom':
        return '';
      default:
        if (voucher.channel === 'fb_25' || voucher.channel === 'fb_22' || voucher.channel === 'fb_20') return 'FACEBOOK';
        if (voucher.channel === 'ytb') return 'YouTube';
        return 'SHOPEE';
    }
  };

  // 4. Helper render Brand Logo on Left Stub
  const renderBrandLogo = (voucher: VoucherItem) => {
    if (voucher.brandPreset === 'custom') {
      if (voucher.customBrandLogoUrl) {
        return (
          <img
            src={voucher.customBrandLogoUrl}
            alt={getBrandLabel(voucher) || 'Logo'}
            className="h-8 w-8 object-contain rounded-full bg-white p-0.5 shadow-sm"
          />
        );
      }
      return null;
    }

    const preset = voucher.brandPreset || (voucher.channel === 'fb_25' || voucher.channel === 'fb_22' || voucher.channel === 'fb_20' ? 'facebook' : voucher.channel === 'ytb' ? 'youtube' : 'shopee');

    switch (preset) {
      case 'facebook':
        return (
          <div className="h-8 w-8 rounded-full bg-[#1877F2] border-2 border-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );

      case 'youtube':
        return (
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );

      case 'shopee_trendy':
        return (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] font-black text-amber-200 tracking-tighter drop-shadow-sm uppercase">SHOPEE</span>
            <span className="text-[11px] font-black tracking-tight text-white bg-blue-600 px-1 py-0.5 rounded-[3px] shadow-sm mt-0.5">TRENDY</span>
          </div>
        );

      case 'shopee_live':
      case 'shopee_video':
        return (
          <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <Video className="w-4 h-4 text-white fill-white/30" />
          </div>
        );

      case 'zalo':
        return (
          <div className="h-8 w-8 rounded-full bg-[#0068FF] border-2 border-white flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-[10px] tracking-tighter">Zalo</span>
          </div>
        );

      case 'shopee':
      default:
        return (
          <div className="h-8 w-8 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        );
    }
  };

  // 5. Helper render Urgency Notice (Trả về null nếu không có cảnh báo)
  const getUrgencyElement = (voucher: VoucherItem) => {
    if (voucher.urgencyType === 'running_out') {
      return <span className="text-red-600 font-bold">Đang hết nhanh</span>;
    }

    if (voucher.urgencyType === 'percent_used' && voucher.usageProgress && voucher.usageProgress > 0) {
      return <span className="text-slate-600 font-medium">Đã dùng {voucher.usageProgress}%</span>;
    }

    if (voucher.urgencyType === 'custom' && voucher.customUrgencyText && voucher.customUrgencyText.trim()) {
      return <span className="text-red-600 font-bold">{voucher.customUrgencyText.trim()}</span>;
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>VOUCHER ĐỘC QUYỀN SHOPEE</span>
        </h4>
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Tự động áp mã vào App
        </span>
      </div>

      {/* Fallback Voucher Hub Notice */}
      {isFallback && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-medium animate-fadeIn">
          <Zap className="h-4 w-4 text-orange-400 shrink-0 fill-orange-400" />
          <span>{fallbackNotice || '⚡ Đang áp dụng Kho Voucher Toàn Sàn Shopee - Bấm mở App để lưu mã!'}</span>
        </div>
      )}

      {/* Ticket Cards List */}
      <div className="grid gap-3">
        {vouchers.map((voucher, idx) => {
          const isExpired = voucher.status === 'expired';

          // Data checks for conditional rendering
          const title = getVoucherTitle(voucher);
          const minSpendText = getMinSpendText(voucher);
          const brandLabel = getBrandLabel(voucher);
          const brandLogo = renderBrandLogo(voucher);
          
          const isFlashSale =
            voucher.badgeType === 'flash_sale' &&
            Boolean(voucher.badgeText && voucher.badgeText.trim());

          const isOutlineBadge =
            (voucher.badgeType === 'exclusive_outline' || voucher.badgeType === 'custom_tag') &&
            Boolean(voucher.badgeText && voucher.badgeText.trim());

          const hasProgress = Boolean(
            voucher.usageProgress && voucher.usageProgress > 0 && !isExpired
          );

          const urgencyEl = getUrgencyElement(voucher);
          const hasExpiry = Boolean(voucher.expiryText && voucher.expiryText.trim());
          const hasFooterInfo = Boolean(urgencyEl || hasExpiry);

          return (
            <div
              key={voucher._id || idx}
              onClick={() => !isExpired && handleOpenApp(voucher)}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-200 select-none transform-gpu shadow-md ${
                isExpired
                  ? 'bg-slate-200/90 opacity-60 cursor-not-allowed'
                  : 'bg-white cursor-pointer hover:shadow-lg hover:shadow-slate-500/15 ring-1 ring-black/5 active:scale-[0.99]'
              }`}
            >
              {/* Sawtooth Perforation effect on extreme left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-2 overflow-hidden flex flex-col justify-around pointer-events-none z-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 -ml-1.5 rounded-full bg-[#0b0f19]" />
                ))}
              </div>

              {/* Top & Bottom Ticket Cutout Notches */}
              <div className="absolute left-[84px] sm:left-[96px] -top-2.5 h-5 w-5 -translate-x-1/2 rounded-full bg-[#0b0f19] z-20 pointer-events-none" />
              <div className="absolute left-[84px] sm:left-[96px] -bottom-2.5 h-5 w-5 -translate-x-1/2 rounded-full bg-[#0b0f19] z-20 pointer-events-none" />

              <div className="flex items-stretch min-h-[92px]">
                {/* 1. Left Stub (Cùi vé cam Shopee) */}
                <div
                  className={`relative flex w-[84px] sm:w-[96px] shrink-0 flex-col items-center justify-center p-2 text-center transition-colors border-r border-dashed border-white/30 ${
                    isExpired
                      ? 'bg-slate-500 text-slate-200'
                      : 'bg-gradient-to-b from-[#ee4d2d] to-[#ff5722] text-white'
                  }`}
                >
                  {brandLogo && (
                    <div className="transform scale-95 transition-transform group-hover:scale-105">
                      {brandLogo}
                    </div>
                  )}
                  {brandLabel && (
                    <span className="text-[9.5px] sm:text-[10.5px] font-bold text-white tracking-tight mt-1 px-1 line-clamp-1 drop-shadow-sm">
                      {brandLabel}
                    </span>
                  )}
                </div>

                {/* 2. Main Ticket Body (Thân vé nền trắng tương phản cao) */}
                <div className="flex-1 min-w-0 py-2.5 px-3 sm:px-4 flex flex-col justify-center bg-white">
                  {/* Line 1: Badge + Headline */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isFlashSale && (
                      <span className="inline-flex items-center gap-0.5 rounded-sm bg-gradient-to-r from-red-600 to-amber-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-sm shrink-0">
                        <Zap className="h-2.5 w-2.5 fill-yellow-300 text-yellow-300" />
                        {voucher.badgeText}
                      </span>
                    )}

                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug tracking-tight">
                      {title}
                    </h3>
                  </div>

                  {/* Line 2: Min Spend (Chỉ hiển thị nếu có) */}
                  {minSpendText && (
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
                      {minSpendText}
                    </p>
                  )}

                  {/* Line 3: Exclusive Outline Badge (Chỉ hiển thị nếu có) */}
                  {isOutlineBadge && (
                    <div className="mt-1">
                      <span className="inline-block border border-red-500/80 text-red-600 px-1.5 py-0.5 rounded-[3px] text-[9.5px] sm:text-[10.5px] font-semibold leading-none bg-red-50/50">
                        {voucher.badgeText}
                      </span>
                    </div>
                  )}

                  {/* Line 4: Progress Bar (Chỉ hiển thị nếu % > 0) */}
                  {hasProgress && (
                    <div className="mt-1.5 h-1.5 w-full max-w-[200px] rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${voucher.usageProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Line 5: Footer Status & Expiry (Chỉ hiển thị nếu có cảnh báo hoặc thời hạn) */}
                  {hasFooterInfo && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 leading-tight flex-wrap">
                      {urgencyEl}
                      {urgencyEl && hasExpiry && <span className="text-slate-300">•</span>}
                      {hasExpiry && <span>hết hạn trong: {voucher.expiryText?.trim()}</span>}
                    </div>
                  )}
                </div>

                {/* 3. Right Action Area (Nút Dùng Mã + Sao chép mã) */}
                <div className="flex shrink-0 flex-col items-end justify-between py-2.5 pr-2.5 sm:pr-3.5 pl-1 bg-white">
                  {/* Quick Copy Code Button (Chỉ hiển thị nếu có voucherCode) */}
                  {voucher.voucherCode ? (
                    <button
                      type="button"
                      onClick={(e) => handleCopy(voucher.voucherCode, e)}
                      className="flex items-center gap-1 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#ee4d2d] border border-slate-200 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-700 transition-all active:scale-95"
                      title={`Sao chép mã ${voucher.voucherCode}`}
                    >
                      {copiedCode === voucher.voucherCode ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold text-[9px]">ĐÃ CHÉP</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-400" />
                          <span className="font-mono text-[9px] font-bold">{voucher.voucherCode}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div />
                  )}

                  {/* Main Deep Link CTA Button */}
                  <button
                    type="button"
                    disabled={isExpired}
                    className={`flex h-7 sm:h-8 items-center gap-1 rounded-lg px-2.5 sm:px-3 text-[10px] sm:text-xs font-bold transition-all shadow-sm ${
                      isExpired
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#ee4d2d] to-[#ff5722] text-white hover:brightness-110 active:scale-95 shadow-orange-500/20'
                    }`}
                  >
                    <span>DÙNG MÃ</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Troubleshooting Notice Card (Fixed below Vouchers) */}
      <div className="rounded-2xl border border-amber-500/40 bg-[#111827]/90 p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition-all hover:border-amber-400/70">
        <p className="text-xs sm:text-[13px] leading-relaxed text-slate-100">
          <strong className="font-black text-amber-400">Lưu ý: </strong>
          <span className="font-semibold text-slate-100">
            {noticeText ||
              'Nếu click link không thấy mã Youtube/Facebook/Instagram → cần xóa shopee tải lại hoặc đổi tài khoản khác do tài khoản của bạn đã bị lọc.'}
          </span>
        </p>
      </div>
    </div>
  );
}


