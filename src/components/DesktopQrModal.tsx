'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, X, Copy, Check, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface DesktopQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function DesktopQrModal({
  isOpen,
  onClose,
  title = 'Mở trên điện thoại để nhận mã 25%',
  subtitle = 'Mã giảm giá Shopee độc quyền và tính năng tự động mở App hoạt động tối ưu nhất trên điện thoại di động.',
}: DesktopQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback if clipboard API is blocked
      const input = document.createElement('input');
      input.value = currentUrl || window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&format=svg&margin=10&data=${encodeURIComponent(
    currentUrl || 'https://sanmakhuyenmai.vn'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-orange-500/30 bg-[#0f172a] p-6 shadow-2xl shadow-orange-950/60 transition-all sm:p-7 z-10">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-500/25 to-amber-500/10 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ưu Đãi Độc Quyền App Shopee</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {subtitle}
        </p>

        {/* QR Code Section */}
        <div className="my-5 flex flex-col items-center">
          <div className="group relative rounded-2xl bg-white p-3 shadow-xl ring-4 ring-orange-500/20 transition-all hover:ring-orange-500/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt="Mã QR mở web săn mã Shopee trên điện thoại"
              width={200}
              height={200}
              className="h-44 w-44 sm:h-48 sm:w-48 rounded-lg object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-full bg-orange-500 p-1.5 shadow-md border-2 border-white">
                <Smartphone className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <span className="mt-2 text-[11px] font-medium text-slate-400">
            Dùng Camera hoặc Zalo quét mã để mở web
          </span>
        </div>

        {/* 3-Step Quick Guide */}
        <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">
              1
            </span>
            <span>Mở Camera điện thoại hoặc Zalo quét mã QR</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">
              2
            </span>
            <span>Bấm vào thông báo để mở trang web trên điện thoại</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-400">
              3
            </span>
            <span className="font-semibold text-amber-300">
              Dán link & nhận voucher 25% nhảy thẳng vào App Shopee
            </span>
          </div>
        </div>

        {/* Secondary Action: Copy Link */}
        <div className="mt-4 pt-1 flex flex-col gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Đã sao chép link! Dán vào Zalo để mở trên điện thoại</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-400" />
                <span>Sao chép link web gửi qua Zalo / Tin nhắn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
