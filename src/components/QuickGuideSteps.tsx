'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function QuickGuideSteps() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111827]/60 backdrop-blur-md px-3 py-2 flex items-center justify-between text-[11px] sm:text-xs">
      <div className="flex items-center gap-1 font-semibold text-slate-200">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px]">
          1
        </span>
        <span>Copy link</span>
      </div>

      <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />

      <div className="flex items-center gap-1 font-semibold text-slate-200">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px]">
          2
        </span>
        <span>Bấm Dán</span>
      </div>

      <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />

      <div className="flex items-center gap-1 font-semibold text-emerald-400">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
          3
        </span>
        <span>Nhận mã</span>
      </div>
    </div>
  );
}
