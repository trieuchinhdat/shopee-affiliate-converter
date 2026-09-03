'use client';

import React from 'react';
import { ArrowUpRight, Users, BellRing, ShieldCheck } from 'lucide-react';

interface ZaloCommunityCardProps {
  zaloUrl?: string;
  showCard?: boolean;
  title?: string;
  subtitle?: string;
  membersText?: string;
  buttonText?: string;
}

export function ZaloIconSvg({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="512" height="512" rx="120" fill="#0068FF" />
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="170"
        letterSpacing="-3"
      >
        Zalo
      </text>
    </svg>
  );
}

export default function ZaloCommunityCard({
  zaloUrl = 'https://zalo.me/g/kczvyi443',
  showCard = true,
  title = 'Nhóm Zalo Báo Mã Săn Sale',
  subtitle = 'Báo mã FB 22%, Shopee Live & Flash Sale trước 15 phút',
  membersText = 'Hơn 15.000+ thành viên',
  buttonText = 'Vào Nhóm Zalo Săn Sale (Miễn Phí)',
}: ZaloCommunityCardProps) {
  if (showCard === false) return null;

  return (
    <section
      aria-label="Cộng đồng Zalo săn sale"
      className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0c1834] via-[#0f2347] to-[#0a1426] p-4 sm:p-5 shadow-2xl shadow-blue-950/40 transition-all hover:border-blue-500/50 transform-gpu"
    >
      {/* Subtle Internal Ambient Gradient Glow (Contained within bounds) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-cyan-500/10" />

      <div className="relative space-y-3.5">
        {/* Header with Zalo Icon and Status */}
        <div className="flex items-center gap-3">
          {/* Zalo Icon with Pulse Badge */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/25">
            <ZaloIconSvg className="h-10 w-10 rounded-xl" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-[#0b0f19]" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                {title}
              </h2>
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[9px] font-extrabold text-blue-300 border border-blue-400/30">
                MIỄN PHÍ
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-blue-200/85 mt-0.5 leading-snug line-clamp-2">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Benefits & Social Proof Pill on Mobile */}
        <div className="flex items-center justify-between rounded-xl bg-blue-950/60 border border-blue-500/20 px-3.5 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Users className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{membersText}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Admin trực 24/7</span>
          </div>
        </div>

        {/* Action Button (Full-width on Mobile for Thumb Ergonomics) */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0068ff] via-[#007cf0] to-[#0089ff] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span>{buttonText}</span>
          <ArrowUpRight className="h-4 w-4 text-white/90" />
        </a>
      </div>
    </section>
  );
}
