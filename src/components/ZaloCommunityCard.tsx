'use client';

import React from 'react';
import { ArrowUpRight, Users, BellRing } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-br from-[#0a162e] via-[#0d2149] to-[#071120] p-4 sm:p-5 shadow-2xl shadow-blue-950/40 transition-all hover:border-blue-500/40">
      {/* Subtle Ambient Background Light */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative space-y-3">
        {/* Header with Zalo Icon and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Zalo Icon with Pulse Ring */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-blue-500/30">
              <ZaloIconSvg className="h-11 w-11 rounded-2xl" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border border-[#0b0f19]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-black text-white tracking-tight">
                  {title}
                </h4>
                <span className="rounded-md bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-blue-300 border border-blue-400/30">
                  MIỄN PHÍ
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 mt-0.5 leading-snug">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits & Social Proof Pill on Mobile */}
        <div className="flex items-center justify-between rounded-xl bg-blue-950/40 border border-blue-500/15 px-3 py-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>{membersText}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin trực 24/7</span>
          </div>
        </div>

        {/* Action Button (Full-width on Mobile for Thumb Ergonomics) */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0068ff] to-[#0089ff] py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <BellRing className="h-4 w-4 text-white animate-bounce" />
          <span>{buttonText}</span>
          <ArrowUpRight className="h-4 w-4 text-white/80" />
        </a>
      </div>
    </div>
  );
}
