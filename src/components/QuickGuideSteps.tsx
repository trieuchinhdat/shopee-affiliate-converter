'use client';

import React from 'react';
import { Copy, ClipboardCheck, ShoppingBag, Zap, Sparkles } from 'lucide-react';

export default function QuickGuideSteps() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827]/60 backdrop-blur-md p-3.5 sm:p-4 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wide">
        <Zap className="h-3.5 w-3.5 text-orange-400" />
        <span>3 Bước Nhận Mã Siêu Nhanh (5 Giây)</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-center flex flex-col items-center justify-between space-y-1.5 hover:border-orange-500/30 transition-colors">
          <div className="h-7 w-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/20">
            1
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-white">Copy Link</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-tight">
              Sao chép link món đồ trên Shopee
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-center flex flex-col items-center justify-between space-y-1.5 hover:border-orange-500/30 transition-colors">
          <div className="h-7 w-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/20">
            2
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-white">Bấm Dán</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-tight">
              Dán vào ô ở trên & lấy mã
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 text-center flex flex-col items-center justify-between space-y-1.5 hover:border-orange-500/30 transition-colors">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20">
            3
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-white">Áp Mã Giảm</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-tight">
              Mở Shopee, mã tự động áp vào giỏ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
