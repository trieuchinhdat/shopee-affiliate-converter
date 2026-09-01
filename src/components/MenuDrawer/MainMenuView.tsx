'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  BookOpen,
  Smartphone,
  Lock,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { ThemeConfig } from '@/lib/types';
import { ZaloIconSvg } from '@/components/ZaloCommunityCard';

interface MainMenuViewProps {
  theme?: ThemeConfig;
  onNavigateHome: () => void;
  onSelectView: (view: 'guide' | 'shortcut') => void;
  onCloseDrawer: () => void;
}

export default function MainMenuView({
  theme,
  onNavigateHome,
  onSelectView,
  onCloseDrawer,
}: MainMenuViewProps) {
  const [copied, setCopied] = useState(false);
  const zaloUrl = theme?.zaloGroupUrl || 'https://zalo.me/g/kczvyi443';

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.origin : 'https://sanmakhuyenmai.vn';
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-3.5 animate-fadeIn text-slate-200">
      {/* Mini Brand Callout */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="font-black text-xs text-white tracking-tight">
            {theme?.logoText || 'SALE'}<span className="text-orange-400">{theme?.logoHighlightText || 'SỐC'}</span> SHOPEE
          </span>
        </div>
        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/20">
          Voucher 22%
        </span>
      </div>

      {/* 3 Core Actions (Compact List Group) */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Chức năng chính
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/90 divide-y divide-white/5 overflow-hidden shadow-sm">
          {/* 1. Trang chủ */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm">
                <Home className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors truncate">
                Trang chủ
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[11px] text-slate-500">Săn mã</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </button>

          {/* 2. Hướng dẫn */}
          <button
            type="button"
            onClick={() => onSelectView('guide')}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                Hướng dẫn săn mã
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                3 bước
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </button>

          {/* 3. Tạo Shortcut website */}
          <button
            type="button"
            onClick={() => onSelectView('shortcut')}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 text-white shadow-sm">
                <Smartphone className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                Tạo Shortcut App
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                Cài đặt
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Community & Admin (Compact Group) */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Hỗ trợ & Quản trị
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/90 divide-y divide-white/5 overflow-hidden shadow-sm">
          {/* Zalo Group */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-blue-500/10 active:bg-blue-500/15"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0068ff] to-[#0094ff] text-white shadow-sm">
                <ZaloIconSvg className="h-5 w-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors truncate">
                Nhóm Zalo Săn Sale
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </a>

          {/* FAQ */}
          <Link
            href="/faq"
            onClick={onCloseDrawer}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-sm">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                Hỏi đáp thường gặp (FAQ)
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
          </Link>

          {/* Safety Center */}
          <Link
            href="/an-toan"
            onClick={onCloseDrawer}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                Trung tâm an toàn
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
          </Link>

          {/* Privacy Policy */}
          <Link
            href="/chinh-sach-bao-mat"
            onClick={onCloseDrawer}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-sm">
                <Lock className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                Chính sách bảo mật
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
          </Link>

          {/* Admin Login */}
          <Link
            href="/login"
            onClick={onCloseDrawer}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.05] active:bg-white/[0.08]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                Đăng nhập Quản trị
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
          </Link>
        </div>
      </div>

      {/* Quick Copy Link & Footer */}
      <div className="pt-2 border-t border-white/5 space-y-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Đã sao chép link web!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Sao chép link web</span>
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-600 font-mono">
          v1.2 • Shopee Affiliate Converter
        </p>
      </div>
    </div>
  );
}
