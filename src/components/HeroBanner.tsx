'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeConfig, BannerSlideItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, ExternalLink, Zap } from 'lucide-react';

interface HeroBannerProps {
  theme: ThemeConfig;
  onFocusInput?: () => void;
}

export default function HeroBanner({ theme, onFocusInput }: HeroBannerProps) {
  if (theme.showHeroBanner === false) {
    return null;
  }

  const slides: BannerSlideItem[] = (theme.bannerSlides || []).filter(
    (s) => s && s.isActive !== false && (s.desktopImageUrl || s.mobileImageUrl)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const autoSlide = theme.bannerAutoSlide !== false;
  const slideInterval = (theme.bannerAutoSlideInterval && theme.bannerAutoSlideInterval >= 2 ? theme.bannerAutoSlideInterval : 5) * 1000;

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (!autoSlide || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, slides.length, isPaused, slideInterval, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only register horizontal swipe if movement is primarily horizontal and > 35px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleSlideClick = (slide: BannerSlideItem) => {
    if (slide.linkUrl && slide.linkUrl.trim()) {
      const target = slide.openInNewTab !== false ? '_blank' : '_self';
      window.open(slide.linkUrl.trim(), target, 'noopener,noreferrer');
      return;
    }

    // Default action if no target link: Focus to convert input
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

  // Visually hidden H1 for 100% SEO score without cluttering visual UI
  const seoHeading = (
    <h1 className="sr-only">
      {theme.metaTitle || 'Săn Mã Giảm Giá Shopee - Chuyển Đổi Link Nhận Voucher FB 22% & YouTube 20%'}
    </h1>
  );

  // If no slides configured, render only SEO heading gracefully
  if (slides.length === 0) {
    return seoHeading;
  }

  // --- 1. SINGLE SLIDE BANNER (No slider navigation needed) ---
  if (slides.length === 1) {
    const slide = slides[0];
    const desktopImg = slide.desktopImageUrl || slide.mobileImageUrl;
    const mobileImg = slide.mobileImageUrl || slide.desktopImageUrl;

    return (
      <div className="w-full pt-1 pb-1 animate-fadeIn">
        {seoHeading}
        <div
          onClick={() => handleSlideClick(slide)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 shadow-lg transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-500/20 active:scale-[0.99]"
        >
          <picture className="block w-full">
            {desktopImg && <source media="(min-width: 640px)" srcSet={desktopImg} />}
            <img
              src={mobileImg || desktopImg}
              alt={slide.title || 'Banner Khuyến Mãi Shopee'}
              loading="eager"
              className="w-full h-auto object-cover aspect-[2.9/1] sm:aspect-[3.6/1] transition-transform duration-500 group-hover:scale-[1.015]"
            />
          </picture>

          {/* Target link subtle badge */}
          {slide.linkUrl && (
            <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white opacity-80 group-hover:opacity-100 group-hover:border-orange-400 transition-all pointer-events-none shadow-md">
              <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>Nhận ưu đãi</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-80" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 2. MULTI-SLIDE IMAGE CAROUSEL WITH TOUCH SWIPE & AFFILIATE TARGET LINKS ---
  return (
    <div className="w-full pt-1 pb-1 animate-fadeIn">
      {seoHeading}

      <div
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 shadow-lg transition-all duration-300 hover:border-orange-500/40 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div className="relative w-full aspect-[2.9/1] sm:aspect-[3.6/1] overflow-hidden">
          {slides.map((slide, index) => {
            const isCurrent = index === currentIndex;
            const desktopImg = slide.desktopImageUrl || slide.mobileImageUrl;
            const mobileImg = slide.mobileImageUrl || slide.desktopImageUrl;

            return (
              <div
                key={slide._key || index}
                onClick={() => handleSlideClick(slide)}
                className={`absolute inset-0 cursor-pointer transition-opacity duration-500 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <picture className="block w-full h-full">
                  {desktopImg && <source media="(min-width: 640px)" srcSet={desktopImg} />}
                  <img
                    src={mobileImg || desktopImg}
                    alt={slide.title || `Banner Khuyến Mãi ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                  />
                </picture>

                {/* Target link subtle badge */}
                {slide.linkUrl && (
                  <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white opacity-85 group-hover:opacity-100 group-hover:border-orange-400 transition-all pointer-events-none shadow-md">
                    <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>Nhận ưu đãi</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Prev / Next Navigation Arrows (subtle hover buttons) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Slide trước"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-90 hover:opacity-100 hover:bg-orange-500 hover:border-orange-400 transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Slide tiếp theo"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-90 hover:opacity-100 hover:bg-orange-500 hover:border-orange-400 transition-all active:scale-95 shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Carousel Dots Pagination Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-xs px-2 py-1 border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              aria-label={`Chuyển đến slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-4 sm:w-5 bg-gradient-to-r from-orange-500 to-amber-400 shadow-sm'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
