'use client';

import React, { useState } from 'react';
import { VoucherItem, UniversalLinks, ShopeeProduct } from '@/lib/types';
import { Copy, Check, ArrowRight, Flame } from 'lucide-react';

interface VoucherButtonsProps {
  vouchers: VoucherItem[];
  links: UniversalLinks;
  productName?: string;
  product?: ShopeeProduct;
}

export default function VoucherButtons({
  vouchers,
  links,
  productName,
  product,
}: VoucherButtonsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getChannelUrl = (channel: string) => {
    switch (channel) {
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
        fetch('/api/notify-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
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
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Ignore background fetch error
      }
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>VOUCHER ĐỘC QUYỀN</span>
        </h4>
        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Tự động áp mã
        </span>
      </div>

      {/* Ticket Cards List */}
      <div className="grid gap-2.5">
        {vouchers.map((voucher, idx) => {
          const isExpired = voucher.status === 'expired';
          const isTopDiscount = Boolean(voucher.isHighlighted);

          return (
            <div
              key={voucher._id || idx}
              onClick={() => !isExpired && handleOpenApp(voucher)}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 select-none transform-gpu ${
                isExpired
                  ? 'border-white/5 bg-[#111827]/60 opacity-60 cursor-not-allowed'
                  : isTopDiscount
                  ? 'border-orange-500/50 bg-gradient-to-r from-[#17120e] via-[#1c1410] to-[#121826] shadow-xl shadow-orange-950/40 cursor-pointer hover:border-orange-400 active:scale-[0.99]'
                  : 'border-white/10 bg-[#111827] cursor-pointer hover:border-white/20 active:scale-[0.99]'
              }`}
            >
              {/* Top Accent Line for Highlighted vouchers */}
              {isTopDiscount && !isExpired && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
              )}

              {/* Top & Bottom Ticket Cutout Notches */}
              <div className="absolute left-[64px] sm:left-[76px] -top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#0b0f19] border border-white/10 z-10 pointer-events-none" />
              <div className="absolute left-[64px] sm:left-[76px] -bottom-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#0b0f19] border border-white/10 z-10 pointer-events-none" />

              <div className="flex items-stretch min-h-[80px]">
                {/* Left Ticket Stub */}
                <div
                  className={`flex w-16 sm:w-[76px] shrink-0 flex-col items-center justify-center border-r border-dashed px-1 text-center transition-colors ${
                    isExpired
                      ? 'border-white/10 bg-white/[0.02] text-slate-500'
                      : isTopDiscount
                      ? 'border-orange-500/30 bg-gradient-to-b from-orange-500/20 to-amber-500/10 text-orange-400'
                      : 'border-white/10 bg-white/[0.03] text-orange-300'
                  }`}
                >
                  <span className="text-xl sm:text-2xl font-black tracking-tighter leading-none">
                    -{voucher.discountPercent}%
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">
                    GIẢM
                  </span>
                </div>

                {/* Middle: Voucher Info */}
                <div className="flex-1 min-w-0 py-2.5 px-3 sm:px-3.5 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white leading-tight truncate max-w-full">
                      {voucher.buttonLabel}
                    </span>

                    {isTopDiscount && !isExpired && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black text-white uppercase shadow-sm shrink-0">
                        <Flame className="h-2.5 w-2.5 fill-white" />
                        HOT NHẤT
                      </span>
                    )}

                    {isExpired && (
                      <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[8px] font-semibold text-slate-300 shrink-0">
                        Hết lượt
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300/90 mt-1 leading-snug line-clamp-2">
                    {voucher.description ||
                      `Giảm ${voucher.discountPercent}% cho đơn từ ${
                        voucher.minSpend ? voucher.minSpend / 1000 + 'k' : '0đ'
                      }`}
                  </p>

                  {/* Progress Bar */}
                  {voucher.usageProgress && voucher.usageProgress > 0 && !isExpired && (
                    <div className="mt-1.5 flex items-center gap-2 max-w-[180px]">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{ width: `${voucher.usageProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">
                        Đã dùng {voucher.usageProgress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Quick Copy & Action Buttons */}
                <div className="flex shrink-0 flex-col justify-between items-end p-2.5 sm:p-3 pl-1">
                  {/* Quick Copy Code Button */}
                  <button
                    type="button"
                    onClick={(e) => handleCopy(voucher.voucherCode, e)}
                    className="flex items-center gap-1 rounded-lg bg-black/40 border border-white/10 px-2 py-1 text-[10px] text-slate-300 hover:text-white hover:border-orange-500/40 hover:bg-orange-500/10 transition-all active:scale-95"
                    title={`Sao chép mã ${voucher.voucherCode}`}
                  >
                    {copiedCode === voucher.voucherCode ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold text-[9px]">ĐÃ CHÉP</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-orange-400" />
                        <span className="font-mono text-[9px] font-semibold">MÃ</span>
                      </>
                    )}
                  </button>

                  {/* Open App CTA Button */}
                  <button
                    type="button"
                    disabled={isExpired}
                    className={`flex h-7 sm:h-8 items-center gap-1 rounded-xl px-2.5 sm:px-3 text-[10px] sm:text-xs font-bold transition-all shadow-md ${
                      isExpired
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : isTopDiscount
                        ? 'bg-gradient-to-r from-[#ee4d2d] to-orange-500 text-white hover:brightness-110 active:scale-95 shadow-orange-500/25'
                        : 'bg-[#ee4d2d] text-white hover:brightness-110 active:scale-95 shadow-orange-500/20'
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
    </div>
  );
}
