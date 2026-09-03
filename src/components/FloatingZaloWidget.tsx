'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ZaloIconSvg } from './ZaloCommunityCard';

interface FloatingZaloWidgetProps {
  zaloUrl?: string;
  showWidget?: boolean;
  bubbleText?: string;
}

export default function FloatingZaloWidget({
  zaloUrl = 'https://zalo.me/g/kczvyi443',
  showWidget = true,
  bubbleText = 'Nhận mã 22% & mã Live sớm nhất! 💬',
}: FloatingZaloWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  if (showWidget === false) return null;

  return (
    <aside
      aria-label="Hỗ trợ Zalo"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto transform-gpu select-none"
    >
      {/* Speech Bubble Callout */}
      {showTooltip && (
        <div className="relative animate-fadeIn flex items-start gap-2.5 rounded-2xl border border-blue-500/30 bg-[#111827]/95 p-3 text-xs text-white shadow-2xl shadow-blue-950/60 backdrop-blur-md max-w-[210px] sm:max-w-[230px] transition-all">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group/bubble"
          >
            <div className="flex items-center gap-1.5 font-bold text-blue-400 text-[11px] group-hover/bubble:text-blue-300 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Nhóm Săn Sale Zalo</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug group-hover/bubble:text-white transition-colors">
              {bubbleText}
            </p>
          </a>

          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-2 -mr-1.5 -mt-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors shrink-0"
            title="Đóng thông báo"
            aria-label="Đóng thông báo Zalo"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Pointer Triangle Centered Above Zalo Circle Button */}
          <div className="absolute -bottom-1.5 right-5 sm:right-6 h-3 w-3 rotate-45 border-r border-b border-blue-500/30 bg-[#111827]" />
        </div>
      )}

      {/* Floating Zalo Button */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#0068ff] via-[#007cf0] to-[#0094ff] shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        title="Tham gia nhóm Zalo Báo Mã Săn Sale"
        aria-label="Tham gia nhóm Zalo Báo Mã Săn Sale"
      >
        {/* Controlled Glowing Halo - Safe for screen bounds */}
        <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-pulse pointer-events-none" />

        {/* Zalo Icon */}
        <ZaloIconSvg className="h-8 w-8 sm:h-9 sm:w-9 rounded-full drop-shadow-md z-10 transition-transform group-hover:scale-105" />

        {/* Online Status Pill */}
        <span className="absolute top-0 right-0 z-20 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#111827]" />
        </span>
      </a>
    </aside>
  );
}
