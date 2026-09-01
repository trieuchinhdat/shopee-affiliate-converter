'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ConvertInput from '@/components/ConvertInput';
import ProductCard from '@/components/ProductCard';
import VoucherButtons from '@/components/VoucherButtons';
import ConversionHistory from '@/components/ConversionHistory';
import ZaloCommunityCard from '@/components/ZaloCommunityCard';
import FloatingZaloWidget from '@/components/FloatingZaloWidget';
import { ConvertResult, ShopeeProduct, ThemeConfig } from '@/lib/types';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface HomeClientProps {
  initialTheme: ThemeConfig;
}

export default function HomeClient({ initialTheme }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ product: ShopeeProduct; timestamp: string }>>([]);
  const [theme] = useState<ThemeConfig>(initialTheme);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('shopee_converter_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleConvert = async (url: string) => {
    setIsLoading(true);
    setErrorMsg(null);

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

      setResult(data);

      if (data.product) {
        const updated = [
          { product: data.product, timestamp: new Date().toISOString() },
          ...history.filter((h) => h.product.itemId !== data.product?.itemId),
        ].slice(0, 10);

        setHistory(updated);
        try {
          localStorage.setItem('shopee_converter_history', JSON.stringify(updated));
        } catch {
          // Ignore
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('shopee_converter_history');
    } catch {
      // Ignore
    }
  };

  const getContainerStyle = () => {
    if (!theme) return {};

    if (theme.backgroundType === 'image' && theme.backgroundImageUrl) {
      return {
        backgroundImage: `linear-gradient(rgba(11, 15, 25, ${(theme.backgroundOverlayOpacity ?? 85) / 100}), rgba(11, 15, 25, ${(theme.backgroundOverlayOpacity ?? 85) / 100})), url('${theme.backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }

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
      className="min-h-screen pb-24 sm:pb-20 flex flex-col items-center transition-colors duration-300 relative"
    >
      <Header theme={theme} />

      <main className="w-full max-w-xl px-3 sm:px-4 pt-4 sm:pt-5 space-y-4">
        {/* Dynamic Hero Section (Instant Server-Rendered, 0ms Lag) */}
        <div className="text-center space-y-1.5 py-1">
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

        {/* Input Form */}
        <ConvertInput onConvert={handleConvert} isLoading={isLoading} />

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-3 text-center text-xs font-medium text-rose-300">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Result: Product Card & Voucher Buttons */}
        {result?.product && result.links && result.vouchers && (
          <div className="space-y-3.5 pt-1 animate-fadeIn">
            <ProductCard
              product={result.product}
              savingsEstimate={result.savingsEstimate}
            />

            <VoucherButtons
              vouchers={result.vouchers}
              links={result.links}
              productName={result.product.productName}
              conversionLogId={result.conversionLogId}
            />
          </div>
        )}

        {/* Zalo Support Community Card with Sanity Dynamic Controls */}
        <ZaloCommunityCard
          zaloUrl={theme.zaloGroupUrl}
          showCard={theme.showZaloCard}
          title={theme.zaloCardTitle}
          subtitle={theme.zaloCardSubtitle}
          membersText={theme.zaloCardMembers}
          buttonText={theme.zaloCardButtonText}
        />

        {/* User Conversion History */}
        <ConversionHistory
          history={history}
          onSelect={handleConvert}
          onClear={handleClearHistory}
        />

        {/* Footer Trust Badges */}
        <div className="pt-3 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Mở App Shopee Chính Hãng
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-orange-400" />
              Cập nhật mã Real-time
            </span>
          </div>
          <p className="text-[10px] text-slate-600">
            © 2026 {theme.logoText || 'SALE'}{theme.logoHighlightText || 'SỐC'} Affiliate Converter. All rights reserved.
          </p>
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
