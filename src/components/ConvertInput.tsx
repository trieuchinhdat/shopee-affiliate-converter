'use client';

import React, { useState, useRef } from 'react';
import { Clipboard, Sparkles, X, Loader2, ArrowRight, Zap, Link as LinkIcon } from 'lucide-react';

interface ConvertInputProps {
  onConvert: (url: string) => Promise<void>;
  isLoading: boolean;
}

// Smart URL Extractor: extracts pure Shopee URL from messy shared text
export function extractShopeeUrl(text: string): string | null {
  if (!text) return null;
  const match = text.match(/(https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:shopee\.vn|shp\.ee)[^\s]*)/i);
  if (match && match[1]) {
    return match[1].replace(/[.,;:!?)\]]+$/, '').trim();
  }
  return null;
}

export default function ConvertInput({ onConvert, isLoading }: ConvertInputProps) {
  const [url, setUrl] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (url.trim() && !isLoading) {
      const clean = extractShopeeUrl(url.trim()) || url.trim();
      setUrl(clean);
      triggerHaptic();
      onConvert(clean);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Friendly Notice Toast */}
      {notice && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-2.5 text-xs text-amber-200 backdrop-blur-md animate-fadeIn shadow-lg shadow-amber-950/30">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="flex-1 font-medium">{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
        {/* Input Bar */}
        <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#111827] p-1 shadow-xl transition-all focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20">
          <div className="pl-3 text-slate-400">
            <LinkIcon className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handleNativePaste}
            placeholder="Dán link Shopee (vd: https://s.shopee.vn/...)"
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            disabled={isLoading}
          />

          {url ? (
            <button
              type="button"
              onClick={handleClear}
              className="mr-1 rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Xóa link"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSmartAction}
              className="mr-1 flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors shrink-0"
              title="Dán từ bộ nhớ tạm"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Dán</span>
            </button>
          )}
        </div>

        {/* Clean Action Button */}
        <button
          type="button"
          onClick={handleSmartAction}
          disabled={isLoading}
          className={`relative flex h-13 sm:h-14 w-full items-center justify-center gap-2 rounded-2xl font-bold text-sm sm:text-base text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-75 ${
            url.trim()
              ? 'bg-gradient-to-r from-[#ee4d2d] via-orange-500 to-amber-500 shadow-orange-500/35 hover:brightness-110'
              : 'bg-gradient-to-r from-[#ee4d2d] via-orange-600 to-amber-600 shadow-orange-600/30 hover:brightness-110'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang lấy mã giảm giá...</span>
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
      </form>
    </div>
  );
}
