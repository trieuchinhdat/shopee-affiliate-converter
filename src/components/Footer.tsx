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
  const highlightName = theme?.logoHighlightText || 'SỐC';

  return (
    <footer className="w-full text-center space-y-2.5 pb-2">
      {/* 5 Core Navigation Links */}
      <nav className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1.5 text-xs font-medium text-slate-400">
        <Link
          href="/"
          className="hover:text-orange-400 transition-colors py-0.5"
        >
          Trang chủ
        </Link>
        <span className="text-slate-700 select-none hidden sm:inline">•</span>
        <Link
          href="/huong-dan"
          className="hover:text-orange-400 transition-colors py-0.5"
        >
          Hướng dẫn
        </Link>
        <span className="text-slate-700 select-none hidden sm:inline">•</span>
        <Link
          href="/faq"
          className="hover:text-orange-400 transition-colors py-0.5"
        >
          FAQ
        </Link>
        <span className="text-slate-700 select-none hidden sm:inline">•</span>
        <Link
          href="/an-toan"
          className="hover:text-orange-400 transition-colors py-0.5"
        >
          Trung tâm an toàn
        </Link>
        <span className="text-slate-700 select-none hidden sm:inline">•</span>
        <Link
          href="/chinh-sach-bao-mat"
          className="hover:text-orange-400 transition-colors py-0.5"
        >
          Chính sách bảo mật
        </Link>
      </nav>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Mở App Shopee Chính Hãng
        </span>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <span className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-orange-400" />
          Cập Nhật Real-time
        </span>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <span className="flex items-center gap-1 text-slate-500">
          <Lock className="h-3.5 w-3.5 text-blue-400" />
          100% Miễn Phí & An Toàn
        </span>
      </div>

      {/* Copyright */}
      <p className="text-[10.5px] text-slate-600 font-normal">
        © 2026 {brandName}{highlightName} Converter. All rights reserved.
      </p>
    </footer>
  );
}
