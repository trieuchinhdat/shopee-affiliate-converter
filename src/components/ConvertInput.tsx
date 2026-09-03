'use client';

import React, { useState, useRef } from 'react';
import { Clipboard, Sparkles, X, Loader2, ArrowRight, Zap, Link as LinkIcon, QrCode, Smartphone } from 'lucide-react';
import { useIsDesktop } from '@/lib/device';
import DesktopQrModal from '@/components/DesktopQrModal';

interface ConvertInputProps {
  onConvert: (url: string) => Promise<void>;
  isLoading: boolean;
  blockDesktopConvert?: boolean;
  desktopButtonText?: string;
  desktopModalTitle?: string;
  desktopModalSubtitle?: string;
}

// Smart URL Extractor: extracts pure Shopee URL from messy shared text or direct inputs
export function extractShopeeUrl(text: string): string | null {
  if (!text) return null;
  const cleanText = text.trim();

  // Pattern with http/https
  const match = cleanText.match(/(https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:shopee\.[a-z.]+|shp\.ee|shope\.ee)[^\s]*)/i);
  if (match && match[1]) {
    return match[1].replace(/[.,;:!?)\]"'>]+$/, '').trim();
  }

  // Pattern without http/https (e.g. shopee.vn/product/... or s.shopee.vn/...)
  const matchNoProto = cleanText.match(/((?:[a-zA-Z0-9-]+\.)*(?:shopee\.[a-z.]+|shp\.ee|shope\.ee)\/[^\s]*)/i);
  if (matchNoProto && matchNoProto[1]) {
    return `https://${matchNoProto[1].replace(/[.,;:!?)\]"'>]+$/, '').trim()}`;
  }

  return null;
}

