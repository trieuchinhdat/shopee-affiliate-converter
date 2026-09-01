'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, User } from 'lucide-react';
import { ThemeConfig } from '@/lib/types';

interface HeaderProps {
  theme?: ThemeConfig;
}

export default function Header({ theme }: HeaderProps) {
  const logoType = theme?.logoType || 'text';
  const logoText = theme?.logoText || 'SALE';
  const logoHighlight = theme?.logoHighlightText || 'SỐC';
  const logoBadge = theme?.logoBadge || 'VIP';
  const subTitle = theme?.subTitle || 'Voucher Hunter Shopee';
  const logoImg = theme?.logoImageUrl;

  const hasImageLogo = logoType === 'image' && Boolean(logoImg);

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md border-white/[0.08] transition-all">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        {/* Dynamic Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform active:scale-95">
          {hasImageLogo ? (
            <div className="relative h-10 w-32 shrink-0 overflow-hidden">
              <Image
                src={logoImg!}
                alt={logoText}
                fill
                className="object-contain object-left"
                unoptimized
              />
            </div>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-shopee-orange to-orange-500 shadow-lg shadow-orange-500/25 shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-tight text-lg text-white">
                    {logoText}<span className="text-orange-400">{logoHighlight}</span>
                  </span>
                  {logoBadge && (
                    <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-orange-400 border border-orange-500/30">
                      {logoBadge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{subTitle}</p>
              </div>
            </>
          )}
        </Link>

        {/* User Login Icon Navigating to /login */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface text-slate-300 transition-all hover:border-orange-500/40 hover:text-white hover:bg-white/5 active:scale-95 shadow-sm"
            title="Đăng nhập Quản trị"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
