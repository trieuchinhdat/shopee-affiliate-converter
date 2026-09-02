'use client';

import React from 'react';
import { ThemeConfig } from '@/lib/types';
import { Sparkles, Zap, Flame, ArrowRight, CheckCircle2, Gift } from 'lucide-react';

interface HeroBannerProps {
  theme: ThemeConfig;
  onFocusInput?: () => void;
}

export default function HeroBanner({ theme, onFocusInput }: HeroBannerProps) {
  if (theme.showHeroBanner === false) {
    return null;
  }

  const bannerType = theme.heroBannerType || 'compact_text';

  const handleClickBanner = () => {
    if (theme.bannerClickAction === 'open_link' && theme.heroBannerLink) {
      window.open(theme.heroBannerLink, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default or 'focus_input' action: focus into input
    if (onFocusInput) {
      onFocusInput();
    } else {
      const inputEl = document.getElementById('convert-input-field') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // --- 1. MODE: IMAGE BANNER (Responsive Desktop & Mobile with Aspect Ratio) ---
  if (bannerType === 'image_banner') {
    const desktopImg = theme.heroBannerDesktopImageUrl;
    const mobileImg = theme.heroBannerMobileImageUrl;
    const effectiveImg = mobileImg || desktopImg;

    if (!effectiveImg) {
      // Fallback if no images uploaded yet
      return (
        <div className="text-center space-y-1.5 py-1 animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{theme.bannerBadgeText || 'Tự động kích hoạt mã giảm giá sâu nhất'}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            {theme.heroTitle || 'Chuyển Đổi Link Shopee'}
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {theme.heroSubtitle || 'Dán link sản phẩm Shopee để nhận ngay mã FB 22%, YouTube 20% độc quyền.'}
          </p>
        </div>
      );
    }

    return (
      <div className="w-full pt-1 pb-1.5 animate-fadeIn">
        <div
          onClick={handleClickBanner}
          className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-black/40 shadow-xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-500/20 active:scale-[0.99]"
        >
          {/* Picture element for zero-layout-shift responsive banner */}
          <picture className="block w-full">
            {desktopImg && (
              <source media="(min-width: 640px)" srcSet={desktopImg} />
            )}
            <img
              src={effectiveImg}
              alt={theme.heroBannerAltText || 'Banner Siêu Sale Shopee'}
              loading="eager"
              className="w-full h-auto object-cover aspect-[3.2/1] sm:aspect-[3.8/1] transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </picture>

          {/* Interactive hover overlay hint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
            <span className="text-[11px] font-bold text-white flex items-center gap-1 bg-orange-600/90 px-2.5 py-1 rounded-full shadow-md">
              <Zap className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span>Dán link nhận mã ngay</span>
            </span>
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // --- 2. MODE: FOMO TICKER (Slim Urgency Alert / Breaking News) ---
  if (bannerType === 'fomo_ticker') {
    return (
      <div className="w-full pt-1 pb-1 animate-fadeIn">
        <div
          onClick={handleClickBanner}
          className="group cursor-pointer flex items-center gap-2.5 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/70 via-orange-950/60 to-red-950/70 p-2.5 sm:p-3 shadow-lg shadow-red-950/40 transition-all hover:border-orange-400 active:scale-[0.99]"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 shadow-sm animate-pulse">
            <Flame className="h-4 w-4 fill-red-400 text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-extrabold text-white line-clamp-1 leading-tight tracking-tight">
              {theme.heroTickerText || '🔥 Đang phát mã giảm giá FB 22% & YouTube 20% độc quyền - Tự động áp khi dán link!'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1 rounded-xl bg-orange-500/20 border border-orange-500/30 px-2.5 py-1 text-[11px] font-black text-orange-300 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <span>DÁN NGAY</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    );
  }

  // --- 3. MODE: INTERACTIVE CARD (Mega Sale Event Card) ---
  if (bannerType === 'interactive_card') {
    return (
      <div className="w-full pt-1 pb-1.5 animate-fadeIn">
        <div
          onClick={handleClickBanner}
          className="group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#ee4d2d]/15 via-[#111827] to-amber-950/30 p-3.5 sm:p-4 shadow-xl shadow-orange-950/30 transition-all hover:border-amber-400 active:scale-[0.99]"
        >
          {/* Subtle glowing corner light */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-orange-500/20 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
              <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
              <span>{theme.heroCardTag || 'ĐỢT PHÁT MÃ 0H'}</span>
            </div>

            <span className="text-[10.5px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Đang hoạt động
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            {theme.heroTitle || 'Siêu Hội Săn Mã Giảm 22%'}
          </h2>

          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
            {theme.heroSubtitle || 'Tự động kích hoạt mã FB 22%, YouTube 20% khi mở App Shopee.'}
          </p>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              <span>Ưu đãi áp dụng trên App Shopee</span>
            </div>

            <span className="text-[11px] font-black text-orange-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Dán link ngay</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. MODE: COMPACT TEXT (Standard Default - Sleek & Conversion Focused) ---
  const highlights = theme.heroHighlights && theme.heroHighlights.length > 0
    ? theme.heroHighlights
    : ['Mã FB 22%', 'Mã YouTube 20%', 'Shopee Live & Video', 'Tự động áp mã'];

  return (
    <div className="text-center space-y-2 py-1 animate-fadeIn">
      {/* Top Sparkle Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 shadow-sm">
        <Sparkles className="h-3.5 w-3.5 text-orange-400" />
        <span>{theme.bannerBadgeText || 'Tự động kích hoạt mã giảm giá sâu nhất'}</span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl leading-tight">
        {theme.heroTitle || 'Chuyển Đổi Link Shopee'}
      </h1>

      {/* Subtitle Description */}
      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
        {theme.heroSubtitle || 'Dán link sản phẩm Shopee để nhận ngay mã FB 22%, YouTube 20% độc quyền.'}
      </p>

      {/* Highlights Pill Tags */}
      {highlights.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5">
          {highlights.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10.5px] font-semibold text-slate-300 shadow-xs hover:border-orange-500/30 hover:text-orange-300 transition-colors"
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
