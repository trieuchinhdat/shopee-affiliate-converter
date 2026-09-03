'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { ThemeConfig } from '@/lib/types';

interface FooterProps {
  theme?: ThemeConfig;
}

export default function Footer({ theme }: FooterProps) {
  const brandName = theme?.logoText || 'SALE';
  const highlightName = theme?.logoHighlightText || 'HUNTER';

  return (
    <footer className="w-full text-center space-y-3 pb-2">
      {/* 5 Core Navigation Links with Accessible Touch Targets (>= 44px) */}
      <nav className="flex items-center justify-center flex-wrap gap-x-1 sm:gap-x-2 gap-y-2 text-xs font-medium text-slate-300">
        <Link
          href="/"
          className="hover:text-orange-400 transition-colors py-2 px-2.5 inline-flex items-center min-h-[44px] rounded-lg hover:bg-white/5 active:scale-95"
        >
          Trang chủ
        </Link>
        <span className="text-slate-600 select-none hidden sm:inline self-center">•</span>
        <Link
          href="/huong-dan"
          className="hover:text-orange-400 transition-colors py-2 px-2.5 inline-flex items-center min-h-[44px] rounded-lg hover:bg-white/5 active:scale-95"
        >
          Hướng dẫn
        </Link>
        <span className="text-slate-600 select-none hidden sm:inline self-center">•</span>
        <Link
          href="/faq"
          className="hover:text-orange-400 transition-colors py-2 px-2.5 inline-flex items-center min-h-[44px] rounded-lg hover:bg-white/5 active:scale-95"
        >
          FAQ
        </Link>
        <span className="text-slate-600 select-none hidden sm:inline self-center">•</span>
        <Link
          href="/an-toan"
          className="hover:text-orange-400 transition-colors py-2 px-2.5 inline-flex items-center min-h-[44px] rounded-lg hover:bg-white/5 active:scale-95"
        >
          Trung tâm an toàn
        </Link>
        <span className="text-slate-600 select-none hidden sm:inline self-center">•</span>
        <Link
          href="/chinh-sach-bao-mat"
          className="hover:text-orange-400 transition-colors py-2 px-2.5 inline-flex items-center min-h-[44px] rounded-lg hover:bg-white/5 active:scale-95"
        >
          Chính sách bảo mật
        </Link>
      </nav>

      {/* Trust Badges with WCAG AA Compliant Text Contrast */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 flex-wrap">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Mở App Shopee Chính Hãng
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-orange-400" />
          Cập Nhật Real-time
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="flex items-center gap-1 text-slate-400">
          <Lock className="h-3.5 w-3.5 text-blue-400" />
          100% Miễn Phí & An Toàn
        </span>
      </div>

      {/* Copyright with High Contrast Text */}
      <p className="text-[11px] text-slate-400 font-normal">
        © 2026 {brandName}{highlightName} Converter. All rights reserved.
      </p>
    </footer>
  );
}
