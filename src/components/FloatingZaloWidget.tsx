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
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-1.5 pointer-events-auto">
      {/* Speech Bubble Callout */}
      {showTooltip && (
        <div className="relative animate-fadeIn flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-[#111827]/95 px-3 py-2 text-xs text-white shadow-2xl shadow-blue-500/20 backdrop-blur-md max-w-[195px]">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 hover:text-blue-300 transition-colors"
          >
            <div className="flex items-center gap-1 font-bold text-blue-400 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>Nhóm Săn Sale Zalo</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
              {bubbleText}
            </p>
          </a>

          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 -mr-1 rounded transition-colors shrink-0"
            title="Đóng thông báo"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="absolute -bottom-1 right-5 h-2.5 w-2.5 rotate-45 border-r border-b border-blue-500/30 bg-[#111827]" />
        </div>
      )}

      {/* Floating Zalo Button */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#0068ff] to-[#0089ff] shadow-xl shadow-blue-500/40 transition-all hover:scale-110 active:scale-95 duration-200"
        title="Tham gia nhóm Zalo Báo Mã Săn Sale"
      >
        <span className="absolute -inset-1 rounded-full bg-blue-500/35 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full border-2 border-blue-400/40 animate-pulse pointer-events-none" />
        <ZaloIconSvg className="h-9 w-9 sm:h-10 sm:w-10 rounded-full drop-shadow-md z-10 transition-transform group-hover:rotate-12" />

        <span className="absolute top-0 right-0 z-20 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0f19]" />
        </span>
      </a>
    </div>
  );
}
