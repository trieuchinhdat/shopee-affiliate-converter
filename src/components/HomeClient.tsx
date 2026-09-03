'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ConvertInput from '@/components/ConvertInput';
import ProductCard from '@/components/ProductCard';
import VoucherButtons from '@/components/VoucherButtons';
import SocialProofTicker from '@/components/SocialProofTicker';
import QuickGuideSteps from '@/components/QuickGuideSteps';
import ZaloCommunityCard from '@/components/ZaloCommunityCard';
import FloatingZaloWidget from '@/components/FloatingZaloWidget';
import Footer from '@/components/Footer';
import SuggestedVouchers from '@/components/SuggestedVouchers';
import { ConvertResult, ThemeConfig, SuggestedVoucherItem } from '@/lib/types';

interface HomeClientProps {
  initialTheme: ThemeConfig;
  initialSuggestedVouchers?: SuggestedVoucherItem[];
}

export default function HomeClient({ initialTheme, initialSuggestedVouchers = [] }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [suggestedVouchers, setSuggestedVouchers] = useState<SuggestedVoucherItem[]>(initialSuggestedVouchers);

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  useEffect(() => {
    if (initialSuggestedVouchers) {
      setSuggestedVouchers(initialSuggestedVouchers);
    }
  }, [initialSuggestedVouchers]);

  const handleConvert = async (url: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsRedirecting(false);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data: ConvertResult = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không thể chuyển đổi link Shopee này.');
        return;
      }

      // ⚡ Direct Auto-Redirect: Tự động mở thẳng App Shopee sang Kho Voucher để ghi nhận hoa hồng gián tiếp
      if (data.directRedirectUrl) {
        setIsRedirecting(true);
        window.location.href = data.directRedirectUrl;
        return;
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  const isImageBg = theme?.backgroundType === 'image' && Boolean(theme?.backgroundImageUrl);

  const getContainerStyle = () => {
    if (!theme) return {};

    if (theme.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(to bottom, ${theme.gradientStart || '#0b0f19'}, ${theme.gradientEnd || '#1c1008'})`,
      };
    }

    if (theme.backgroundType === 'solid' && theme.backgroundColor) {
      return {
        backgroundColor: theme.backgroundColor,
      };
    }

    return {};
  };

  return (
    <div
      style={getContainerStyle()}
      className="min-h-screen flex flex-col items-center justify-between transition-colors duration-300 relative"
    >
      {/* Hardware-accelerated fixed background to prevent mobile scroll jank */}
      {isImageBg && (
        <div
          className="fixed inset-0 pointer-events-none z-[-1] transform-gpu bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 15, 25, ${(theme.backgroundOverlayOpacity ?? 85) / 100}), rgba(11, 15, 25, ${(theme.backgroundOverlayOpacity ?? 85) / 100})), url('${theme.backgroundImageUrl}')`,
          }}
        />
      )}

      <Header theme={theme} />

      <main className="w-full max-w-xl px-3.5 pt-2 sm:pt-4 pb-12 sm:pb-8 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5 sm:space-y-3.5">
          {/* Dynamic Hero Banner Section (Configurable from Sanity CMS) */}
          <HeroBanner theme={theme} />

          {/* Input Form */}
          <ConvertInput
            onConvert={handleConvert}
            isLoading={isLoading}
            blockDesktopConvert={theme?.blockDesktopConvert}
            desktopButtonText={theme?.desktopButtonText}
            desktopModalTitle={theme?.desktopModalTitle}
            desktopModalSubtitle={theme?.desktopModalSubtitle}
          />

          {/* Social Proof Real-time Ticker (Controlled by Sanity Theme) */}
          {theme?.showSocialProofTicker !== false && (
            <SocialProofTicker messages={theme?.socialProofMessages} />
          )}

          {/* Redirecting Notice Banner */}
          {isRedirecting && (
            <div className="rounded-2xl border border-orange-500/40 bg-orange-950/40 p-3 text-center text-xs font-semibold text-orange-300 flex items-center justify-center gap-2 animate-fadeIn">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
              <span>Đang mở App Shopee để lưu mã giảm giá toàn sàn...</span>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-2.5 text-center text-xs font-medium text-rose-300">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* When NO result yet: Render Quick Guide (Controlled by Sanity Theme) */}
          {!result && (
            <div className="space-y-2.5 pt-0.5 animate-fadeIn">
              {theme?.showQuickGuide !== false && <QuickGuideSteps />}
            </div>
          )}

          {/* Result: Product Card & Voucher Buttons */}
          {result?.product && result.links && result.vouchers && (
            <div className="space-y-3.5 pt-1 animate-fadeIn">
              <ProductCard
                product={result.product}
              />

              <VoucherButtons
                vouchers={result.vouchers}
                links={result.links}
                product={result.product}
                productName={result.product.productName}
                noticeText={theme?.voucherNoticeText}
                isFallback={result.isFallback}
                fallbackNotice={result.fallbackNotice}
              />
            </div>
          )}

          {/* Suggested Vouchers Hot Block (Controlled by Sanity with slide/grid layout) */}
          <SuggestedVouchers
            vouchers={suggestedVouchers}
            layout={theme?.suggestedVouchersLayout || 'slide'}
            title={theme?.suggestedVouchersTitle}
            show={theme?.showSuggestedVouchers !== false}
          />

          {/* Zalo Support Community Card with Sanity Dynamic Controls */}
          <ZaloCommunityCard
            zaloUrl={theme.zaloGroupUrl}
            showCard={theme.showZaloCard}
            title={theme.zaloCardTitle}
            subtitle={theme.zaloCardSubtitle}
            membersText={theme.zaloCardMembers}
            buttonText={theme.zaloCardButtonText}
          />
        </div>

        {/* Rich Navigation Footer Pushed to Bottom */}
        <div className="mt-auto pt-6">
          <Footer theme={theme} />
        </div>
      </main>

      {/* Floating Zalo Widget Chatbox with Sanity Dynamic Controls */}
      <FloatingZaloWidget
        zaloUrl={theme.zaloGroupUrl}
        showWidget={theme.showFloatingZalo}
        bubbleText={theme.floatingZaloText}
      />
    </div>
  );
}
