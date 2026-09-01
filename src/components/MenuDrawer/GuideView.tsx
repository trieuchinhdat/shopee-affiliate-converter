'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, Zap, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface GuideViewProps {
  onCloseDrawer: () => void;
}

export default function GuideView({ onCloseDrawer }: GuideViewProps) {
  const steps = [
    {
      number: '1',
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-500',
      title: 'Sao chép link Shopee',
      desc: 'Mở app Shopee > Trang sản phẩm > Bấm Chia sẻ > "Sao chép liên kết".',
    },
    {
      number: '2',
      icon: Zap,
      color: 'from-amber-500 to-yellow-500',
      title: 'Dán link & Kích hoạt',
      desc: 'Dán link vào web > Bấm "Dán & Lấy mã" để kích hoạt mã FB 22%, YTB 20%.',
    },
    {
      number: '3',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      title: 'Mở App & Chốt đơn',
      desc: 'Bấm nút mã mong muốn > Shopee tự động mở & áp voucher vào giỏ hàng.',
    },
  ];

  const goldenHours = ['00:00', '09:00', '12:00', '18:00', '20:00'];

  return (
    <div className="space-y-3 animate-fadeIn text-slate-200">
      {/* 3 Steps List */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          3 Bước săn mã nhanh
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111827]/90 divide-y divide-white/5 overflow-hidden">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="p-3 flex items-start gap-2.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${step.color} text-white font-bold text-xs shadow-sm`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{step.title}</span>
                    <span className="text-[9px] text-slate-400 font-mono">B{step.number}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Golden Hours Pills */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/90 p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Giờ vàng mở thêm mã 22% & 20%</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {goldenHours.map((time) => (
            <span
              key={time}
              className="flex-1 text-center font-mono font-bold text-orange-300 text-[11px] bg-orange-500/10 border border-orange-500/20 py-1 rounded-lg"
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={onCloseDrawer}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-shopee-orange to-orange-500 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
      >
        <span>Bắt đầu săn mã ngay</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