export default function ConvertInput({
  onConvert,
  isLoading,
  blockDesktopConvert,
  desktopButtonText,
  desktopModalTitle,
  desktopModalSubtitle,
}: ConvertInputProps) {
  const [url, setUrl] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDesktop = useIsDesktop();
  const isDesktopBlocked = isDesktop && blockDesktopConvert !== false;

  const showTemporaryNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(null);
    }, 3000);
  };

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    } catch {
      // Ignore if not supported
    }
  };

  const handleSmartAction = async () => {
    if (isLoading) return;

    if (isDesktopBlocked) {
      setIsQrModalOpen(true);
      return;
    }

    if (url.trim()) {
      const clean = extractShopeeUrl(url.trim()) || url.trim();
      setUrl(clean);
      triggerHaptic();
      await onConvert(clean);
      return;
    }

    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        const extracted = extractShopeeUrl(text.trim());

        if (extracted) {
          setUrl(extracted);
          triggerHaptic();
          await onConvert(extracted);
          return;
        } else if (text.trim().length > 0) {
          showTemporaryNotice('⚠️ Bộ nhớ tạm không chứa link Shopee. Vui lòng sao chép link từ App Shopee!');
          inputRef.current?.focus();
          return;
        }
      }
    } catch {
      // Browser blocked clipboard reading
    }

    inputRef.current?.focus();
    showTemporaryNotice('👉 Vui lòng dán link Shopee vào ô bên dưới!');
  };

  const handleNativePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isDesktopBlocked) {
      e.preventDefault();
      setIsQrModalOpen(true);
      return;
    }

    const pastedText = e.clipboardData.getData('text');
    const extracted = extractShopeeUrl(pastedText);

    if (extracted) {
      e.preventDefault();
      setUrl(extracted);
      triggerHaptic();
      setTimeout(() => {
        onConvert(extracted);
      }, 150);
    }
  };

  const handleClear = () => {
    setUrl('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDesktopBlocked) {
      setIsQrModalOpen(true);
      return;
    }
    if (url.trim() && !isLoading) {
      const clean = extractShopeeUrl(url.trim()) || url.trim();
      setUrl(clean);
      triggerHaptic();
      onConvert(clean);
    }
  };

  return (
    <div id="convert-input-section" className="w-full space-y-2.5">
      {/* Friendly Notice Toast */}
      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-2.5 text-xs text-amber-200 backdrop-blur-md animate-fadeIn shadow-lg shadow-amber-950/30">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="flex-1 font-medium">{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-amber-400 hover:text-white p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Đóng thông báo"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2.5">
        {/* Prominent Input Bar */}
        <div className="relative flex items-center rounded-2xl border-2 border-orange-500/50 bg-[#111827] p-1.5 shadow-lg shadow-orange-950/30 transition-all hover:border-orange-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/25">
          <div className="pl-3 text-orange-400">
            <LinkIcon className="h-4 w-4" />
          </div>

          <input
            id="convert-input-field"
            ref={inputRef}
            type="text"
            value={url}
            aria-label="Nhập link sản phẩm Shopee"
            onChange={(e) => {
              if (isDesktopBlocked) return;
              setUrl(e.target.value);
            }}
            onPaste={handleNativePaste}
            onClick={() => {
              if (isDesktopBlocked) setIsQrModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (isDesktopBlocked && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                setIsQrModalOpen(true);
              }
            }}
            readOnly={isDesktopBlocked}
            placeholder={
              isDesktopBlocked
                ? 'Quét mã QR để mở trên điện thoại & nhận mã...'
                : 'Dán link Shopee (vd: https://s.shopee.vn/...)'
            }
            className={`w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
              isDesktopBlocked ? 'cursor-pointer select-none' : ''
            }`}
            disabled={isLoading}
          />

          {url && !isDesktopBlocked ? (
            <button
              type="button"
              onClick={handleClear}
              className="mr-1 rounded-xl p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Xóa link"
              aria-label="Xóa link đã nhập"
            >
              <X className="h-4 w-4" />
            </button>
          ) : isDesktopBlocked ? (
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="mr-1 flex items-center gap-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 px-3 py-2 min-h-[40px] text-xs font-bold text-orange-300 hover:bg-orange-500/25 hover:text-white transition-all shrink-0"
              title="Quét mã QR để mở trên điện thoại"
              aria-label="Quét mã QR để mở trên điện thoại"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Mã QR</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSmartAction}
              className="mr-1 flex items-center gap-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 px-3 py-2 min-h-[40px] text-xs font-bold text-orange-300 hover:bg-orange-500/25 hover:text-white transition-all shrink-0"
              title="Dán từ bộ nhớ tạm"
              aria-label="Dán link từ bộ nhớ tạm"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Dán</span>
            </button>
          )}
        </div>

        {/* Clean Action Button with Generous Mobile Padding */}
        <button
          type="button"
          onClick={handleSmartAction}
          disabled={isLoading}
          className={`relative flex min-h-[54px] sm:min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-extrabold text-sm sm:text-base tracking-wide text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-75 ${
            isDesktopBlocked
              ? 'bg-gradient-to-r from-[#ee4d2d] via-orange-600 to-amber-600 shadow-orange-600/30 hover:brightness-110'
              : url.trim()
              ? 'bg-gradient-to-r from-[#ee4d2d] via-orange-500 to-amber-500 shadow-orange-500/35 hover:brightness-110'
              : 'bg-gradient-to-r from-[#ee4d2d] via-orange-600 to-amber-600 shadow-orange-600/30 hover:brightness-110'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang lấy mã giảm giá...</span>
            </>
          ) : isDesktopBlocked ? (
            <>
              <span>{desktopButtonText || 'QUÉT MÃ MỞ TRÊN ĐIỆN THOẠI'}</span>
              <QrCode className="h-5 w-5 text-amber-300" />
            </>
          ) : url.trim() ? (
            <>
              <span>LẤY MÃ GIẢM GIÁ</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>DÁN & LẤY MÃ NGAY</span>
              <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
            </>
          )}
        </button>

        {/* Desktop Hint */}
        {isDesktopBlocked && (
          <div className="flex items-center justify-center gap-1.5 text-center text-xs text-orange-400/90 font-medium pt-1">
            <Smartphone className="h-3.5 w-3.5 shrink-0" />
            <span>Mã giảm giá áp dụng trên Shopee App. Bấm để quét mã QR mở trên điện thoại.</span>
          </div>
        )}
      </form>

      {/* Desktop QR Modal */}
      <DesktopQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title={desktopModalTitle}
        subtitle={desktopModalSubtitle}
      />
    </div>
  );
}
