'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Menu } from 'lucide-react';
import { ThemeConfig } from '@/lib/types';
import MenuDrawer from './MenuDrawer';

interface HeaderProps {
  theme?: ThemeConfig;
}

export default function Header({ theme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoType = theme?.logoType || 'text';
  const logoText = theme?.logoText || 'SALE';
  const logoHighlight = theme?.logoHighlightText || 'HUNTER';
  const logoBadge = theme?.logoBadge || 'VIP';
  const subTitle = theme?.subTitle || 'Sale Hunter Shopee';
  const logoImg = theme?.logoImageUrl;

  const hasImageLogo = logoType === 'image' && Boolean(logoImg);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur-md border-white/[0.08] transition-all transform-gpu">
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

          {/* Menu Button Opening Drawer */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface text-slate-200 transition-all hover:border-orange-500/50 hover:text-white hover:bg-white/5 active:scale-95 shadow-sm group p-2.5"
              title="Mở Menu Tiện Ích"
              aria-label="Mở Menu Tiện Ích"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-5 w-5 transition-transform group-hover:scale-110 text-slate-200 group-hover:text-orange-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border-2 border-[#0b0f19]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Drawer Component */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        theme={theme}
      />
    </>
  );
}

